"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./SkyBackground.module.scss";

/**
 * Vanta.js CLOUDS2 Background.
 *
 * Implements Vanta.js Clouds2 configured from user specifications:
 *  - Light mode (Image 1):
 *      backgroundColor: 0x98e3a5
 *      skyColor: 0x6bb6de
 *      cloudColor: 0xc5cce3
 *      lightColor: 0xffffff
 *      speed: 1
 *  - Dark mode (Image 2):
 *      backgroundColor: 0x0a151b
 *      skyColor: 0x0c1a20
 *      cloudColor: 0x0e152f
 *      lightColor: 0xffffff
 *      speed: 1
 */

const LIGHT_CONFIG = {
  backgroundColor: 0x98e3a5,
  skyColor: 0x6bb6de,
  cloudColor: 0xc5cce3,
  lightColor: 0xffffff,
  speed: 1,
  scale: 1.0,
  scaleMobile: 4.0,
  texturePath: "/gallery/noise.png",
  // CLOUDS2 shader never reads iMouse, so pointer listeners only cost forced layout reads
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
};

const DARK_CONFIG = {
  backgroundColor: 0x0a151b,
  skyColor: 0x0c1a20,
  cloudColor: 0x0e152f,
  lightColor: 0xffffff,
  speed: 1,
  scale: 1.0,
  scaleMobile: 4.0,
  texturePath: "/gallery/noise.png",
  // CLOUDS2 shader never reads iMouse, so pointer listeners only cost forced layout reads
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
};

type VantaEffect = {
  setOptions: (opts: Record<string, unknown>) => void;
  destroy: () => void;
  resize: () => void;
  uniforms?: Record<string, { value: unknown }>;
};

