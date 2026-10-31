"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAppTheme } from "./Providers";

const useLiquidLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ==========================================================================
   1. WebGL Shaders from Framer Liquid-Metal-Navbar (Ww3mAJ)
   ========================================================================== */

const SURFACE_VERTEX = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SURFACE_FRAGMENT = `
precision highp float;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform vec2 u_size;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_edge;
uniform float u_radius;
uniform float u_energy;
uniform float u_press;
uniform float u_release;
uniform float u_brightness;
uniform float u_flow;
uniform float u_prism;
uniform float u_hoverIntensity;
uniform float u_hoverRadius;
uniform float u_glow;
uniform float u_variant;
uniform vec3 u_light;
uniform vec3 u_shade;
uniform vec3 u_accent;
uniform vec3 u_hoverInk;

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec2 surfaceGrad(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  vec2 s = sign(p);
  if (q.x > 0.0 || q.y > 0.0) {
    return s * normalize(max(q, vec2(1e-4)));
  }
  return q.x > q.y ? vec2(s.x, 0.0) : vec2(0.0, s.y);
}

vec3 studioEnv(vec3 ref, float phase, float flow, float variant, vec3 light, vec3 shade, vec3 accent) {
  float dome = clamp(ref.y * 0.5 + 0.5, 0.0, 1.0);
  float az = atan(ref.y, ref.x);
  float sweep = sin(az * 2.0 + phase * 0.65) * 0.5 + 0.5;
  float rib1 = sin(az * 4.0 - phase * (0.9 + flow * 0.3) + ref.z * 2.8);
  float rib2 = cos(az * 7.0 + phase * (0.55 + flow * 0.22) - ref.y * 3.1);
  float studioBand = smoothstep(0.0, 0.94, sin(ref.x * 4.4 + ref.y * 2.8 + phase * 0.5) * 0.5 + 0.5);
  float softbox = pow(max(0.0, dot(ref, normalize(vec3(-0.48, -0.58, 0.66)))), 7.5);
  float rimKick = pow(max(0.0, dot(ref, normalize(vec3(0.64, 0.44, 0.63)))), 10.0);
  float nadir = smoothstep(-0.92, 0.16, ref.y);

  vec3 darkChrome = mix(shade * 0.52, shade, nadir);
  vec3 brightChrome = mix(mix(shade, light, 0.72), light * 1.05, dome);
  vec3 env = mix(darkChrome, brightChrome, smoothstep(-0.36, 0.68, rib1 * 0.56 + rib2 * 0.28 + studioBand * 0.34));
  env = mix(env, accent, (0.14 + 0.12 * sweep) * smoothstep(0.18, 0.92, studioBand));
  env += light * (softbox * 0.72 + rimKick * 0.42);
  env *= mix(1.0, 0.87, step(0.5, variant));
  return env;
}

vec3 sampleMetal(
  vec3 normal,
  vec3 view,
  float phase,
  float flow,
  float prism,
  float variant,
  vec3 light,
  vec3 shade,
  vec3 accent
) {
  vec3 ref = reflect(-view, normal);
  float shift = (0.025 + prism * 0.115) * (0.45 + 0.55 * (1.0 - normal.z));
  mat2 rotR = mat2(cos(shift), -sin(shift), sin(shift), cos(shift));
  mat2 rotB = mat2(cos(-shift), -sin(-shift), sin(-shift), cos(-shift));
  vec3 refR = vec3(rotR * ref.xy, ref.z);
  vec3 refB = vec3(rotB * ref.xy, ref.z);

  vec3 envG = studioEnv(ref, phase, flow, variant, light, shade, accent);
  vec3 envR = studioEnv(refR, phase + 0.16, flow, variant, light, shade, accent);
  vec3 envB = studioEnv(refB, phase - 0.16, flow, variant, light, shade, accent);
  vec3 dispersed = vec3(envR.r, envG.g, envB.b);
  return mix(envG, dispersed, clamp(prism * 1.15, 0.0, 1.0));
}

void main() {
  vec2 frag = vec2(v_uv.x, 1.0 - v_uv.y) * u_size;
  vec2 halfSize = u_size * 0.5;
  float rad = min(u_radius, min(halfSize.x, halfSize.y));
  vec2 p = frag - halfSize;

  float dist = sdRoundRect(p, halfSize, rad);
  float aa = max(1.0, min(u_size.x, u_size.y) / max(min(u_resolution.x, u_resolution.y), 1.0));
  float outer = 1.0 - smoothstep(-aa * 0.75, aa * 0.75, dist);
  if (outer <= 0.001) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float innerDist = -dist;
  float edgeWidth = max(1.35, u_edge);
  float rimOuter = smoothstep(0.0, aa * 0.9, innerDist);
  float rimInner = 1.0 - smoothstep(edgeWidth - aa * 1.05, edgeWidth + aa * 1.05, innerDist);
  float rimMask = clamp(rimOuter * rimInner, 0.0, 1.0);

  vec2 grad = surfaceGrad(p, halfSize, rad);
  vec2 tangent = vec2(-grad.y, grad.x);
  float profile = clamp((innerDist - edgeWidth * 0.5) / max(edgeWidth * 0.5, 0.001), -1.0, 1.0);

  vec2 pointerPx = u_pointer * u_size;
  vec2 toPointer = frag - pointerPx;
  float pointerLen = length(toPointer);
  vec2 pointerDir = pointerLen > 1e-3 ? toPointer / pointerLen : vec2(0.0, -1.0);
  float pointerReach = max(56.0, u_hoverRadius * 0.92);
  float pointerField = exp(-pow(pointerLen / pointerReach, 1.75));
  float rimPointer = exp(-pow(pointerLen / max(38.0, u_hoverRadius * 0.56), 1.65));

  float activeFlow = u_flow * (0.28 + u_energy * 0.85 + u_press * 0.35);
  float releaseEcho = (1.0 - u_release) * sin((1.0 - u_release) * 14.0 - pointerLen * 0.055) * exp(-pointerLen * 0.014);
  float waveA = sin(dot(p, vec2(0.047, -0.033)) + u_time * 1.75);
  float waveB = cos(dot(p, vec2(-0.029, 0.056)) - u_time * 1.28);
  float liquidWave = (waveA * 0.6 + waveB * 0.4) * 0.12 * activeFlow + releaseEcho * 0.24;

  float slope = sin(profile * 1.5707963);
  vec2 normalXY = grad * slope * 0.9 + tangent * liquidWave;
  normalXY += pointerDir * rimPointer * (0.22 * u_energy - 0.34 * u_press);
  float normalZ = sqrt(max(0.08, 1.0 - dot(normalXY, normalXY)));
  vec3 normal = normalize(vec3(normalXY, normalZ));
  vec3 view = vec3(0.0, 0.0, 1.0);

  float phase = u_time * 0.72 + liquidWave * 2.2 + rimPointer * (0.85 * u_energy + 0.55 * u_press);
  vec3 metal = sampleMetal(normal, view, phase, activeFlow, u_prism, u_variant, u_light, u_shade, u_accent);

  float fresnel = pow(1.0 - max(0.0, dot(normal, view)), 3.2);
  float crest = exp(-pow(profile * 2.35, 2.0));
  vec3 keyDir = normalize(vec3(-0.42, -0.58, 0.7));
  vec3 pointerLightDir = normalize(vec3(-pointerDir * (0.45 + 0.3 * u_energy), 0.82));
  float keySpec = pow(max(0.0, dot(reflect(-keyDir, normal), view)), 22.0);
  float pointerSpec = pow(max(0.0, dot(reflect(-pointerLightDir, normal), view)), 18.0) * rimPointer * (0.28 + u_energy * 0.92 + u_press * 0.45);
  float innerShadow = smoothstep(0.18, 0.98, profile);

  metal = mix(metal, u_light * 1.08, fresnel * 0.46 + crest * 0.16);
  metal += u_light * (keySpec * 0.44 + pointerSpec * 0.78);
  metal += u_accent * (rimPointer * 0.22 * u_energy + pointerSpec * 0.24);
  metal *= 1.0 - innerShadow * 0.32;
  metal *= u_brightness;

  float edgeOpacity = mix(1.0, 0.94, step(0.5, u_variant));
  float rimAlpha = rimMask * outer * edgeOpacity;

  vec2 poolDelta = (frag - pointerPx) / vec2(max(44.0, u_hoverRadius * 1.15), max(28.0, u_hoverRadius * 0.78));
  float pool = exp(-dot(poolDelta, poolDelta) * 1.55);
  float innerGlow = exp(-max(0.0, innerDist - edgeWidth * 0.65) / max(8.0, edgeWidth * 4.5));
  float sheenBand = exp(-pow((frag.y - pointerPx.y * 0.55) / max(18.0, u_size.y * 0.38), 2.0));

  float lightAlpha = outer * (1.0 - rimMask * 0.65) * u_energy * u_hoverIntensity * (
    pool * (0.14 + u_glow * 0.18) +
    innerGlow * rimPointer * (0.12 + u_glow * 0.2) +
    sheenBand * pointerField * 0.045
  );
  vec3 lightColor = mix(u_hoverInk, u_accent, 0.18 * smoothstep(0.2, 0.9, pool));
  lightColor = mix(lightColor, u_light, innerGlow * 0.38);

  float alpha = clamp(rimAlpha + lightAlpha, 0.0, 1.0);
  vec3 color = metal * rimAlpha + lightColor * lightAlpha;
  gl_FragColor = vec4(color, alpha);
}
`;

