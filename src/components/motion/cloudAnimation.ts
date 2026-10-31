import type * as THREE from "three";

// Clouds are soft enough to upscale. Raymarching at Retina/4K resolution spends
// millions of extra texture samples per frame without adding useful detail.
const MAX_RENDER_PIXELS = 960 * 540;
const MIN_QUALITY = 0.5;
const MAX_TIME_STEP = 0.05;

export function getCloudRenderScale(
  width: number,
  height: number,
  devicePixelRatio: number,
  quality = 1,
) {
  const pixelRatio =
    Math.min(
      devicePixelRatio,
      width < 600 ? 0.5 : 1,
      Math.sqrt(MAX_RENDER_PIXELS / Math.max(1, width * height)),
    ) * quality;

  // Vanta divides the device pixel ratio by scale, including on mobile.
  return devicePixelRatio / pixelRatio;
}

export type CloudEffect = {
  req: number;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  options: { backgroundColor: number; backgroundAlpha: number };
  uniforms: {
    iTime: { value: number };
    iTex?: { value: THREE.Texture };
  };
  resize: () => void;
  _cloudQuality?: number;
};

export function startCloudAnimation(effect: CloudEffect) {
  // Replace Vanta's loop, rather than running a second RAF alongside it.
  cancelAnimationFrame(effect.req);

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false;
  let previousTime: number | null = null;
  let animationTime = effect.uniforms.iTime.value;
  let sampleDuration = 0;
  let sampleFrames = 0;
  let slowFrames = 0;

  const render = (now: number) => {
    if (disposed || document.hidden) return;

    if (previousTime !== null && !motionQuery.matches) {
      const delta = Math.max(0, (now - previousTime) / 1000);
      // Keep normal motion independent of refresh rate, but do not jump through
      // the clouds after a long frame (e.g. compiling a route or resizing).
      animationTime += Math.min(delta, MAX_TIME_STEP);
      // Bound the contribution of isolated stalls without discarding sustained
      // overload on very slow GPUs. The slow-frame ratio below rejects a lone hitch.
      sampleDuration += Math.min(delta, 0.1);
      sampleFrames += 1;
      if (delta > 1 / 55) slowFrames += 1;

      // Reduce GPU load only after sustained slow frames. Keeping quality
      // changes one-way avoids oscillating resolutions and reallocations.
      if (sampleDuration >= 1 && sampleFrames >= 12) {
        const quality = effect._cloudQuality ?? 1;
        const averageFrame = sampleDuration / sampleFrames;
        if (averageFrame > 1 / 55 && slowFrames >= sampleFrames * 0.15 && quality > MIN_QUALITY) {
          // Pixel cost is quadratic in quality. Respond to the observed deficit
          // in one step instead of stuttering through several small reductions.
          const reduction = Math.min(0.85, Math.sqrt(1 / 60 / averageFrame));
          effect._cloudQuality = Math.max(MIN_QUALITY, quality * reduction);
          effect.resize();
        }
        sampleDuration = 0;
        sampleFrames = 0;
        slowFrames = 0;
      }
    }
    previousTime = now;
    effect.uniforms.iTime.value = animationTime;
    effect.renderer.setClearColor(effect.options.backgroundColor, effect.options.backgroundAlpha);
    effect.renderer.render(effect.scene, effect.camera);

    // A reduced-motion frame must still wait for the asynchronously loaded
    // noise texture before stopping, otherwise the initial sky stays blank.
    if (!motionQuery.matches || !effect.uniforms.iTex?.value.image) {
      effect.req = requestAnimationFrame(render);
    }
  };

  const resume = () => {
    cancelAnimationFrame(effect.req);
    previousTime = null;
    sampleDuration = 0;
    sampleFrames = 0;
    slowFrames = 0;
    if (!disposed && !document.hidden) {
      effect.req = requestAnimationFrame(render);
    }
  };

  const handleResize = () => {
    // Moving skies already draw next frame. Do not reset their clock for mobile
    // browser-bar resize events when the large viewport has not changed size.
    if (motionQuery.matches) resume();
  };

  document.addEventListener("visibilitychange", resume);
  motionQuery.addEventListener("change", resume);
  window.addEventListener("resize", handleResize);
  resume();

  return {
    refresh: resume,
    destroy: () => {
      disposed = true;
      cancelAnimationFrame(effect.req);
      document.removeEventListener("visibilitychange", resume);
      motionQuery.removeEventListener("change", resume);
      window.removeEventListener("resize", handleResize);
    },
  };
}