export function SkyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Attach THREE to window and disable Three.js ColorManagement conversion
    // so hex colors match Vanta r134 sRGB shader expectation identically
    if (typeof window !== "undefined") {
      (window as unknown as { THREE: typeof THREE }).THREE = THREE;
      if (THREE.ColorManagement) {
        THREE.ColorManagement.enabled = false;
      }
    }

    let vantaEffect: VantaEffect | null = null;
    let isDisposed = false;

    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

    const getConfig = (theme: "light" | "dark") =>
      theme === "dark" ? DARK_CONFIG : LIGHT_CONFIG;

    const applyThemeConfig = (effect: VantaEffect, config: typeof LIGHT_CONFIG) => {
      effect.setOptions(config);

      // Directly update uniform values if cached by Three.js WebGLUniforms
      if (effect.uniforms) {
        if (effect.uniforms.skyColor) {
          const c = new THREE.Color(config.skyColor);
          effect.uniforms.skyColor.value = new THREE.Vector3(c.r, c.g, c.b);
        }
        if (effect.uniforms.cloudColor) {
          const c = new THREE.Color(config.cloudColor);
          effect.uniforms.cloudColor.value = new THREE.Vector3(c.r, c.g, c.b);
        }
        if (effect.uniforms.lightColor) {
          const c = new THREE.Color(config.lightColor);
          effect.uniforms.lightColor.value = new THREE.Vector3(c.r, c.g, c.b);
        }
      }
    };

    const initVanta = async () => {
      try {
        // @ts-expect-error - vanta has no TypeScript definitions bundled
        const module = await import("vanta/dist/vanta.clouds2.min.js");
        const CLOUDS2 = module.default || module;

        if (isDisposed || !containerRef.current) return;

        const currentTheme = getTheme();
        const currentConfig = getConfig(currentTheme);

        // Replace Vanta's `sin(dot(coord,coord))` raymarch jitter with bounded Interleaved
        // Gradient Noise (IGN) so Windows/D3D11 GPUs don't overflow float32 sin() range reduction
        // and produce concentric curved Moiré rings radiating from (0,0).
        const patchShaderString = (shader: string) =>
          shader.replace(
            "sin(dot(coord,coord))",
            "0.0",
          );

        // Vanta's `CLOUDS2` export is a factory arrow function `(opts) => new Effect(opts)`,
        // so `CLOUDS2.prototype` is undefined. Hook `VantaBase.prototype.init` (which runs inside
        // `super.init()` right before `initBasicShader()` compiles the ShaderMaterial) to patch
        // the Effect prototype's `fragmentShader` and `resize` before the first WebGL compilation.
        const vantaGlobal = (window as unknown as {
          VANTA?: { VantaBase?: { prototype?: { init?: () => void; _clouds2Patched?: boolean } } };
        }).VANTA;
        const vantaBaseProto = vantaGlobal?.VantaBase?.prototype;
        if (vantaBaseProto && !vantaBaseProto._clouds2Patched) {
          const origBaseInit = vantaBaseProto.init;
          vantaBaseProto.init = function (this: {
            fragmentShader?: string;
            resize?: () => void;
            renderer?: THREE.WebGLRenderer;
            uniforms?: { iResolution?: { value: THREE.Vector2 } };
          }) {
            const effectProto = Object.getPrototypeOf(this);
            if (effectProto && typeof effectProto.fragmentShader === "string" && !effectProto._shaderPatched) {
              effectProto.fragmentShader = patchShaderString(effectProto.fragmentShader);
              const origResize = effectProto.resize;
              effectProto.resize = function () {
                if (origResize) origResize.call(this);
                if (this.renderer && this.uniforms?.iResolution?.value) {
                  const bufferSize = this.renderer.getDrawingBufferSize(new THREE.Vector2());
                  this.uniforms.iResolution.value.copy(bufferSize);
                }
              };
              effectProto._shaderPatched = true;
            }
            if (typeof this.fragmentShader === "string") {
              this.fragmentShader = patchShaderString(this.fragmentShader);
            }
            if (origBaseInit) origBaseInit.call(this);
          };
          vantaBaseProto._clouds2Patched = true;
        }

        // Zero-visual-change engine patches on VantaBase (applied once, before construction):
        //  - isOnScreen(): the sky is position:fixed full-viewport, so it is always on screen.
        //    Vanta's version reads offsetHeight + getBoundingClientRect() EVERY frame, forcing a
        //    synchronous layout that competes with GSAP / Lenis and causes frame-pacing hitches.
        //  - initThree(): MSAA is disabled. The effect is one full-screen quad, so there are no
        //    geometry edges for antialiasing to smooth; MSAA only adds a per-frame resolve cost.
        //  - resize(): skipped when size & DPR are unchanged. Setting canvas width/height (even to
        //    the same value) reallocates the drawing buffer; mobile browsers fire resize whenever
        //    the URL bar shows/hides while the sky (100lvh) keeps the exact same size.
        const perfProto = (window as unknown as {
          VANTA?: {
            VantaBase?: {
              prototype?: Record<string, unknown> & { _perfPatched?: boolean };
            };
          };
        }).VANTA?.VantaBase?.prototype;
        if (perfProto && !perfProto._perfPatched) {
          perfProto.isOnScreen = function () {
            return true;
          };

          perfProto.initThree = function (this: {
            el: HTMLElement;
            renderer?: THREE.WebGLRenderer;
            scene?: THREE.Scene;
            options: { backgroundAlpha?: number };
            applyCanvasStyles: (canvas: HTMLCanvasElement) => void;
          }) {
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
            this.el.appendChild(this.renderer.domElement);
            this.applyCanvasStyles(this.renderer.domElement);
            if (Number.isNaN(Number(this.options.backgroundAlpha))) {
              this.options.backgroundAlpha = 1;
            }
            this.scene = new THREE.Scene();
          };

          const origBaseResize = perfProto.resize as (() => void) | undefined;
          perfProto.resize = function (this: {
            el?: HTMLElement;
            renderer?: THREE.WebGLRenderer;
            _lastSize?: string;
          }) {
            const el = this.el;
            const key = el
              ? `${el.offsetWidth}x${el.offsetHeight}@${window.devicePixelRatio}`
              : "";
            if (this.renderer && key && key === this._lastSize) return;
            this._lastSize = key;
            if (origBaseResize) origBaseResize.call(this);
          };

          perfProto._perfPatched = true;
        }

        vantaEffect = CLOUDS2({
          el: containerRef.current,
          THREE,
          ...currentConfig,
        });

        if (vantaEffect) {
          const effect = vantaEffect as unknown as {
            onUpdate?: () => void;
            renderer?: THREE.WebGLRenderer;
            scene?: THREE.Scene;
            uniforms?: { iResolution?: { value: THREE.Vector2 } };
          };

          // Safety fallback: ensure compiled ShaderMaterial uses the patched fragmentShader
          const mesh = effect.scene?.children?.[0] as
            | THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
            | undefined;
          if (
            mesh?.material &&
            typeof mesh.material.fragmentShader === "string" &&
            mesh.material.fragmentShader.includes("sin(dot(coord,coord))")
          ) {
            mesh.material.fragmentShader = patchShaderString(mesh.material.fragmentShader);
            mesh.material.needsUpdate = true;
          }

          const bufferSize = new THREE.Vector2();
          const syncResolution = () => {
            if (effect.renderer && effect.uniforms?.iResolution?.value) {
              effect.renderer.getDrawingBufferSize(bufferSize);
              if (
                effect.uniforms.iResolution.value.x !== bufferSize.x ||
                effect.uniforms.iResolution.value.y !== bufferSize.y
              ) {
                effect.uniforms.iResolution.value.copy(bufferSize);
              }
            }
          };

          effect.onUpdate = syncResolution;
          syncResolution();
        }

        if (containerRef.current) {
          containerRef.current.classList.add(styles.ready);
        }
      } catch (err) {
        console.error("Failed to initialize Vanta.js CLOUDS2:", err);
      }
    };

    initVanta();

    // Listen for theme changes on <html data-theme="...">
    const themeObserver = new MutationObserver(() => {
      if (!vantaEffect) return;
      const nextTheme = getTheme();
      const nextConfig = getConfig(nextTheme);
      applyThemeConfig(vantaEffect, nextConfig);
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      isDisposed = true;
      themeObserver.disconnect();
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.sky} aria-hidden="true" />;
}