const MEDALLION_VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const MEDALLION_FRAGMENT = `
precision highp float;
uniform float time;
uniform float pixels;
uniform float tube;
uniform float flow;
uniform float dispersion;
uniform float glow;
uniform float warmth;
uniform float hover;
uniform float hoverTone;
uniform float hoverIntensity;
uniform float press;
uniform float response;
uniform float release;
uniform vec2 pointer;

float ease(float a, float b, float x) {
  float t = clamp((x - a) / (b - a), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

vec3 tint(float v, float s, float warm) {
  vec3 ink = mix(vec3(0.08, 0.12, 0.20), vec3(0.18, 0.12, 0.08), warm);
  vec3 mid = mix(vec3(0.58, 0.67, 0.80), vec3(0.80, 0.68, 0.55), warm);
  vec3 hi = mix(vec3(0.95, 0.98, 1.0), vec3(1.0, 0.965, 0.90), warm);
  vec3 base = mix(ink, mid, ease(0.08, 0.56, v));
  base = mix(base, hi, ease(0.48, 0.95, v));
  float luma = dot(base, vec3(0.299, 0.587, 0.114));
  return mix(vec3(luma), base, s);
}

float env(vec3 r, vec2 p, float a, float t, float motion, float pressAmount) {
  float studio = ease(-0.85, 0.9, -r.y * 0.82 - r.x * 0.35 + r.z * 0.28);
  float w1 = sin(a * 2.0 + t * (0.44 + motion * 0.68) + r.x * 2.6 - r.y * 2.1);
  float w2 = cos(a * 3.0 - t * (0.31 + motion * 0.52) + r.y * 3.3 + p.x * 2.2);
  float w3 = sin((p.x - p.y) * 5.2 + t * (0.58 + motion * 0.72) + r.z * 3.4);
  float liquid = w1 * 0.45 + w2 * 0.35 + w3 * 0.20;
  float chrome = ease(-0.78, 0.78, sin(liquid * 3.1 + studio * 3.9));
  float darkSeam = ease(0.22, 0.93, sin(a * 2.0 - liquid * 2.5 - t * 0.36));
  float horizon = pow(1.0 - abs(r.y * 0.78 - liquid * 0.24), 4.0);
  float v = mix(studio, chrome, 0.72);
  v = mix(v, 0.04, darkSeam * 0.52);
  v += horizon * 0.26;
  v += pressAmount * 0.08 * cos(a * 4.0 + t * 2.0);
  return clamp(v, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / pixels;
  uv.y = 1.0 - uv.y;
  vec2 p = (uv - 0.5) * 2.4;
  float r = length(p);
  float a = atan(p.y, p.x);
  float aa = 2.6 / max(pixels, 1.0);

  vec2 ptr = pointer * 0.74;
  float pd = length(p - ptr);
  float prox = exp(-pd * pd * 3.6);
  float wake = hover * (0.35 + 0.65 * prox);
  float dent = press * response * exp(-pd * pd * 6.4);
  float releasePulse = (1.0 - release) * sin((1.0 - release) * 12.0 - pd * 6.2) * exp(-pd * 2.3);

  float radius = 0.79;
  float width = tube * (1.0 + wake * 0.05 - dent * 0.07);
  float wobble = (0.004 + flow * 0.008) * (
    sin(a * 3.0 + time * 1.15) * 0.65 +
    cos(a * 5.0 - time * 0.85) * 0.35
  );
  wobble += (wake * 0.015 - dent * 0.032 + releasePulse * 0.014) * exp(-pd * 1.85);

  float d = r - (radius + wobble);
  float mask = 1.0 - ease(width - aa, width + aa, abs(d));
  if (mask <= 0.001) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float u = clamp(d / max(width, 0.0001), -1.0, 1.0);
  vec2 radial = p / max(r, 0.0001);
  vec2 tangent = vec2(-radial.y, radial.x);
  float ripple = (0.045 + flow * 0.075 + wake * 0.05) * sin(a * 6.0 - time * 1.65 + u * 2.6);
  ripple += (releasePulse * 0.12 - dent * 0.16) * cos(a * 4.0 + time * 2.1);

  vec2 n2 = radial * u * 0.92 + tangent * ripple;
  n2 += (p - ptr) * (dent * 0.55 - wake * 0.16);
  float nz = sqrt(max(0.06, 1.0 - dot(n2, n2)));
  vec3 n = normalize(vec3(n2, nz));
  vec3 view = vec3(0.0, 0.0, 1.0);
  vec3 refl = reflect(-view, n);

  float motion = flow * (0.55 + hover * 0.35);
  float shift = (0.02 + dispersion * 0.16) * (0.35 + 0.65 * pow(1.0 - nz, 1.25));
  float vr = env(refl + vec3(shift, -shift * 0.45, 0.0), p, a + shift * 2.2, time + shift * 2.8, motion, press * response);
  float vg = env(refl, p, a, time, motion, press * response);
  float vb = env(refl - vec3(shift, -shift * 0.45, 0.0), p, a - shift * 2.2, time - shift * 2.8, motion, press * response);

  float sat = 0.12 + dispersion * 1.22;
  vec3 col = vec3(
    tint(vr, sat, warmth).r,
    tint(vg, sat, warmth).g,
    tint(vb, sat, warmth).b
  );

  vec3 key1 = normalize(vec3(-0.56, -0.66, 0.50));
  vec3 key2 = normalize(vec3(0.62, 0.52, 0.58));
  vec3 ptrLight = normalize(vec3(ptr.x - p.x, ptr.y - p.y, 0.52));
  float spec1 = pow(max(dot(refl, key1), 0.0), 28.0);
  float spec2 = pow(max(dot(refl, key2), 0.0), 34.0);
  float ptrSpec = pow(max(dot(refl, ptrLight), 0.0), 18.0) * hover;
  float fresnel = pow(1.0 - nz, 3.0);

  vec3 warmGold = vec3(1.0, 0.80, 0.55);
  vec3 coolCyan = vec3(0.70, 0.90, 1.0);
  vec3 hoverAccent = mix(coolCyan, warmGold, hoverTone);
  float hoverAmt = hover * hoverIntensity * (0.28 + 0.72 * prox);
  float rim = 0.4 + 0.6 * fresnel;
  float leak = pow(max(0.0, sin(a * 2.0 - time * 0.9 + pd * 3.2)), 3.0) * hoverAmt * dispersion;

  col = mix(col, col * mix(vec3(1.0), hoverAccent * 1.18, rim * 0.65), hoverAmt * 0.75);
  col += hoverAccent * (ptrSpec * (0.45 + 0.75 * hoverIntensity) + fresnel * hoverAmt * 0.34 + leak * 0.28);
  col += vec3(1.0, 0.99, 0.97) * (spec1 * 0.78 + spec2 * 0.34);
  col += mix(coolCyan, warmGold, warmth) * fresnel * (0.14 + glow * 0.36);
  col *= 0.86 + 0.20 * nz;

  float shadow = ease(width, width + 0.13, abs(d));
  float halo = (1.0 - shadow) * (0.12 + glow * 0.24 + hover * 0.08) * clamp((p.y + 0.35) * 0.85, 0.0, 1.0);
  vec3 haloColor = mix(vec3(0.04, 0.07, 0.13), hoverAccent * 0.28, hoverAmt * 0.45);
  float alpha = clamp(mask + halo, 0.0, 1.0);
  vec3 finalColor = (col * mask + haloColor * halo) / max(alpha, 0.001);
  gl_FragColor = vec4(finalColor * alpha, alpha);
}
`;

