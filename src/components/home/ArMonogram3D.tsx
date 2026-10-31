"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const AR_SVG_RAW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="800 1350 550 420">
  <path d="M1052.468,1718.483C1050.01,1722.087 1047.414,1725.415 1044.68,1728.465C1035.344,1738.878 1024.751,1744.084 1012.902,1744.084C1000.334,1744.084 990.46,1739.237 983.278,1729.542C976.097,1719.847 970.711,1708.087 967.12,1694.263C963.529,1680.438 961.464,1665.986 960.926,1650.905C960.387,1635.823 960.657,1622.897 961.734,1612.125C957.784,1640.132 951.41,1663.652 942.613,1682.683C933.816,1701.714 923.851,1716.795 912.72,1727.926C901.589,1739.057 890.098,1746.418 878.249,1750.009C866.4,1753.6 855.627,1754.049 845.932,1751.356C836.237,1748.663 828.248,1743.007 821.964,1734.389C815.68,1725.772 812.538,1714.64 812.538,1700.995C812.538,1688.428 815.052,1674.334 820.079,1658.714C825.106,1643.095 831.39,1627.116 838.93,1610.778C846.471,1594.44 854.64,1578.551 863.437,1563.111C872.235,1547.671 880.403,1533.757 887.944,1521.369C895.485,1508.98 901.679,1498.926 906.526,1491.206C911.374,1483.486 913.797,1479.267 913.797,1478.549C906.616,1484.653 898.267,1489.052 888.752,1491.745C879.236,1494.438 871.068,1495.784 864.245,1495.784C851.318,1495.784 841.803,1493.002 835.699,1487.436C829.594,1481.87 826.273,1474.868 825.734,1466.43C825.196,1457.992 827.26,1448.836 831.928,1438.961C836.596,1429.086 843.509,1419.93 852.665,1411.492C861.821,1403.054 872.953,1396.052 886.059,1390.486C899.165,1384.92 913.797,1382.137 929.956,1382.137C954.373,1382.137 975.648,1387.344 993.781,1397.757C1011.914,1408.17 1027.085,1421.815 1039.294,1438.692C1040.724,1440.669 1042.118,1442.68 1043.475,1444.724C1044.035,1443.617 1044.616,1442.504 1045.219,1441.385C1052.759,1427.381 1063.262,1414.275 1076.727,1402.066C1090.193,1389.858 1106.441,1379.714 1125.472,1371.635C1144.503,1363.555 1165.688,1359.516 1189.028,1359.516C1217.395,1359.516 1241.183,1364.722 1260.394,1375.136C1279.604,1385.549 1294.326,1398.206 1304.56,1413.108C1314.794,1428.009 1320.539,1443.988 1321.795,1461.044C1323.052,1478.1 1320.09,1493.271 1312.908,1506.557C1305.727,1519.842 1294.326,1529.986 1278.707,1536.988C1263.087,1543.99 1243.428,1544.798 1219.729,1539.412C1233.014,1549.466 1246.569,1559.52 1260.394,1569.574C1274.218,1579.628 1286.696,1590.58 1297.827,1602.43C1308.959,1614.279 1318.115,1627.206 1325.296,1641.21C1332.478,1655.213 1336.069,1671.192 1336.069,1689.146C1336.069,1703.868 1332.657,1715.628 1325.835,1724.425C1319.013,1733.222 1310.395,1738.878 1299.982,1741.391C1289.569,1743.905 1278.078,1743.187 1265.511,1739.237C1252.943,1735.287 1241.094,1728.016 1229.962,1717.423C1218.831,1706.83 1209.046,1692.647 1200.608,1674.873C1192.17,1657.099 1186.694,1635.644 1184.18,1610.509C1184.18,1640.671 1180.949,1665.716 1174.485,1685.645C1168.022,1705.574 1159.853,1721.193 1149.978,1732.504C1140.104,1743.815 1129.421,1751.176 1117.931,1754.587C1106.441,1757.998 1095.758,1758.358 1085.884,1755.664C1076.009,1752.971 1067.84,1747.496 1061.377,1739.237C1056.754,1733.329 1053.784,1726.411 1052.468,1718.483ZM1229.656,1420.985C1222.477,1416.855 1205.364,1433.116 1191.465,1457.274C1177.565,1481.433 1172.109,1504.4 1179.288,1508.53C1186.467,1512.661 1203.58,1496.4 1217.479,1472.241C1231.378,1448.083 1236.834,1425.116 1229.656,1420.985ZM975.689,1491.583C968.047,1490.234 958.708,1506.899 954.846,1528.774C950.985,1550.65 954.054,1569.505 961.696,1570.854C969.338,1572.203 978.677,1555.538 982.538,1533.662C986.4,1511.787 983.33,1492.931 975.689,1491.583ZM1074.934,1523.193C1077.826,1536.34 1079.861,1549.646 1081.036,1563.111C1081.928,1573.331 1082.381,1583.459 1082.394,1593.495C1085.179,1586.745 1088.047,1580.028 1091.001,1573.345C1097.823,1557.904 1104.466,1543.721 1110.929,1530.794C1117.392,1517.868 1123.138,1506.826 1128.165,1497.67C1133.192,1488.513 1136.603,1482.14 1138.398,1478.549C1135.167,1483.576 1131.307,1488.693 1126.818,1493.899C1122.33,1499.106 1117.392,1503.864 1112.006,1508.173C1106.62,1512.481 1100.606,1516.072 1093.963,1518.945C1088.108,1521.477 1081.765,1522.893 1074.934,1523.193Z"/>
