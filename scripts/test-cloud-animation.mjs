import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Use the project's TypeScript compiler so these tests also run on Node 20.
const source = readFileSync(
  new URL("../src/components/motion/cloudAnimation.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { getCloudRenderScale, startCloudAnimation } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

function createRuntime(t, reducedMotion = false) {
  const originalGlobals = new Map();
  const pendingFrames = new Map();
  let nextId = 0;
  const document = Object.assign(new EventTarget(), { hidden: false });
  const motionQuery = Object.assign(new EventTarget(), { matches: reducedMotion });
  const window = Object.assign(new EventTarget(), { matchMedia: () => motionQuery });
  let animation;
  const globals = {
    document,
    window,
    requestAnimationFrame: (callback) => {
      pendingFrames.set(++nextId, callback);
      return nextId;
    },
    cancelAnimationFrame: (id) => pendingFrames.delete(id),
  };

  for (const [key, value] of Object.entries(globals)) {
    originalGlobals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  t.after(() => {
    animation?.destroy();
    for (const [key, descriptor] of originalGlobals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });

  let renders = 0;
  let resizes = 0;
  let legacyFrames = 0;
  const effect = {
    req: requestAnimationFrame(() => legacyFrames++),
    uniforms: { iTime: { value: 1 }, iTex: { value: { image: {} } } },
    renderer: {
      setClearColor() {},
      render() {
        renders++;
      },
    },
    options: { backgroundColor: 0, backgroundAlpha: 1 },
    scene: {},
    camera: {},
    resize() {
      resizes++;
    },
  };
  animation = startCloudAnimation(effect);

  return {
    effect,
    animation,
    document,
    motionQuery,
    window,
    get pending() {
      return pendingFrames.size;
    },
    get renders() {
      return renders;
    },
    get resizes() {
      return resizes;
    },
    get legacyFrames() {
      return legacyFrames;
    },
    frame(now) {
      const callbacks = [...pendingFrames.values()];
      pendingFrames.clear();
      callbacks.forEach((callback) => callback(now));
      assert.ok(pendingFrames.size <= 1, "only one cloud animation loop may be scheduled");
    },
  };
}

test("Retina, 4K and mobile screens stay inside the cloud pixel budget", () => {
  for (const [width, height, dpr] of [
    [1440, 900, 2],
    [3840, 2160, 2],
    [390, 844, 3],
    [1920, 1080, 1],
  ]) {
    const ratio = dpr / getCloudRenderScale(width, height, dpr);
    assert.ok(width * height * ratio ** 2 <= 960 * 540 + 1);
    assert.ok(ratio <= 1, "background must not render at Retina pixel density");
    if (width < 600) assert.ok(ratio <= 0.5, "phones need headroom for the page compositor");
  }
  const full = 2 / getCloudRenderScale(1440, 900, 2);
  const reduced = 2 / getCloudRenderScale(1440, 900, 2, 0.5);
  assert.equal(reduced ** 2 / full ** 2, 0.25);
});

for (const hz of [30, 60, 120, 144]) {
  test(`clouds move the same distance in one second at ${hz} Hz`, (t) => {
    const runtime = createRuntime(t);
    for (let i = 0; i <= hz; i++) runtime.frame((i * 1000) / hz);
    assert.ok(Math.abs(runtime.effect.uniforms.iTime.value - 2) < 0.000001);
    assert.equal(runtime.legacyFrames, 0, "the original Vanta loop must be cancelled");
  });
}

test("long frames and returning from a hidden tab do not jump the cloud position", (t) => {
  const runtime = createRuntime(t);
  runtime.frame(0);
  runtime.frame(16);
  runtime.frame(2016);
  assert.ok(Math.abs(runtime.effect.uniforms.iTime.value - 1.066) < 0.000001);

  runtime.document.hidden = true;
  runtime.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(runtime.pending, 0);
  const pausedTime = runtime.effect.uniforms.iTime.value;
  runtime.document.hidden = false;
  runtime.document.dispatchEvent(new Event("visibilitychange"));
  runtime.frame(60000);
  assert.equal(runtime.effect.uniforms.iTime.value, pausedTime);
  runtime.frame(60016);
  assert.ok(Math.abs(runtime.effect.uniforms.iTime.value - pausedTime - 0.016) < 0.000001);
});

test("sustained slow frames reduce resolution, while a single hitch does not", (t) => {
  const runtime = createRuntime(t);
  runtime.frame(0);
  runtime.frame(1600);
  for (let i = 1; i <= 12; i++) runtime.frame(1600 + (i * 1000) / 60);
  assert.equal(runtime.resizes, 0);
  for (let i = 1; i <= 120; i++) runtime.frame(1800 + i * 100);
  assert.equal(runtime.effect._cloudQuality, 0.5);
  const resizes = runtime.resizes;
  for (let i = 121; i <= 180; i++) runtime.frame(1800 + i * 100);
  assert.equal(runtime.resizes, resizes, "quality must stop reallocating at its lower bound");
});

test("an occasional dropped frame pattern is corrected before most frames become slow", (t) => {
  const runtime = createRuntime(t);
  let now = 0;
  runtime.frame(now);
  for (let i = 1; i <= 60; i++) {
    now += i % 5 === 0 ? 1000 / 30 : 1000 / 60;
    runtime.frame(now);
  }
  assert.ok(runtime.resizes > 0, "sustained 50 FPS should not evade the quality controller");
  assert.ok(runtime.effect._cloudQuality < 1);
});

test("heavy GPU overload is addressed within the first sampling window", (t) => {
  const runtime = createRuntime(t);
  for (let i = 0; i <= 12; i++) runtime.frame(i * 100);
  assert.equal(runtime.effect._cloudQuality, 0.5);
  assert.equal(runtime.resizes, 1);
});

test("very slow GPUs still trigger adaptation instead of being mistaken for isolated stalls", (t) => {
  const runtime = createRuntime(t);
  for (let i = 0; i <= 12; i++) runtime.frame(i * 500);
  assert.equal(runtime.effect._cloudQuality, 0.5);
});

test("one long stall followed by healthy frames does not permanently soften the sky", (t) => {
  const runtime = createRuntime(t);
  runtime.frame(0);
  runtime.frame(1600);
  for (let i = 1; i <= 120; i++) runtime.frame(1600 + (i * 1000) / 60);
  assert.equal(runtime.resizes, 0);
});

test("reduced motion waits for the texture, then stays static and can redraw a theme change", (t) => {
  const runtime = createRuntime(t, true);
  runtime.effect.uniforms.iTex.value.image = undefined;
  runtime.frame(0);
  assert.equal(runtime.pending, 1);
  runtime.effect.uniforms.iTex.value.image = {};
  runtime.frame(16);
  assert.equal(runtime.pending, 0);
  assert.equal(runtime.effect.uniforms.iTime.value, 1);

  const renders = runtime.renders;
  runtime.animation.refresh();
  runtime.frame(1000);
  assert.equal(runtime.renders, renders + 1);
  assert.equal(runtime.pending, 0);
  runtime.window.dispatchEvent(new Event("resize"));
  runtime.frame(1500);
  assert.equal(runtime.renders, renders + 2);
  assert.equal(runtime.pending, 0);
  runtime.motionQuery.matches = false;
  runtime.motionQuery.dispatchEvent(new Event("change"));
  runtime.window.dispatchEvent(new Event("resize"));
  runtime.frame(2000);
  runtime.frame(2016);
  assert.ok(runtime.effect.uniforms.iTime.value > 1);
});

test("cleanup cancels frames and removes visibility and preference listeners", (t) => {
  const runtime = createRuntime(t);
  runtime.animation.destroy();
  runtime.document.dispatchEvent(new Event("visibilitychange"));
  runtime.motionQuery.dispatchEvent(new Event("change"));
  runtime.frame(1000);
  assert.equal(runtime.pending, 0);
  assert.equal(runtime.renders, 0);
});