/* ==========================================================================
   2. Color & Math Utilities
   ========================================================================== */

const surfaceClamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

let colorScratchCtx: CanvasRenderingContext2D | null | undefined;
function getColorScratch() {
  if (colorScratchCtx !== undefined) return colorScratchCtx;
  if (typeof document === "undefined") return (colorScratchCtx = null);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  return (colorScratchCtx = canvas.getContext("2d", { willReadFrequently: true }));
}

function parseColorVec3(input: string, fallback: [number, number, number]): [number, number, number] {
  if (!input || typeof input !== "string") return fallback;
  const value = input.trim();
  const hex = value.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let raw = hex[1];
    if (raw.length === 3 || raw.length === 4) {
      raw = raw
        .slice(0, 3)
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (raw.length >= 6) {
      return [
        parseInt(raw.slice(0, 2), 16) / 255,
        parseInt(raw.slice(2, 4), 16) / 255,
        parseInt(raw.slice(4, 6), 16) / 255,
      ];
    }
  }
  const rgb = value.match(/rgba?\(\s*([0-9.]+)[,\s]+([0-9.]+)[,\s]+([0-9.]+)/i);
  if (rgb) {
    return [
      surfaceClamp(Number(rgb[1]) / 255, 0, 1),
      surfaceClamp(Number(rgb[2]) / 255, 0, 1),
      surfaceClamp(Number(rgb[3]) / 255, 0, 1),
    ];
  }
  const ctx = getColorScratch();
  if (!ctx) return fallback;
  try {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return [data[0] / 255, data[1] / 255, data[2] / 255];
  } catch {
    return fallback;
  }
}

/* ==========================================================================
   3. LiquidSurface Component (WebGL Metallic Perimeter Rim + Light Pool)
   ========================================================================== */

interface LiquidSurfaceProps {
  material?: "navigation" | "dark";
  edgeWidth?: number;
  hoverLight?: number;
  liquid?: number;
  prism?: number;
  brightness?: number;
  radius?: number;
  colors?: {
    highlight?: string;
    shade?: string;
    accent?: string;
  };
  style?: React.CSSProperties;
}

export function LiquidSurface({
  material = "navigation",
  edgeWidth = 2.6,
  hoverLight = 0.65,
  liquid = 0.9,
  prism = 0.6,
  brightness = 1,
  radius,
  colors = {
    highlight: "#EEF6FF",
    shade: "#111A28",
    accent: "#D7BB93",
  },
  style,
}: LiquidSurfaceProps) {
  const [reduced, setReduced] = useState(false);
  const [version, setVersion] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const unique = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const scopeAttribute = `data-liquid-surface-${unique}`;

  const light = {
    intensity: surfaceClamp(hoverLight, 0, 1.5),
    size: Math.round(88 + surfaceClamp(hoverLight, 0, 1.5) * 42),
    glow: surfaceClamp(hoverLight * 0.42, 0, 1),
  };
  const motion = {
    playback: "hover",
    speed: 0.55 + surfaceClamp(liquid, 0, 1.5) * 0.4,
    flow: surfaceClamp(liquid, 0, 1.5),
    attraction: surfaceClamp(0.45 + hoverLight * 0.35, 0, 1),
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const still = reduced;
  const configRef = useRef({
    material,
    edgeWidth,
    brightness,
    prism,
    radius,
    colors,
    light,
    motion,
    still,
  });
  configRef.current = {
    material,
    edgeWidth,
    brightness,
    prism,
    radius,
    colors,
    light,
    motion,
    still,
  };

  useLiquidLayoutEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || typeof window === "undefined") return;

    const host = root.closest<HTMLElement>("[data-liquid-host]") || root.parentElement || root;
    const isDark = material === "dark";
    host.setAttribute(scopeAttribute, material);

    let currentRenderer = "";
    const showRenderer = (mode: string) => {
      if (currentRenderer === mode) return;
      currentRenderer = mode;
      root.dataset.renderer = mode;
      canvas.style.visibility = mode === "webgl" ? "visible" : "hidden";
      const fallbacks = root.querySelectorAll<HTMLElement>(".ls-fallback");
      fallbacks.forEach((node) => {
        node.style.visibility = mode === "fallback" ? "visible" : "hidden";
      });
    };

    showRenderer("pending");

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let quad: WebGLBuffer | null = null;
    const shaders: WebGLShader[] = [];
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    let stopped = false;
    let lost = false;
    let visible = true;
    let frame = 0;
    let last = 0;
    let energy = 0;
    let pressure = 0;
    let release = 1;
    let elapsed = isDark ? 2.15 : 0.85;
    let phaseVelocity = 0;
    const size = { width: 1, height: 1, radius: 999, dpr: 1 };
    const input = {
      hovered: false,
      focused: false,
      pressed: false,
      hasPointer: false,
      clientX: 0,
      clientY: 0,
      x: isDark ? 0.5 : 0.32,
      y: 0.2,
      sx: isDark ? 0.5 : 0.32,
      sy: 0.2,
    };

    const cleanupGPU = () => {
      if (!gl) return;
      if (program) gl.deleteProgram(program);
      if (quad) gl.deleteBuffer(quad);
      shaders.forEach((s) => gl?.deleteShader(s));
      program = null;
      quad = null;
      shaders.length = 0;
    };

    const initGPU = () => {
      cleanupGPU();
      try {
        gl = canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          premultipliedAlpha: true,
          powerPreference: "low-power",
        });
        if (!gl) return false;
        const compile = (type: number, source: string) => {
          const shader = gl!.createShader(type);
          if (!shader) throw new Error("Shader allocation failed");
          shaders.push(shader);
          gl!.shaderSource(shader, source);
          gl!.compileShader(shader);
          if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
            throw new Error(gl!.getShaderInfoLog(shader) || "Shader compile failed");
          }
          return shader;
        };
        const vertex = compile(gl.VERTEX_SHADER, SURFACE_VERTEX);
        const fragment = compile(gl.FRAGMENT_SHADER, SURFACE_FRAGMENT);
        program = gl.createProgram();
        quad = gl.createBuffer();
        if (!program || !quad) throw new Error("Program allocation failed");
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
        }
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const position = gl.getAttribLocation(program, "a_position");
        if (position < 0) throw new Error("Vertex attribute missing");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        for (const name of [
          "u_resolution",
          "u_size",
          "u_pointer",
          "u_time",
          "u_edge",
          "u_radius",
          "u_energy",
          "u_press",
          "u_release",
          "u_brightness",
          "u_flow",
          "u_prism",
          "u_hoverIntensity",
          "u_hoverRadius",
          "u_glow",
          "u_variant",
          "u_light",
          "u_shade",
          "u_accent",
          "u_hoverInk",
        ]) {
          uniforms[name] = gl.getUniformLocation(program, name);
        }
        return true;
      } catch (error) {
        console.warn("Liquid Metal: surface uses CSS fallback.", error);
        cleanupGPU();
        gl = null;
        return false;
      }
    };

    const readSize = () => {
      const rect = root.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width || hostRect.width || root.clientWidth || 1);
      const height = Math.max(1, rect.height || hostRect.height || root.clientHeight || 1);
      const computed = window.getComputedStyle(host);
      const parsedRadius = parseFloat(computed.borderTopLeftRadius || "");
      const minSide = Math.min(width, height);
      const c = configRef.current;
      const edge = Math.min(c.edgeWidth, minSide * 0.45);
      const rad =
        c.radius !== undefined
          ? Math.min(c.radius, minSide * 0.5)
          : Number.isFinite(parsedRadius) && parsedRadius > 0
          ? Math.min(parsedRadius, minSide * 0.5)
          : minSide * 0.5;
      root.style.borderRadius = `${rad}px`;
      const maxPixels = isDark ? 360000 : 620000;
      const rawDpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(1, Math.sqrt(maxPixels / Math.max(1, width * height * rawDpr * rawDpr)));
      const dpr = Math.max(1, rawDpr * scale);
      const pxW = Math.max(1, Math.min(2048, Math.round(width * dpr)));
      const pxH = Math.max(1, Math.min(2048, Math.round(height * dpr)));
      size.width = width;
      size.height = height;
      size.radius = rad;
      size.dpr = dpr;
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }
      root.style.setProperty("--ls-width", `${edge}px`);
    };

    const projectPointer = () => {
      if (!input.hasPointer) return false;
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const pad = isDark ? 10 : 14;
      const inside =
        input.clientX >= rect.left - pad &&
        input.clientX <= rect.right + pad &&
        input.clientY >= rect.top - pad &&
        input.clientY <= rect.bottom + pad;
      const attraction = surfaceClamp(configRef.current.motion.attraction, 0, 1);
      const rawX = surfaceClamp((input.clientX - rect.left) / rect.width, 0, 1);
      const rawY = surfaceClamp((input.clientY - rect.top) / rect.height, 0, 1);
      const anchorX = isDark ? 0.5 : 0.32;
      const anchorY = 0.2;
      input.x = anchorX + (rawX - anchorX) * (0.35 + attraction * 0.65);
      input.y = anchorY + (rawY - anchorY) * (0.35 + attraction * 0.65);
      return inside;
    };

    const setFallbackVars = () => {
      const c = configRef.current;
      const minSide = Math.min(size.width, size.height);
      const edge = Math.min(c.edgeWidth, minSide * 0.45);
      const deg = (elapsed * 48 - 45) % 360;
      root.style.setProperty("--ls-width", `${edge}px`);
      root.style.setProperty("--ls-phase", `${deg.toFixed(2)}deg`);
      root.style.setProperty("--ls-x", `${(input.sx * 100).toFixed(2)}%`);
      root.style.setProperty("--ls-y", `${(input.sy * 100).toFixed(2)}%`);
      root.style.setProperty("--ls-energy", energy.toFixed(3));
      root.style.setProperty("--ls-size", `${c.light.size}px`);
      root.style.setProperty("--ls-light", c.colors.highlight || "#EEF6FF");
      root.style.setProperty("--ls-shade", c.colors.shade || "#111A28");
      root.style.setProperty("--ls-accent", c.colors.accent || "#D7BB93");
      root.style.setProperty("--ls-hover-ink", c.colors.highlight || "#EEF6FF");
      root.style.setProperty("--ls-brightness", String(c.brightness));
      root.style.setProperty("--ls-edge-opacity", isDark ? "0.94" : "1");
      root.style.setProperty("--ls-hover-alpha", String(surfaceClamp(c.light.intensity * 0.26, 0, 0.45)));
    };

    const paint = () => {
      if (stopped) return;
      const c = configRef.current;
      if (!gl || !program || lost) {
        setFallbackVars();
        showRenderer("fallback");
        return;
      }
      const minSide = Math.min(size.width, size.height);
      const edge = Math.min(c.edgeWidth, minSide * 0.45);
      const lightRgb = parseColorVec3(c.colors.highlight || "#EEF6FF", [0.93, 0.965, 1]);
      const shadeRgb = parseColorVec3(c.colors.shade || "#111A28", [0.067, 0.102, 0.157]);
      const accentRgb = parseColorVec3(c.colors.accent || "#D7BB93", [0.843, 0.733, 0.576]);
      const hoverRgb = parseColorVec3(c.colors.highlight || "#EEF6FF", lightRgb);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.u_size, size.width, size.height);
      gl.uniform2f(uniforms.u_pointer, input.sx, input.sy);
      gl.uniform1f(uniforms.u_time, elapsed);
      gl.uniform1f(uniforms.u_edge, edge);
      gl.uniform1f(uniforms.u_radius, size.radius);
      gl.uniform1f(uniforms.u_energy, c.still ? 0 : energy);
      gl.uniform1f(uniforms.u_press, c.still ? 0 : pressure);
      gl.uniform1f(uniforms.u_release, c.still ? 1 : release);
      gl.uniform1f(uniforms.u_brightness, surfaceClamp(c.brightness, 0.5, 1.5));
      gl.uniform1f(uniforms.u_flow, surfaceClamp(c.motion.flow, 0, 1.5));
      gl.uniform1f(uniforms.u_prism, surfaceClamp(c.prism, 0, 1.2));
      gl.uniform1f(uniforms.u_hoverIntensity, surfaceClamp(c.light.intensity, 0, 1.6));
      gl.uniform1f(uniforms.u_hoverRadius, surfaceClamp(c.light.size, 36, 360));
      gl.uniform1f(uniforms.u_glow, surfaceClamp(c.light.glow, 0, 1));
      gl.uniform1f(uniforms.u_variant, isDark ? 1 : 0);
      gl.uniform3f(uniforms.u_light, lightRgb[0], lightRgb[1], lightRgb[2]);
      gl.uniform3f(uniforms.u_shade, shadeRgb[0], shadeRgb[1], shadeRgb[2]);
      gl.uniform3f(uniforms.u_accent, accentRgb[0], accentRgb[1], accentRgb[2]);
      gl.uniform3f(uniforms.u_hoverInk, hoverRgb[0], hoverRgb[1], hoverRgb[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (gl.isContextLost()) {
        lost = true;
        showRenderer("fallback");
        return;
      }
      showRenderer("webgl");
    };

    initGPU();

    const tick = (now: number) => {
      frame = 0;
      if (stopped || !visible || document.hidden) {
        last = 0;
        return;
      }
      const c = configRef.current;
      const dt = last ? Math.min((now - last) / 1e3, 0.05) : 1 / 60;
      last = now;
      const active = !c.still && (input.hovered || input.focused || input.pressed);
      if (c.still) {
        energy = 0;
        pressure = 0;
        release = 1;
        phaseVelocity = 0;
        paint();
        last = 0;
        return;
      }
      energy += ((active ? 1 : 0) - energy) * (1 - Math.exp(-dt * 8));
      pressure += ((input.pressed ? 1 : 0) - pressure) * (1 - Math.exp(-dt * 18));
      input.sx += (input.x - input.sx) * (1 - Math.exp(-dt * 24));
      input.sy += (input.y - input.sy) * (1 - Math.exp(-dt * 24));
      release = Math.min(1, release + dt * 1.35);
      const speed = surfaceClamp(c.motion.speed, 0.1, 2);
      const targetVelocity = active || c.motion.playback === "ambient" ? speed : 0;
      const decay = Math.exp(-dt * 6);
      elapsed += targetVelocity * dt + ((phaseVelocity - targetVelocity) * (1 - decay)) / 6;
      phaseVelocity = targetVelocity + (phaseVelocity - targetVelocity) * decay;
      const moving = Math.abs(phaseVelocity - targetVelocity) > 5e-4;
      if (!moving) phaseVelocity = targetVelocity;
      paint();
      const settling =
        Math.abs(energy - (active ? 1 : 0)) > 0.003 ||
        Math.abs(pressure - (input.pressed ? 1 : 0)) > 0.003 ||
        release < 1 ||
        Math.abs(input.sx - input.x) > 0.002 ||
        Math.abs(input.sy - input.y) > 0.002;
      if (targetVelocity > 0 || moving || settling) {
        frame = requestAnimationFrame(tick);
      } else {
        last = 0;
      }
    };

    function wake() {
      if (stopped || lost) return;
      if (!frame && visible && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    }

    wakeRef.current = () => {
      readSize();
      wake();
    };

    const point = (event: PointerEvent) => {
      input.clientX = event.clientX;
      input.clientY = event.clientY;
      input.hasPointer = true;
      return projectPointer();
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      input.hovered = point(event);
      wake();
    };
    const move = (event: PointerEvent) => {
      if (configRef.current.still || event.pointerType === "touch") return;
      input.hovered = point(event);
      wake();
    };
    const leave = () => {
      input.hovered = false;
      wake();
    };
    const down = (event: PointerEvent) => {
      point(event);
      input.pressed = true;
      wake();
    };
    const up = () => {
      if (input.pressed) release = 0;
      input.pressed = false;
      wake();
    };
    const reset = () => {
      input.hovered = input.focused = input.pressed = false;
      energy = pressure = phaseVelocity = 0;
      release = 1;
      wake();
    };
    const visibility = () => {
      if (document.hidden) {
        reset();
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      } else {
        wake();
      }
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      showRenderer("fallback");
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const onRestored = () => setVersion((v) => v + 1);
    const resize = () => {
      readSize();
      wake();
    };

    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(root);
    if (host !== root) ro?.observe(host);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? true;
            if (visible) wake();
            else {
              cancelAnimationFrame(frame);
              frame = 0;
              last = 0;
            }
          })
        : null;
    io?.observe(root);

    const shapeObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            readSize();
            wake();
          })
        : null;
    if (host !== root) {
      shapeObserver?.observe(host, { attributes: true, attributeFilter: ["style", "class"] });
    }

    readSize();
    paint();
    wake();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      wakeRef.current = null;
      ro?.disconnect();
      io?.disconnect();
      shapeObserver?.disconnect();
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      host.removeAttribute(scopeAttribute);
      cleanupGPU();
      gl = null;
      showRenderer("pending");
    };
  }, [version, scopeAttribute, unique, material]);

  useEffect(() => {
    wakeRef.current?.();
  }, [
    material,
    edgeWidth,
    brightness,
    prism,
    radius,
    colors.highlight,
    colors.shade,
    colors.accent,
    light.intensity,
    light.size,
    light.glow,
    motion.playback,
    motion.speed,
    motion.flow,
    motion.attraction,
    still,
  ]);

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    display: "block",
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    pointerEvents: "none",
    userSelect: "none",
    visibility: "hidden",
  };

  return (
    <div
      ref={rootRef}
      className="liquid-surface"
      data-renderer="pending"
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        ...style,
        position: "relative",
        pointerEvents: "none",
        userSelect: "none",
        overflow: "visible",
      }}
    >
      <style>{`.liquid-surface>canvas,.liquid-surface>.ls-fallback{visibility:hidden;position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;pointer-events:none}.liquid-surface .ls-edge{inset:.7px;width:auto;height:auto;padding:var(--ls-width,4px);opacity:var(--ls-edge-opacity,1);background:radial-gradient(ellipse at var(--ls-x,32%) 0%,var(--ls-light,#eef6ff),transparent 40%),conic-gradient(from var(--ls-phase,-45deg),var(--ls-shade,#111a28),var(--ls-light,#eef6ff) 21%,var(--ls-shade,#111a28) 37%,var(--ls-accent,#d7bb93) 51%,var(--ls-light,#eef6ff) 68%,var(--ls-shade,#111a28) 85%,var(--ls-light,#eef6ff));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;filter:brightness(var(--ls-brightness,1))}.liquid-surface .ls-light{background:radial-gradient(ellipse var(--ls-size,115px) 80% at var(--ls-x,32%) var(--ls-y,20%),var(--ls-hover-ink,#eef6ff),transparent 80%);opacity:calc(var(--ls-energy,0)*var(--ls-hover-alpha,.2))}.liquid-surface[data-renderer=webgl]>.ls-gpu,.liquid-surface[data-renderer=fallback]>.ls-fallback{visibility:visible}`}</style>
      <span className="ls-fallback ls-light" style={layerStyle} />
      <span
        className="ls-fallback ls-edge"
        style={{ ...layerStyle, inset: 0.7, width: "auto", height: "auto" }}
      />
      <canvas ref={canvasRef} className="ls-gpu" width={1} height={1} style={layerStyle} />
    </div>
  );
}

