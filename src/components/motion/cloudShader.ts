/*
 * Adapted from Vanta CLOUDS2 (https://github.com/tengbao/vanta).
 * Copyright 2020 Teng Bao
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export const CLOUD_FRAGMENT_SHADER = /* glsl */ `
uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iTex;
uniform float speed;
uniform vec3 skyColor;
uniform vec3 cloudColor;
uniform vec3 lightColor;

float cloudNoise(vec4 point, float octave) {
  float slice = point.x * octave;
  float lower = floor(slice);
  float blend = smoothstep(0.0, 1.0, fract(slice));
  vec2 uv = point.zw * octave;
  // ceil(slice) switches an entire depth layer at once. Interpolate adjacent
  // slices so density stays continuous as the camera moves through the clouds.
  // RepeatWrapping on iTex also keeps filtering continuous across tile edges.
  return mix(
    texture2D(iTex, (uv + lower) / 200.0).g,
    texture2D(iTex, (uv + lower + 1.0) / 200.0).g,
    blend
  );
}

void main() {
  vec4 direction = vec4(0.8, 0.0, gl_FragCoord.xy / iResolution.y - 0.65);
  vec3 color = skyColor - direction.w;
  float travel = iTime * 0.5 * speed;
  float sway = sin(iTime * 0.25 * speed) * 0.25;
  const float MARCH_STEPS = 48.0;

  for (float i = 1.0; i <= MARCH_STEPS; i += 1.0) {
    // Calculate distance directly to avoid accumulated rounding at the last step.
    float distance = 200.0 * (1.0 - i / MARCH_STEPS);
    vec4 point = 0.05 * distance * direction;
    point.xz += travel;
    point.x += sway;
    // Three octaves retain the cloud shapes. Use the finest octave's mean
    // contribution instead of spending two more texture reads on tiny details.
    float density = point.w + 1.0
      - cloudNoise(point, 2.0)
      - 0.5 * cloudNoise(point, 4.0)
      - 0.25 * cloudNoise(point, 8.0)
      - 0.0625;

    if (density < 0.0) {
      vec3 shadedCloud = mix(lightColor, cloudColor, -density);
      // Preserve optical thickness with fewer, more widely spaced samples.
      float alpha = 1.0 - pow(
        1.0 - clamp(-density * 0.4, 0.0, 1.0), 100.0 / MARCH_STEPS
      );
      color = mix(color, shadedCloud, alpha);
    }
  }
  gl_FragColor = vec4(color, 1.0);
}
`;