</svg>`;

/**
 * Filters out near-duplicate consecutive vertices so ExtrudeGeometry bevels
 * never produce miter spikes or internal artifact planes on tight Bezier corners.
 */
function cleanPolygonPoints(pts: THREE.Vector2[], minDist = 2.0): THREE.Vector2[] {
  const cleaned: THREE.Vector2[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (cleaned.length === 0 || p.distanceTo(cleaned[cleaned.length - 1]) >= minDist) {
      cleaned.push(p);
    }
  }
  if (cleaned.length > 2 && cleaned[0].distanceTo(cleaned[cleaned.length - 1]) < minDist) {
    cleaned.pop();
  }
  return cleaned;
}

/**
 * Parses AR.svg into clean, spike-free Three.js shapes with 3 inner counter holes.
 */
function parseArSvgShapes(svgString: string): THREE.Shape[] {
  const svgLoader = new SVGLoader();
  const svgData = svgLoader.parse(svgString);
  const shapes: THREE.Shape[] = [];

  svgData.paths.forEach((shapePath) => {
    const subPaths = shapePath.subPaths;
    if (!subPaths || subPaths.length === 0) return;

    const outerPts = cleanPolygonPoints(subPaths[0].getPoints(16), 2.5);
    const mainShape = new THREE.Shape(outerPts);

    for (let i = 1; i < subPaths.length; i++) {
      const holePts = cleanPolygonPoints(subPaths[i].getPoints(12), 2.0);
      mainShape.holes.push(new THREE.Path(holePts));
    }

    shapes.push(mainShape);
  });

  return shapes;
}

function createStudioEnvTexture(renderer: THREE.WebGLRenderer): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const bg = ctx.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, "#f0f9ff");
    bg.addColorStop(0.3, "#bae6fd");
    bg.addColorStop(0.65, "#38bdf8");
    bg.addColorStop(1, "#e0f2fe");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 256);

    const drawStrip = (y: number, h: number, alpha: number) => {
      const grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.3, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 512, h);
    };

    drawStrip(22, 28, 0.98);
    drawStrip(86, 22, 0.92);
    drawStrip(148, 26, 0.98);
    drawStrip(208, 18, 0.88);
  }

  const equirect = new THREE.CanvasTexture(canvas);
  equirect.mapping = THREE.EquirectangularReflectionMapping;
  equirect.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(equirect);
  equirect.dispose();
  pmrem.dispose();

  return envRT.texture;
}

export interface ArMonogram3DProps {
  className?: string;
}

export const ArMonogram3D: React.FC<ArMonogram3DProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const scene = new THREE.Scene();
    // Perspective camera positioned with generous frustum padding so the bottom never clips
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = "";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const envTexture = createStudioEnvTexture(renderer);
    scene.environment = envTexture;

    // Studio lighting for Fluid Glass
    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-5.0, 7.0, 7.5);
    scene.add(keyLight);

    const rimLightRight = new THREE.DirectionalLight(0xbae6fd, 2.4);
    rimLightRight.position.set(6.5, 3.0, 5.0);
    scene.add(rimLightRight);

    const bottomFillLight = new THREE.DirectionalLight(0x7dd3fc, 1.6);
    bottomFillLight.position.set(0, -6.5, 5.0);
    scene.add(bottomFillLight);

    // Parse user's custom AR.svg with spike-free polygon cleaning
    const shapes = parseArSvgShapes(AR_SVG_RAW);

    // Chunky 3D extrusion (~34% Z-to-Y depth ratio) & rounded bevels
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 85,
      bevelEnabled: true,
      bevelThickness: 28,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 16,
      curveSegments: 16,
    };

    const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    geometry.computeBoundingBox();
    geometry.center();

    // Flip SVG Y-down to 3D Y-up while preserving outward triangle winding
    geometry.rotateX(Math.PI);
    geometry.computeBoundingBox();

    const bbox = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y) || 1;
    // Scale mesh comfortably inside frustum height (2.49 units vs 4.47 visible frustum)
    const targetScale = 3.25 / maxDim;
    geometry.scale(targetScale, targetScale, targetScale);
    geometry.computeVertexNormals();

    // Translucent Light-Blue Gradient Fluid Glass Material (Gradasi Biru Muda Transparan)
    const fluidGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#7dd3fc"),
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      ior: 1.42,
      iridescence: 0.35,
      iridescenceIOR: 1.33,
      envMapIntensity: 2.0,
      transparent: true,
      opacity: 1.0,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    fluidGlassMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
        #include <common>
        varying vec3 vLocalPos;
        `,
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        vLocalPos = position;
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        varying vec3 vLocalPos;
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        // Normalized 2D coordinates across the 3D "AR" geometry
        float u = clamp((vLocalPos.x + 1.625) / 3.25, 0.0, 1.0);
        float v = clamp((vLocalPos.y + 1.245) / 2.49, 0.0, 1.0);

        // Smooth diagonal gradient factor (1.0 at top-left, 0.5 at center, 0.0 at bottom-right)
        float gradT = clamp((1.0 - u) * 0.44 + v * 0.56, 0.0, 1.0);

        // 3-stop Light Blue Gradient (Gradasi Biru Muda: Ice Baby Blue -> Crystal Sky Blue -> Soft Azure Blue)
        vec3 colBottomRight = vec3(0.18, 0.62, 0.96); // #2e9ef5 (Soft Azure Light Blue)
        vec3 colMiddle      = vec3(0.44, 0.78, 0.99); // #70c7fc (Crystal Sky Blue)
        vec3 colTopLeft     = vec3(0.76, 0.92, 1.00); // #c2ebff (Icy Light Blue)

        vec3 gradLightBlue = gradT < 0.5
          ? mix(colBottomRight, colMiddle, gradT * 2.0)
          : mix(colMiddle, colTopLeft, (gradT - 0.5) * 2.0);

        // Physical Fresnel & 3D Bevel Specular Highlights
        vec3 viewDir = normalize(vViewPosition);
        vec3 n = normalize(vNormal);
        float ndotv = abs(dot(n, viewDir));
        float fresnel = pow(1.0 - clamp(ndotv, 0.0, 1.0), 1.75);
        float rimGlow = pow(1.0 - clamp(ndotv, 0.0, 1.0), 3.1);

        // Studio specular reflection along rounded bevels and extruded side walls
        float topKeySpec = pow(max(dot(n, normalize(vec3(-0.35, 0.75, 0.55))), 0.0), 5.5);
        float sideWallFactor = 1.0 - abs(n.z);
        float studioBand = sideWallFactor * pow(0.5 + 0.5 * cos(vLocalPos.y * 5.0 + n.x * 1.3), 7.5);
        float specIntensity = clamp(topKeySpec * 0.55 + studioBand * 0.75 + rimGlow * 0.55, 0.0, 1.0);

        // Combine light-blue gradient body with glossy icy-white bevel reflections
        vec3 icyRimColor = vec3(0.90, 0.97, 1.00);
        vec3 finalGlassColor = mix(gradLightBlue, icyRimColor, clamp(fresnel * 0.45 + specIntensity * 0.50, 0.0, 0.92));
        finalGlassColor = mix(finalGlassColor, vec3(1.0), clamp(specIntensity * 0.52, 0.0, 0.65));

        // Translucent Fluid Glass alpha:
        // ~0.48 in the flat center so "Muhammad" & "Arinal" behind it shine through clearly,
        // rising to ~0.88 on the 3D rounded bevels and side walls
        float finalGlassAlpha = clamp(0.48 + fresnel * 0.34 + specIntensity * 0.20, 0.48, 0.90);

        gl_FragColor = vec4(finalGlassColor, finalGlassAlpha);
        #include <dithering_fragment>
        `,
      );
    };

    const mesh = new THREE.Mesh(geometry, fluidGlassMaterial);

    const fluidGroup = new THREE.Group();
    fluidGroup.add(mesh);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(-5);
    tiltGroup.add(fluidGroup);
    scene.add(tiltGroup);

    // Resize handling
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, true);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    // Viewport Culling: Pause WebGL rendering when scrolled offscreen
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
    });
    io.observe(container);

    // React Bits Fluid Glass Interactive Cursor Tracking & Tilt
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      pointer.targetX = (e.clientX - halfW) / halfW;
      pointer.targetY = (e.clientY - halfH) / halfH;
    };
    const onPointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("touchend", onPointerLeave, { passive: true });

    // Scroll acceleration on top of the 8-second base rotation
    let lastScrollY = window.scrollY;
    let scrollSpinBoost = 0;
    let targetScrollAngle = 0;
    let currentScrollAngle = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY;
      lastScrollY = currentY;

      if (deltaY > 0) {
        scrollSpinBoost = Math.min(scrollSpinBoost + deltaY * 0.05, 8.0);
        targetScrollAngle += deltaY * 0.014;
      } else if (deltaY < 0) {
        scrollSpinBoost = Math.min(scrollSpinBoost + Math.abs(deltaY) * 0.03, 5.0);
        targetScrollAngle += deltaY * 0.01;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        scrollSpinBoost = Math.min(scrollSpinBoost + Math.min(e.deltaY, 100) * 0.04, 8.0);
        targetScrollAngle += Math.min(e.deltaY, 100) * 0.012;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();
    let continuousAngle = 0;

    // Exact 8 seconds per 1 full 360° (2π radians) rotation
    const BASE_ROTATION_SPEED = (Math.PI * 2) / 8;

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Smooth cursor damping (Fluid Glass interactive follow)
      const lerpSpeed = 1 - Math.exp(-dt * 5.5);
      pointer.x += (pointer.targetX - pointer.x) * lerpSpeed;
      pointer.y += (pointer.targetY - pointer.y) * lerpSpeed;

      fluidGroup.position.x = pointer.x * 0.22;
      fluidGroup.position.y = -pointer.y * 0.16;

      fluidGroup.rotation.x = -pointer.y * 0.25;
      fluidGroup.rotation.z = pointer.x * 0.15;

      // Smooth decay of scroll boost back to the 8-second rotation speed
      scrollSpinBoost *= Math.exp(-dt * 3.2);
      currentScrollAngle += (targetScrollAngle - currentScrollAngle) * (1 - Math.exp(-dt * 8.0));

      continuousAngle += (BASE_ROTATION_SPEED + scrollSpinBoost) * dt;
      fluidGroup.rotation.y = continuousAngle + currentScrollAngle + pointer.x * 0.28;

      const t = now * 0.001;
      tiltGroup.position.y = Math.sin(t * 1.1) * 0.05;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchend", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      fluidGlassMaterial.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
};