/* ==========================================================================
   3. LiquidMark Component (WebGL 3D Chrome Torus Medallion)
   ========================================================================== */

const MEDALLION_CSS = `
.lm-medallion{position:relative;display:inline-grid;place-items:center;flex-shrink:0;isolation:isolate;user-select:none}
.lm-medallion[data-renderer=pending]{visibility:hidden}
.lm-medallion .lmm-layer{position:absolute;pointer-events:none;user-select:none;border-radius:50%}
.lm-medallion .lmm-torus{background:radial-gradient(ellipse at 24% 10%,#fff,transparent 40%),conic-gradient(from var(--lmm-phase,-44deg),#deedff,#273a58 8%,#fff 20%,#d6e9ff 26%,#182136 34%,#6b81a1 42%,#f8fdff 49%,#bddcff 55%,#263246 66%,#f5d8ae 72%,#fff 79%,#192336 89%,#deedff);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;filter:saturate(var(--lmm-saturation,1.2)) drop-shadow(0 1px 1px #060b1488)}
.lm-medallion[data-renderer=webgl] .lmm-torus{visibility:hidden}
.lm-medallion .lmm-center{transition:transform 150ms cubic-bezier(.2,.8,.2,1)}
.lm-medallion[data-pressed=true]:not([data-still=true]) .lmm-center{transform:scale(.98)}
`;

