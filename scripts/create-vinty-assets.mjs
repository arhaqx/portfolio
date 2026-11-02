import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Original vector artwork, rasterized for React Native's native Image component.
const directory = resolve("apps/vinty-pos/assets");
await mkdir(directory, { recursive: true });
const drinks = {
  "kopi-susu": ["rgb(232,213,188)", "rgb(166,111,71)", "rgb(242,227,205)"],
  latte: ["rgb(232,217,200)", "rgb(179,125,85)", "rgb(245,230,208)"],
  americano: ["rgb(224,212,194)", "rgb(83,54,36)", "rgb(121,78,49)"],
  caramel: ["rgb(238,216,185)", "rgb(182,124,63)", "rgb(250,231,199)"],
  matcha: ["rgb(218,226,198)", "rgb(128,148,86)", "rgb(233,234,208)"],
  chocolate: ["rgb(223,206,193)", "rgb(106,70,51)", "rgb(189,151,120)"],
  lychee: ["rgb(225,228,197)", "rgb(176,148,80)", "rgb(242,233,183)"],
  strawberry: ["rgb(242,216,212)", "rgb(196,118,119)", "rgb(251,230,222)"],
};
const svg = (background, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420"><defs><radialGradient id="bg"><stop stop-color="white" stop-opacity=".5"/><stop offset="1" stop-color="${background}"/></radialGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="white" stop-opacity=".65"/><stop offset=".5" stop-color="white" stop-opacity=".04"/><stop offset="1" stop-color="white" stop-opacity=".32"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="10"/></filter></defs><rect width="600" height="420" fill="${background}"/><rect width="600" height="420" fill="url(#bg)"/><ellipse cx="308" cy="350" rx="115" ry="19" fill="rgb(75,49,34)" opacity=".13" filter="url(#shadow)"/>${body}</svg>`;
for (const [name, [bg, drink, milk]] of Object.entries(drinks)) {
  const body = `<path d="M328 57 305 197" stroke="rgb(99,71,49)" stroke-width="12" stroke-linecap="round"/><path d="M215 137H385L365 326Q360 348 300 348Q240 348 235 326Z" fill="${drink}"/><path d="M226 231Q301 210 374 235L365 326Q360 348 300 348Q240 348 235 326Z" fill="${milk}" opacity=".87"/><path d="M226 225Q285 244 374 216" fill="none" stroke="${drink}" stroke-width="22" opacity=".35"/><path d="M215 137H385L365 326Q360 348 300 348Q240 348 235 326Z" fill="url(#glass)" stroke="white" stroke-opacity=".75" stroke-width="3"/><ellipse cx="300" cy="137" rx="85" ry="20" fill="${drink}"/><g fill="white" opacity=".35"><rect x="241" y="145" width="36" height="28" rx="6" transform="rotate(12 250 150)"/><rect x="303" y="138" width="39" height="29" rx="6" transform="rotate(-15 320 155)"/><rect x="337" y="164" width="28" height="25" rx="5"/></g><ellipse cx="300" cy="135" rx="88" ry="21" fill="none" stroke="white" stroke-width="5" stroke-opacity=".8"/><path d="M236 166 249 314" stroke="white" stroke-width="7" stroke-linecap="round" opacity=".4"/><circle cx="300" cy="260" r="34" fill="rgb(80,58,43)"/><text x="300" y="273" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="rgb(246,236,218)">v.</text><text x="300" y="307" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" letter-spacing="4" fill="rgb(80,58,43)">VINTY</text>`;
  await sharp(Buffer.from(svg(bg, body)))
    .resize(480, 336)
    .png()
    .toFile(resolve(directory, `${name}.png`));
}
const foods = {
  croissant: `<ellipse cx="300" cy="259" rx="151" ry="65" fill="rgb(250,245,232)"/><ellipse cx="300" cy="257" rx="132" ry="49" fill="none" stroke="rgb(228,218,198)" stroke-width="3"/><g transform="rotate(-9 300 220)"><path d="M178 252Q167 178 243 176Q295 121 354 176Q424 184 423 249L367 237 350 214Q300 193 251 215L232 240Z" fill="rgb(186,115,49)"/><path d="M188 237Q189 192 242 188L252 213 231 240Z M247 181Q269 150 294 155L294 211 253 215Z M301 154Q330 151 351 179L345 213 301 207Z M357 186Q400 193 410 234L370 233 350 213Z" fill="rgb(225,168,85)"/><path d="M262 173 276 207M314 166 321 206M373 201 386 226" stroke="rgb(248,198,117)" stroke-width="9" stroke-linecap="round"/></g>`,
  fries: `<path d="M202 218 224 337Q300 362 376 337L398 218Z" fill="rgb(102,111,76)"/><g stroke="rgb(236,185,82)" stroke-width="18" stroke-linecap="round"><path d="m224 240-9-105M248 233l14-122M280 239l-4-126M309 240l8-141M340 237l15-117M369 239l17-99"/></g><path d="M202 218Q300 260 398 218L376 337Q300 362 224 337Z" fill="rgb(111,121,83)"/><circle cx="300" cy="294" r="28" fill="rgb(244,236,216)"/><text x="300" y="306" text-anchor="middle" font-family="Georgia,serif" font-size="37" fill="rgb(94,74,49)">v.</text>`,
  rice: `<ellipse cx="300" cy="208" rx="127" ry="66" fill="rgb(248,242,225)"/><path d="M173 208Q182 342 300 345Q418 342 427 208Q300 267 173 208Z" fill="rgb(226,218,196)"/><ellipse cx="300" cy="208" rx="119" ry="57" fill="rgb(246,240,213)"/><g fill="rgb(167,100,49)"><rect x="241" y="163" width="62" height="39" rx="13" transform="rotate(15 270 185)"/><rect x="309" y="181" width="62" height="39" rx="13" transform="rotate(-20 340 200)"/><rect x="257" y="209" width="62" height="39" rx="13" transform="rotate(-7 280 220)"/></g><g fill="rgb(114,142,72)"><ellipse cx="212" cy="200" rx="20" ry="12" transform="rotate(23 210 200)"/><ellipse cx="220" cy="219" rx="20" ry="12"/><ellipse cx="378" cy="207" rx="20" ry="12"/></g><g fill="rgb(245,217,150)"><circle cx="277" cy="180" r="3"/><circle cx="328" cy="202" r="3"/><circle cx="290" cy="228" r="3"/></g>`,
  platter: `<ellipse cx="300" cy="240" rx="163" ry="86" fill="rgb(249,243,226)"/><ellipse cx="300" cy="237" rx="144" ry="66" fill="rgb(235,226,204)"/><g stroke="rgb(233,181,79)" stroke-width="13" stroke-linecap="round"><path d="m182 220 54-31M191 239l56-33M198 258l52-36M211 269l50-39"/></g><g fill="rgb(168,91,60)"><rect x="284" y="185" width="85" height="20" rx="10" transform="rotate(17 300 190)"/><rect x="279" y="220" width="84" height="21" rx="10" transform="rotate(17 300 230)"/></g><path d="M312 253Q364 213 400 256Q405 286 352 292Z" fill="rgb(189,131,66)"/><circle cx="274" cy="271" r="23" fill="rgb(250,245,230)"/><circle cx="274" cy="271" r="16" fill="rgb(161,71,48)"/>`,
};
for (const [name, body] of Object.entries(foods))
  await sharp(Buffer.from(svg("rgb(235,225,204)", body)))
    .resize(480, 336)
    .png()
    .toFile(resolve(directory, `${name}.png`));
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="120" fill="rgb(76,55,41)"/><text x="255" y="338" text-anchor="middle" font-family="Georgia,serif" font-size="340" fill="rgb(242,232,211)">v.</text></svg>`;
await sharp(Buffer.from(icon)).png().toFile(resolve(directory, "icon.png"));
await writeFile(
  resolve(directory, "README.md"),
  "Original Vinty product illustrations generated from the SVG source in scripts/create-vinty-assets.mjs. These are illustrative demo menu assets, not photographs of the actual café menu.\n",
);
console.log("Created 12 original menu illustrations and the Vinty app icon.");
