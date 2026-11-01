"use client";

import { useEffect, useRef } from "react";
import { Column } from "@once-ui-system/core";
import * as THREE from "three";
import styles from "./SkyBackground.module.scss";

// Vanta CLOUDS palettes from the light and dark reference screenshots.
const LIGHT_CONFIG = {
  backgroundColor: 0xffffff,
  skyColor: 0x68b8d7,
  cloudColor: 0xadc1de,
  cloudShadowColor: 0x183550,
  sunColor: 0xff9919,
  sunGlareColor: 0xff6633,
  sunlightColor: 0xff9933,
};

const DARK_CONFIG = {
  backgroundColor: 0x000000,
  skyColor: 0x000000,
  cloudColor: 0x647a9b,
  cloudShadowColor: 0x4c759b,
  sunColor: 0x1f2a89,
  sunGlareColor: 0x463733,
  sunlightColor: 0x98632e,
};

const COMMON_CONFIG = {
  speed: 1,
  scale: 3,
  scaleMobile: 12,
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
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

      // Preserve the reference sRGB values for every CLOUDS lighting uniform.
      if (effect.uniforms) {
        for (const key of Object.keys(config) as (keyof typeof LIGHT_CONFIG)[]) {
          if (effect.uniforms[key]) {
            const color = new THREE.Color(config[key]);
            effect.uniforms[key].value = new THREE.Vector3(color.r, color.g, color.b);
          }
        }
      }
    };

    const initVanta = async () => {
      try {
        // @ts-expect-error - vanta has no TypeScript definitions bundled
        const module = await import("vanta/dist/vanta.clouds.min.js");
        const CLOUDS = module.default || module;

        if (isDisposed || !containerRef.current) return;

        const currentTheme = getTheme();
        const currentConfig = getConfig(currentTheme);

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

        vantaEffect = CLOUDS({
          el: containerRef.current,
          THREE,
          ...COMMON_CONFIG,
          ...currentConfig,
        });

        if (vantaEffect) {
          const effect = vantaEffect as unknown as {
            onUpdate?: () => void;
            renderer?: THREE.WebGLRenderer;
            width: number;
            height: number;
            mouseX?: number;
            mouseY?: number;
            mouseEaseX?: number;
            mouseEaseY?: number;
            uniforms?: {
              iResolution?: { value: THREE.Vector2 };
              iMouse?: { value: THREE.Vector2 };
            };
          };

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

              // CLOUDS uses iMouse for its camera: match drawing-buffer coordinates on HiDPI.
              effect.uniforms.iMouse?.value.set(
                ((effect.mouseEaseX ?? effect.mouseX ?? 0) / effect.width) * bufferSize.x,
                ((effect.mouseEaseY ?? effect.mouseY ?? 0) / effect.height) * bufferSize.y,
              );
            }
          };

          effect.onUpdate = syncResolution;
          syncResolution();
        }

        if (containerRef.current) {
          containerRef.current.classList.add(styles.ready);
        }
      } catch (err) {
        console.error("Failed to initialize Vanta.js CLOUDS:", err);
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
      container.classList.remove(styles.ready);
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy();
      }
    };
  }, []);

  return <Column ref={containerRef} className={styles.sky} aria-hidden="true" />;
}