export function LiquidMark({
  size = 36,
  flow = 0.9,
  brightness = 1,
}: {
  size?: number;
  flow?: number;
  brightness?: number;
}) {
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [version, setVersion] = useState(0);

  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const releaseCount = useRef(0);
  const previousPress = useRef(pressed);
  const phaseRef = useRef(1.4);

  const still = reduced;
  const propsRef = useRef({
    size,
    still,
    active,
    pressed,
    speed: 0.8,
    flow,
    prism: 0.55,
    attraction: 0.8,
    brightness,
    glow: 0.25,
  });
  propsRef.current = {
    size,
    still,
    active,
    pressed,
    speed: 0.8,
    flow,
    prism: 0.55,
    attraction: 0.8,
    brightness,
    glow: 0.25,
  };

  const displaySize = surfaceClamp(size, 20, 160);
  const thickness = Math.min(5.2, displaySize * 0.14);
  const gradId = useId().replace(/:/g, "");

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(q.matches);
    update();
    q.addEventListener("change", update);
    const up = () => setPressed(false);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      q.removeEventListener("change", update);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  useLiquidLayoutEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || typeof window === "undefined") return;

    const torus = root.querySelector<HTMLElement>(".lmm-torus");
    let currentRenderer = "";
    const showRenderer = (mode: string) => {
      if (currentRenderer === mode) return;
      currentRenderer = mode;
      root.dataset.renderer = mode;
      root.style.visibility = mode === "pending" ? "hidden" : "visible";
      canvas.style.visibility = mode === "webgl" ? "visible" : "hidden";
      if (torus) torus.style.visibility = mode === "fallback" ? "visible" : "hidden";
    };

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const shaders: WebGLShader[] = [];
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    let stopped = false;
    let lost = false;
    let visible = true;
    let dirty = true;
    let frame = 0;
    let last = 0;
    let lastDraw = 0;
    let hover = 0;
    let pressure = 0;
    let release = 1;
    let seenRelease = releaseCount.current;
    let x = -0.5;
    let y = -0.5;
    let tx = -0.5;
    let ty = -0.5;
    let suppressPress = false;

    showRenderer("pending");
    canvas.style.opacity = "0";

    const cleanupGPU = () => {
      if (!gl) return;
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      shaders.forEach((s) => gl?.deleteShader(s));
      program = null;
      buffer = null;
      shaders.length = 0;
    };

    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (gl) {
        const compile = (kind: number, source: string) => {
          const shader = gl!.createShader(kind);
          if (!shader) throw new Error("Shader allocation failed");
          shaders.push(shader);
          gl!.shaderSource(shader, source);
          gl!.compileShader(shader);
          if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
            throw new Error(gl!.getShaderInfoLog(shader) || "Shader compilation failed");
          }
          return shader;
        };
        const vertex = compile(gl.VERTEX_SHADER, MEDALLION_VERTEX);
        const fragment = compile(gl.FRAGMENT_SHADER, MEDALLION_FRAGMENT);
        program = gl.createProgram();
        buffer = gl.createBuffer();
        if (!program || !buffer) throw new Error("Renderer allocation failed");
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "Shader linking failed");
        }
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const position = gl.getAttribLocation(program, "position");
        if (position < 0) throw new Error("Renderer position unavailable");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        for (const name of [
          "time",
          "pixels",
          "tube",
          "flow",
          "dispersion",
          "glow",
          "warmth",
          "hover",
          "hoverTone",
          "hoverIntensity",
          "press",
          "response",
          "release",
          "pointer",
        ]) {
          uniforms[name] = gl.getUniformLocation(program, name);
        }
      }
    } catch (error) {
      console.warn("Liquid Metal: medallion uses CSS fallback.", error);
      cleanupGPU();
      gl = null;
    }

    const scalar = (name: string, value: number) => gl?.uniform1f(uniforms[name], value);

    const draw = () => {
      if (stopped || lost) return;
      const c = propsRef.current;
      const sz = surfaceClamp(c.size, 20, 160);
      if (!gl || !program) {
        root.style.setProperty("--lmm-phase", `${phaseRef.current * 46 - 85}deg`);
        root.style.setProperty("--lmm-saturation", String(0.1 + surfaceClamp(c.prism, 0, 1) * 1.7));
        showRenderer("fallback");
        return;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      scalar("pixels", canvas.width);
      scalar("time", phaseRef.current);
      scalar("tube", Math.min(0.14, Math.max(0.022, 5.2 / sz)));
      scalar("flow", surfaceClamp(c.flow, 0, 1.5));
      scalar("dispersion", surfaceClamp(c.prism, 0, 1));
      scalar("glow", surfaceClamp(c.glow, 0, 1));
      scalar("warmth", 0);
      scalar("hover", c.still ? 0 : hover * surfaceClamp(c.attraction, 0, 1));
      scalar("hoverTone", 1);
      scalar("hoverIntensity", 0.72);
      scalar("press", c.still ? 0 : pressure);
      scalar("response", 0.78);
      scalar("release", c.still ? 1 : release);
      gl.uniform2f(uniforms.pointer, x, y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (gl.isContextLost()) {
        showRenderer("fallback");
        canvas.style.opacity = "0";
        return;
      }
      canvas.style.opacity = "1";
      showRenderer("webgl");
    };

    const tick = (now: number) => {
      frame = 0;
      if (stopped || lost || !visible || document.hidden) {
        last = 0;
        return;
      }
      const c = propsRef.current;
      const dt = last ? Math.min((now - last) / 1e3, 0.04) : 1 / 60;
      last = now;
      if (!c.pressed) suppressPress = false;
      if (c.still) {
        hover = pressure = 0;
        release = 1;
        seenRelease = releaseCount.current;
        draw();
        last = 0;
        return;
      }
      if (seenRelease !== releaseCount.current) {
        release = 0;
        seenRelease = releaseCount.current;
      }
      const k = 1 - Math.exp(-dt * 10);
      hover += ((c.active ? 1 : 0) - hover) * k;
      pressure += ((c.pressed && !suppressPress ? 1 : 0) - pressure) * (1 - Math.exp(-dt * 18));
      x += (tx - x) * k;
      y += (ty - y) * k;
      release = Math.min(1, release + dt * 1.35);
      phaseRef.current += dt * surfaceClamp(c.speed, 0, 2);
      if (
        dirty ||
        c.active ||
        hover > 0.01 ||
        now - lastDraw >= 30 ||
        release < 1 ||
        Math.abs(pressure - (c.pressed ? 1 : 0)) > 0.005
      ) {
        draw();
        lastDraw = now;
        dirty = false;
      }
      const evolving =
        c.speed > 0 ||
        (c.pressed && !suppressPress) ||
        release < 1 ||
        Math.abs(hover - (c.active ? 1 : 0)) > 0.003 ||
        pressure > 0.003 ||
        Math.abs(x - tx) > 0.002 ||
        Math.abs(y - ty) > 0.002;
      if (evolving) frame = requestAnimationFrame(tick);
      else last = 0;
    };

    function wake() {
      dirty = true;
      if (!frame && !stopped && !lost && visible && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    }

    const resize = () => {
      const sz = surfaceClamp(propsRef.current.size, 20, 160);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.max(1, Math.min(512, Math.round(sz * 1.2 * dpr)));
      if (canvas.width !== px || canvas.height !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      if (!document.hidden && visible) draw();
      wake();
    };

    const pointerMove = (event: PointerEvent) => {
      const c = propsRef.current;
      if (c.still || !c.active || event.pointerType === "touch") return;
      const box = root.getBoundingClientRect();
      if (!box.width || !box.height) return;
      tx = surfaceClamp(((event.clientX - box.left) / box.width) * 2 - 1, -1.5, 1.5);
      ty = surfaceClamp(((event.clientY - box.top) / box.height) * 2 - 1, -1.5, 1.5);
      wake();
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      canvas.style.opacity = "0";
      showRenderer("fallback");
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const onRestored = () => setVersion((v) => v + 1);

    wakeRef.current = wake;
    document.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    resize();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      cleanupGPU();
      wakeRef.current = null;
    };
  }, [version]);

  useEffect(() => {
    if (previousPress.current && !pressed && !still) releaseCount.current += 1;
    previousPress.current = pressed;
    wakeRef.current?.();
  }, [size, still, active, pressed, flow, brightness]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: displaySize,
        height: displaySize,
        display: "grid",
        placeItems: "center",
        userSelect: "none",
        flexShrink: 0,
      }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
    >
      <span
        ref={rootRef}
        className="lm-medallion"
        data-renderer="pending"
        data-still={still}
        data-pressed={pressed}
        style={{
          width: displaySize,
          height: displaySize,
          borderRadius: "50%",
          position: "relative",
          display: "inline-grid",
          placeItems: "center",
          flexShrink: 0,
          isolation: "isolate",
          userSelect: "none",
          visibility: "hidden",
        }}
      >
        <style>{MEDALLION_CSS}</style>
        <span
          className="lmm-layer lmm-glass"
          aria-hidden="true"
          style={{
            position: "absolute",
            pointerEvents: "none",
            userSelect: "none",
            borderRadius: "50%",
            inset: "9.5%",
            background:
              "linear-gradient(140deg,rgba(255,255,255,.16),transparent 48%,rgba(0,0,0,.24)),#343B46",
            boxShadow:
              "inset 0 1px 3px rgba(255,255,255,.25),inset 0 -1px 3px rgba(0,0,0,.6),0 5px 8px -3px rgba(0,0,0,.38)",
          }}
        />
        <span
          className="lmm-layer lmm-torus"
          aria-hidden="true"
          style={{
            position: "absolute",
            pointerEvents: "none",
            userSelect: "none",
            borderRadius: "50%",
            visibility: "hidden",
            inset: Math.max(1, displaySize * 0.095 - thickness / 2),
            padding: thickness,
          }}
        />
        <canvas
          ref={canvasRef}
          className="lmm-layer"
          aria-hidden="true"
          width={1}
          height={1}
          style={{
            position: "absolute",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
            borderRadius: "50%",
            visibility: "hidden",
            inset: "-10%",
            width: "120%",
            height: "120%",
            opacity: 0,
            filter: `brightness(${surfaceClamp(brightness, 0.4, 1.3)})`,
          }}
        />
        <span
          className="lmm-center"
          style={{
            position: "relative",
            display: "grid",
            placeItems: "center",
            color: "#F8FAFC",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,.4))",
            pointerEvents: "none",
          }}
        >
          <svg
            width={displaySize * 0.42}
            height={displaySize * 0.42}
            viewBox="0 0 24 24"
            fill="none"
          >
            <defs>
              <linearGradient id={gradId}>
                <stop stopColor="#fff" />
                <stop offset=".3" stopColor="#8398B3" />
                <stop offset=".48" stopColor="#F7FBFF" />
                <stop offset=".65" stopColor="#D9E6F9" />
                <stop offset=".79" stopColor="#52647D" />
                <stop offset="1" stopColor="#fff" />
              </linearGradient>
            </defs>
            <path
              d="M12 1.8C14.2 8.7 15.3 9.8 22.2 12 15.3 14.2 14.2 15.3 12 22.2 9.8 15.3 8.7 14.2 1.8 12 8.7 9.8 9.8 8.7 12 1.8Z"
              fill={`url(#${gradId})`}
            />
          </svg>
        </span>
      </span>
    </div>
  );
}

