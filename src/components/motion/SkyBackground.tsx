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
  mouseControls: true,
  touchControls: true,
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
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
};

type VantaEffect = {
  setOptions: (opts: Record<string, unknown>) => void;
  destroy: () => void;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  onUpdate?: () => void;
  uniforms: Record<string, { value: unknown }> & {
    iResolution: { value: THREE.Vector2 };
    iTex?: { value: THREE.Texture };
  };
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

        // Vanta supplies the cloud sampling, renderer and animation loop.
        vantaEffect = CLOUDS2({
          el: containerRef.current,
          THREE,
          ...currentConfig,
        });

        if (vantaEffect) {
          const effect = vantaEffect;
          const mesh = effect.scene.children[0] as
            | THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
            | undefined;
          const material = mesh?.material;
          // The radial ray-start jitter aliases into small rings and grain.
          // Use a fixed start distance, preserving Vanta's cloud density and
          // all 100 raymarch steps and four noise octaves.
          if (material?.fragmentShader.includes("sin(dot(coord,coord))")) {
            material.fragmentShader = material.fragmentShader.replace("sin(dot(coord,coord))", "0.0");
            material.needsUpdate = true;
          }

          const bufferSize = new THREE.Vector2();
          // Vanta omits devicePixelRatio from iResolution. Match the drawing
          // buffer so the original shader also fills Retina/mobile screens.
          const syncResolution = () => {
            effect.renderer.getDrawingBufferSize(bufferSize);
            effect.uniforms.iResolution.value.copy(bufferSize);
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
        const renderer = vantaEffect.renderer;
        const texture = vantaEffect.uniforms.iTex?.value;
        vantaEffect.destroy();
        texture?.dispose();
        renderer.dispose();
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.sky} aria-hidden="true" />;
}
