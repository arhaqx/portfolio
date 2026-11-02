import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Original vector artwork, rasterized for React Native's native Image component.
const directory = resolve("apps/vinty-pos/assets");
await mkdir(directory, { recursive: true });
const brandSvg = await readFile(resolve(directory, "logo.svg"), "utf8");
const markSvg = await readFile(resolve(directory, "logo-mark.svg"), "utf8");
const brandBody = brandSvg
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(/<title>[\s\S]*?<\/title>/, "");
const decal =
  '<rect x="251" y="243" width="98" height="48" rx="6" fill="white" opacity=".95"/><svg x="257" y="248" width="86" height="35" viewBox="0 0 330 130" fill="rgb(255,145,77)">' +
  brandBody +
  "</svg>";
const drinks = {
  "kopi-susu": ["rgb(232,213,188)", "rgb(166,111,71)", "rgb(242,227,205)"],
  latte: ["rgb(232,217,200)", "rgb(179,125,85)", "rgb(245,230,208)"],
  americano: ["rgb(224,212,194)", "rgb(83,54,36)", "rgb(121,78,49)"],
  caramel: ["rgb(238,216,185)", "rgb(182,124,63)", "rgb(250,231,199)"],
  matcha: ["rgb(218,226,198)", "rgb(128,148,86)", "rgb(233,234,208)"],
  chocolate: ["rgb(223,206,193)", "rgb(106,70,51)", "rgb(189,151,120)"],
  lychee: ["rgb(225,228,197)", "rgb(176,148,80)", "rgb(242,233,183)"],
  strawberry: ["rgb(242,216,212)", "rgb(196,118,119)", "rgb(251,230,222)"],
  "butter-beer": ["rgb(249,228,193)", "rgb(197,143,59)", "rgb(239,204,124)"],
  peach: ["rgb(250,227,207)", "rgb(228,149,69)", "rgb(246,199,128)"],
  berry: ["rgb(244,215,221)", "rgb(151,60,87)", "rgb(211,110,131)"],
  "mango-matcha": ["rgb(231,237,200)", "rgb(132,153,86)", "rgb(244,190,70)"],
  "strawberry-matcha": ["rgb(237,222,214)", "rgb(132,153,86)", "rgb(224,145,151)"],
  taro: ["rgb(232,223,240)", "rgb(153,126,179)", "rgb(218,198,230)"],
  redvelvet: ["rgb(245,222,218)", "rgb(179,83,81)", "rgb(238,188,177)"],
};
const svg = (background, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420"><defs><radialGradient id="bg"><stop stop-color="white" stop-opacity=".5"/><stop offset="1" stop-color="${background}"/></radialGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="white" stop-opacity=".65"/><stop offset=".5" stop-color="white" stop-opacity=".04"/><stop offset="1" stop-color="white" stop-opacity=".32"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="10"/></filter></defs><rect width="600" height="420" fill="${background}"/><rect width="600" height="420" fill="url(#bg)"/><ellipse cx="308" cy="350" rx="115" ry="19" fill="rgb(75,49,34)" opacity=".13" filter="url(#shadow)"/>${body}</svg>`;
for (const [name, [bg, drink, milk]] of Object.entries(drinks)) {
  const body = `<path d="M328 57 305 197" stroke="rgb(99,71,49)" stroke-width="12" stroke-linecap="round"/><path d="M215 137H385L365 326Q360 348 300 348Q240 348 235 326Z" fill="${drink}"/><path d="M226 231Q301 210 374 235L365 326Q360 348 300 348Q240 348 235 326Z" fill="${milk}" opacity=".87"/><path d="M226 225Q285 244 374 216" fill="none" stroke="${drink}" stroke-width="22" opacity=".35"/><path d="M215 137H385L365 326Q360 348 300 348Q240 348 235 326Z" fill="url(#glass)" stroke="white" stroke-opacity=".75" stroke-width="3"/><ellipse cx="300" cy="137" rx="85" ry="20" fill="${drink}"/><g fill="white" opacity=".35"><rect x="241" y="145" width="36" height="28" rx="6" transform="rotate(12 250 150)"/><rect x="303" y="138" width="39" height="29" rx="6" transform="rotate(-15 320 155)"/><rect x="337" y="164" width="28" height="25" rx="5"/></g><ellipse cx="300" cy="135" rx="88" ry="21" fill="none" stroke="white" stroke-width="5" stroke-opacity=".8"/><path d="M236 166 249 314" stroke="white" stroke-width="7" stroke-linecap="round" opacity=".4"/>${decal}`;
  await sharp(Buffer.from(svg(bg, body)))
    .resize(480, 336)
    .png()
    .toFile(resolve(directory, `${name}.png`));
}
const foods = {
  croissant: `<ellipse cx="300" cy="259" rx="151" ry="65" fill="rgb(250,245,232)"/><ellipse cx="300" cy="257" rx="132" ry="49" fill="none" stroke="rgb(228,218,198)" stroke-width="3"/><g transform="rotate(-9 300 220)"><path d="M178 252Q167 178 243 176Q295 121 354 176Q424 184 423 249L367 237 350 214Q300 193 251 215L232 240Z" fill="rgb(186,115,49)"/><path d="M188 237Q189 192 242 188L252 213 231 240Z M247 181Q269 150 294 155L294 211 253 215Z M301 154Q330 151 351 179L345 213 301 207Z M357 186Q400 193 410 234L370 233 350 213Z" fill="rgb(225,168,85)"/><path d="M262 173 276 207M314 166 321 206M373 201 386 226" stroke="rgb(248,198,117)" stroke-width="9" stroke-linecap="round"/></g>`,
  fries: `<path d="M202 218 224 337Q300 362 376 337L398 218Z" fill="rgb(102,111,76)"/><g stroke="rgb(236,185,82)" stroke-width="18" stroke-linecap="round"><path d="m224 240-9-105M248 233l14-122M280 239l-4-126M309 240l8-141M340 237l15-117M369 239l17-99"/></g><path d="M202 218Q300 260 398 218L376 337Q300 362 224 337Z" fill="rgb(111,121,83)"/><svg x="265" y="273" width="70" height="32" viewBox="0 0 330 130" fill="white">${brandBody}</svg>`,
  rice: `<ellipse cx="300" cy="208" rx="127" ry="66" fill="rgb(248,242,225)"/><path d="M173 208Q182 342 300 345Q418 342 427 208Q300 267 173 208Z" fill="rgb(226,218,196)"/><ellipse cx="300" cy="208" rx="119" ry="57" fill="rgb(246,240,213)"/><g fill="rgb(167,100,49)"><rect x="241" y="163" width="62" height="39" rx="13" transform="rotate(15 270 185)"/><rect x="309" y="181" width="62" height="39" rx="13" transform="rotate(-20 340 200)"/><rect x="257" y="209" width="62" height="39" rx="13" transform="rotate(-7 280 220)"/></g><g fill="rgb(114,142,72)"><ellipse cx="212" cy="200" rx="20" ry="12" transform="rotate(23 210 200)"/><ellipse cx="220" cy="219" rx="20" ry="12"/><ellipse cx="378" cy="207" rx="20" ry="12"/></g><g fill="rgb(245,217,150)"><circle cx="277" cy="180" r="3"/><circle cx="328" cy="202" r="3"/><circle cx="290" cy="228" r="3"/></g>`,
  platter: `<ellipse cx="300" cy="240" rx="163" ry="86" fill="rgb(249,243,226)"/><ellipse cx="300" cy="237" rx="144" ry="66" fill="rgb(235,226,204)"/><g stroke="rgb(233,181,79)" stroke-width="13" stroke-linecap="round"><path d="m182 220 54-31M191 239l56-33M198 258l52-36M211 269l50-39"/></g><g fill="rgb(168,91,60)"><rect x="284" y="185" width="85" height="20" rx="10" transform="rotate(17 300 190)"/><rect x="279" y="220" width="84" height="21" rx="10" transform="rotate(17 300 230)"/></g><path d="M312 253Q364 213 400 256Q405 286 352 292Z" fill="rgb(189,131,66)"/><circle cx="274" cy="271" r="23" fill="rgb(250,245,230)"/><circle cx="274" cy="271" r="16" fill="rgb(161,71,48)"/>`,
};
for (const [name, body] of Object.entries(foods))
  await sharp(Buffer.from(svg("rgb(235,225,204)", body)))
    .resize(480, 336)
    .png()
    .toFile(resolve(directory, `${name}.png`));
const hot =
  '<ellipse cx="300" cy="331" rx="127" ry="23" fill="rgb(218,198,174)"/><path d="M368 174C445 158 450 280 372 282" stroke="rgb(252,246,235)" stroke-width="24" fill="none"/><path d="M210 162H383V281Q381 326 300 328Q217 323 214 281Z" fill="rgb(253,248,237)"/><ellipse cx="296" cy="163" rx="87" ry="24" fill="rgb(229,210,183)"/><ellipse cx="296" cy="165" rx="74" ry="17" fill="rgb(122,79,48)"/><path d="M271 113q-20-19 0-39M310 110q-18-20 0-39M347 110q-17-19 0-37" stroke="rgb(186,159,133)" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  decal;
await sharp(Buffer.from(svg("rgb(246,225,206)", hot)))
  .resize(480, 336)
  .png()
  .toFile(resolve(directory, "hot-cup.png"));
const plate =
  '<ellipse cx="300" cy="258" rx="157" ry="76" fill="rgb(251,247,236)"/><ellipse cx="300" cy="258" rx="134" ry="55" fill="none" stroke="rgb(225,213,192)" stroke-width="3"/>';
const extras = {
  "tahu-walik":
    '<g fill="rgb(218,161,76)" stroke="rgb(173,115,43)" stroke-width="3"><path d="M197 267 236 182 278 257Z"/><path d="M264 258 304 175 346 262Z"/><path d="M333 267 365 194 403 275Z"/></g>',
  dimsum:
    '<ellipse cx="300" cy="252" rx="118" ry="51" fill="rgb(191,144,88)"/><path d="M182 248v34q118 69 236 0v-34" fill="rgb(210,166,107)"/><g fill="rgb(243,218,157)" stroke="rgb(218,180,112)" stroke-width="3"><path d="M223 241 217 207 239 191 261 208 258 242Z"/><path d="M283 230 278 191 302 176 326 194 322 233Z"/><path d="M339 248 335 213 359 194 380 215 377 251Z"/></g><g fill="rgb(228,127,65)"><circle cx="240" cy="207" r="8"/><circle cx="302" cy="193" r="8"/><circle cx="358" cy="213" r="8"/></g>',
  piscok:
    '<g transform="rotate(-18 300 240)" fill="rgb(170,108,53)"><rect x="188" y="193" width="199" height="28" rx="13"/><rect x="195" y="228" width="199" height="28" rx="13"/><rect x="202" y="263" width="199" height="28" rx="13"/></g><g stroke="rgb(92,54,34)" stroke-width="7"><path d="m242 185 36 93M280 175l35 92M321 169l33 83"/></g>',
  chips:
    '<g fill="rgb(235,183,79)" stroke="rgb(205,148,53)" stroke-width="2"><ellipse cx="238" cy="238" rx="37" ry="19" transform="rotate(-32 238 238)"/><ellipse cx="303" cy="203" rx="39" ry="19" transform="rotate(10 303 203)"/><ellipse cx="355" cy="240" rx="38" ry="20" transform="rotate(35 355 240)"/><ellipse cx="287" cy="263" rx="38" ry="20" transform="rotate(-13 287 263)"/><ellipse cx="330" cy="285" rx="32" ry="15"/></g>',
  katsu:
    '<ellipse cx="300" cy="233" rx="125" ry="60" fill="rgb(246,238,212)"/><g fill="rgb(206,145,62)" stroke="rgb(174,109,35)" stroke-width="3" transform="rotate(-18 300 230)"><rect x="215" y="190" width="30" height="89" rx="9"/><rect x="250" y="181" width="30" height="104" rx="9"/><rect x="285" y="178" width="30" height="109" rx="9"/><rect x="320" y="183" width="30" height="101" rx="9"/><rect x="355" y="198" width="29" height="78" rx="9"/></g>',
  beef: '<ellipse cx="300" cy="238" rx="125" ry="60" fill="rgb(246,238,212)"/><g fill="rgb(127,77,46)"><path d="m219 231 22-37 59 5 20 24-30 22Z"/><path d="m290 244 35-39 62 11 3 31-50 30Z"/><path d="m234 268 42-29 51 15-11 34-55 3Z"/></g><g fill="rgb(112,145,63)"><ellipse cx="215" cy="263" rx="21" ry="12"/><ellipse cx="378" cy="260" rx="21" ry="12"/></g>',
};
for (const [name, body] of Object.entries(extras))
  await sharp(Buffer.from(svg("rgb(246,230,208)", plate + body)))
    .resize(480, 336)
    .png()
    .toFile(resolve(directory, name + ".png"));
await sharp(Buffer.from(brandSvg)).resize(660, 260).png().toFile(resolve(directory, "logo.png"));
await sharp(Buffer.from(markSvg))
  .resize(316, 264)
  .png()
  .toFile(resolve(directory, "logo-mark.png"));
const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="110" fill="rgb(255,145,77)"/><g transform="translate(-506 70) scale(3)" fill="white">' +
  markSvg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<title>[\s\S]*?<\/title>/, "") +
  "</g></svg>";
await sharp(Buffer.from(icon)).png().toFile(resolve(directory, "icon.png"));
await writeFile(
  resolve(directory, "README.md"),
  "Vinty logo: SVG outlines reproduce the original wordmark lettering, spacing, orange colour and house mark from the supplied Vinty identity. Product artwork is original illustrative artwork, not product photographs. Menu names and prices follow the supplied Vinty menu.\n",
);
await writeFile(
  resolve("apps/vinty-pos/src/brand.ts"),
  "// Vinty wordmark and house mark, matching the supplied identity.\nexport const logoSvg = " +
    JSON.stringify(brandSvg) +
    ";\n",
);
console.log("Generated Vinty brand assets and menu illustrations.");