/* ==========================================================================
   4. NavLink Component (Compact Sliding Dual-Label + Bottom Light Dash)
   ========================================================================== */

interface LiquidNavLinkProps {
  label: string;
  href: string;
  active: boolean;
  isLight: boolean;
  onClick?: () => void;
}

function LiquidNavLink({ label, href, active, isLight, onClick }: LiquidNavLinkProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const restColor = isLight ? "rgb(30, 41, 59)" : "#ffffff";
  const hoverColor = isLight ? "rgb(2, 6, 23)" : "rgb(255, 255, 255)";
  const dashColor = isLight ? "#000000" : "rgb(245, 248, 255)";

  const showHoverState = hovered || active;

  return (
    <NextLink
      href={href}
      onClick={onClick}
      className="lmn-nav-link"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 36,
        padding: "6px 14px",
        position: "relative",
        textDecoration: "none",
        userSelect: "none",
        borderRadius: 99,
        opacity: pressed ? 0.72 : 1,
        transition: "opacity 0.18s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 20,
          padding: "0 2px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <span
          className="lmn-link-text"
          style={{
            display: "inline-block",
            padding: "0 2px",
            fontSize: 13,
            lineHeight: "20px",
            letterSpacing: "-0.1px",
            fontWeight: 600,
            opacity: 0,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
        <span
          data-framer-name="Label Rest"
          className="lmn-link-text"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: showHoverState ? -21 : 0,
            textAlign: "center",
            fontSize: 13,
            lineHeight: "20px",
            letterSpacing: "-0.1px",
            fontWeight: 460,
            color: restColor,
            opacity: showHoverState ? 0 : 1,
            whiteSpace: "nowrap",
            textShadow: "none",
            transition:
              "top 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {label}
        </span>
        <span
          data-framer-name="Label Hover"
          className="lmn-link-text"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: showHoverState ? 0 : 21,
            textAlign: "center",
            fontSize: 13,
            lineHeight: "20px",
            letterSpacing: "-0.1px",
            fontWeight: 560,
            color: hoverColor,
            opacity: showHoverState ? 1 : 0,
            whiteSpace: "nowrap",
            textShadow: "none",
            transition:
              "top 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Bottom Light Dash (Active Underline Indicator + Hover Dash) */}
      <div
        style={{
          position: "absolute",
          bottom: 3,
          left: 0,
          right: 0,
          height: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          data-framer-name="Light Dash"
          style={{
            height: 2,
            width: active ? 18 : hovered ? 13 : 6,
            borderRadius: 99,
            backgroundColor: dashColor,
            boxShadow: active
              ? isLight
                ? "0 1px 2px rgba(0, 0, 0, 0.2)"
                : "0 0 8px rgba(245, 248, 255, 0.65)"
              : "none",
            opacity: active ? 1 : hovered ? 0.85 : 0,
            transition:
              "width 0.22s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.18s ease",
          }}
        />
      </div>
    </NextLink>
  );
}

/* ==========================================================================
   5. LiquidMetalThemeButton Component (Icon-Only Theme Button with Hover Preview)
   ========================================================================== */

function LiquidMetalThemeButton({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Idle shows current theme; Hover previews the opposite theme
  const visualTheme: "light" | "dark" = hovered
    ? theme === "light"
      ? "dark"
      : "light"
    : theme;

  const isVisualLight = visualTheme === "light";
  const nextLabel = theme === "light" ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={() => {
        setHovered(false);
        setPressed(false);
        onToggle();
      }}
      aria-label={`Switch to ${nextLabel} Mode`}
      data-liquid-host
      className="lmn-theme-btn"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        minHeight: 34,
        padding: 0,
        borderRadius: 100,
        border: "none",
        outline: "none",
        cursor: "pointer",
        backgroundColor: isVisualLight ? "rgb(245, 247, 250)" : "rgb(30, 35, 44)",
        color: isVisualLight ? "rgb(23, 29, 39)" : "rgb(239, 243, 250)",
        boxShadow: isVisualLight
          ? "0 4px 10px -3px rgba(15, 23, 42, 0.18)"
          : "0 4px 12px -3px rgba(0, 0, 0, 0.45)",
        transform: pressed ? "scale(0.92)" : "scale(1)",
        transition:
          "background-color 0.28s cubic-bezier(0.22, 1, 0.36, 1), color 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: 100,
        }}
      >
        <LiquidSurface
          material={isVisualLight ? "navigation" : "dark"}
          edgeWidth={1.8}
          hoverLight={0.75}
          liquid={0.9}
          prism={0.6}
          brightness={1}
        />
      </div>

      {/* Sun / Moon Morphing Icon Container */}
      <span
        style={{
          position: "relative",
          width: 15,
          height: 15,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Sun Icon (Shown when visualTheme is Light) */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            inset: 0,
            opacity: isVisualLight ? 1 : 0,
            transform: isVisualLight
              ? "scale(1) rotate(0deg)"
              : "scale(0.45) rotate(-75deg)",
            transition:
              "opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1), transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Moon Icon (Shown when visualTheme is Dark) */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            inset: 0,
            opacity: !isVisualLight ? 1 : 0,
            transform: !isVisualLight
              ? "scale(1) rotate(0deg)"
              : "scale(0.45) rotate(75deg)",
            transition:
              "opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1), transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}

/* ==========================================================================
   6. Main LiquidMetalNavbar Component (Compact & Logo-Free)
   ========================================================================== */

export interface NavRouteItem {
  label: string;
  href: string;
  active: boolean;
}

export function LiquidMetalNavbar({ items }: { items: NavRouteItem[] }) {
  const { theme, toggleTheme } = useAppTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted ? theme === "light" : true;
  const glassBackground = isLight
    ? "radial-gradient(130% 120% at 50% 0%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(186, 230, 253, 0.22) 100%)"
    : "radial-gradient(130% 120% at 50% 0%, rgba(255, 255, 255, 0.18) 0%, rgba(10, 22, 34, 0.14) 55%, rgba(56, 189, 248, 0.14) 100%)";
  const glassShadow = isLight
    ? "0 14px 32px -8px rgba(15, 23, 42, 0.14), inset 0 2px 5px rgba(255, 255, 255, 0.5), inset 0 -3px 6px rgba(186, 230, 253, 0.24)"
    : "0 16px 34px -8px rgba(0, 0, 0, 0.38), inset 0 2px 5px rgba(255, 255, 255, 0.18), inset 0 -3px 6px rgba(56, 189, 248, 0.12)";

  return (
    <nav
      aria-label="Main navigation"
      data-liquid-host
      className="liquid-metal-navbar"
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "5px 6px",
        background: glassBackground,
        backdropFilter: "blur(10px) saturate(215%) contrast(104%)",
        WebkitBackdropFilter: "blur(10px) saturate(215%) contrast(104%)",
        borderRadius: 100,
        boxShadow: glassShadow,
        transition:
          "background 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
        width: "fit-content",
        maxWidth: "calc(100vw - 16px)",
      }}
    >
      <style>{`
        .liquid-metal-navbar {
          flex-wrap: nowrap;
          -webkit-tap-highlight-color: transparent;
        }
        .liquid-metal-navbar a,
        .liquid-metal-navbar button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .lmn-links-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }
        @media (max-width: 640px) {
          .liquid-metal-navbar {
            gap: 4px;
            padding: 4px 5px !important;
          }
          .lmn-nav-link {
            min-height: 36px !important;
            padding: 5px clamp(7px, 2.4vw, 10px) !important;
          }
          .lmn-link-text {
            font-size: 12px !important;
          }
          .lmn-theme-btn {
            min-height: 36px !important;
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
          }
          .lmn-theme-label {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. WebGL Liquid Surface Chrome Rim & Interactive Light Pool */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      >
        <LiquidSurface
          material="navigation"
          edgeWidth={2.5}
          hoverLight={0.65}
          liquid={0.9}
          prism={0.6}
          brightness={1}
          colors={{
            accent: "rgb(215, 187, 147)",
            highlight: "rgb(238, 246, 255)",
            shade: "rgb(17, 26, 40)",
          }}
        />
      </div>

      {/* 2. Navigation Links */}
      <div className="lmn-links-row" data-framer-name="Links">
        {items.map((item) => (
          <LiquidNavLink
            key={item.href}
            label={item.label}
            href={item.href}
            active={item.active}
            isLight={isLight}
          />
        ))}
      </div>

      {/* 3. Right Liquid Metal Button (Theme Switcher) */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <LiquidMetalThemeButton
          theme={isLight ? "light" : "dark"}
          onToggle={toggleTheme}
        />
      </div>
    </nav>
  );
}
export default LiquidMetalNavbar;
