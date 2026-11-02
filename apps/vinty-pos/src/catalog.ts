import type { Product } from "./model";

// Transcribed from the Vinty menu supplied by the user. Prices are whole rupiah.
// H/C = Hot/Cold; the paired Classic Coffee prices mean Robusta/Arabica.
export const CATALOG_VERSION = 2;
export const MENU_SOURCE = "https://menuvinty.my.canva.site/";
export const LEGACY_SEED_IDS = new Set([
  "kopi-susu",
  "latte",
  "americano",
  "caramel",
  "matcha",
  "chocolate",
  "lychee",
  "strawberry",
  "croissant",
  "fries",
  "rice",
  "platter",
]);

function menu(
  id: string,
  name: string,
  category: Product["category"],
  price: number,
  art: string,
  description = "",
  stock = 20,
): Product {
  return {
    id,
    name,
    category,
    price,
    art,
    description,
    stock,
    active: true,
    featured: id === "kopi-susu",
  };
}

function temperatures(
  id: string,
  name: string,
  category: Product["category"],
  price: number,
  art: string,
  stock = 20,
): Product[] {
  return [
    menu(id, `${name} · Cold`, category, price, art, "Cold · Sesuai menu Vinty", stock),
    menu(
      `${id}-hot`,
      `${name} · Hot`,
      category,
      price,
      "hot-cup",
      "Hot · Sesuai menu Vinty",
      stock,
    ),
  ];
}

export const VINTY_CATALOG: Product[] = [
  menu(
    "kopi-susu",
    "Kopsu Vinty",
    "Flavoured Coffee",
    16000,
    "kopi-susu",
    "Cold · Signature Vinty",
    40,
  ),
  ...temperatures("americano", "Americano Robusta", "Classic Coffee", 15000, "americano", 35),
  ...temperatures(
    "americano-arabica",
    "Americano Arabica",
    "Classic Coffee",
    17000,
    "americano",
    35,
  ),
  ...temperatures("latte", "Caffe Latte Robusta", "Classic Coffee", 20000, "latte", 30),
  ...temperatures("latte-arabica", "Caffe Latte Arabica", "Classic Coffee", 22000, "latte", 30),
  menu("kopsu-aren", "Kopsu Aren", "Flavoured Coffee", 18000, "kopi-susu", "Cold"),
  menu("butterscotch", "Butterscotch", "Flavoured Coffee", 18000, "caramel", "Cold"),
  menu("caramel", "Ice Caramel", "Flavoured Coffee", 18000, "caramel", "Cold", 25),
  menu("pistachio", "Pistachio", "Flavoured Coffee", 18000, "kopi-susu", "Cold"),
  menu("hazelnut", "Hazelnut", "Flavoured Coffee", 18000, "kopi-susu", "Cold"),
  menu("kopsu-vanila", "Kopsu Vanila", "Flavoured Coffee", 18000, "latte", "Cold"),
  menu("butter-beer", "Butter Beer", "Mocktail", 20000, "butter-beer", "Cold · Mocktail"),
  menu("peach-punch", "Peach Punch", "Mocktail", 20000, "peach", "Cold · Mocktail"),
  menu("crancano-berry", "Crancano Berry", "Mocktail", 20000, "berry", "Cold · Mocktail"),
  menu("pistachio-matcha", "Pistachio Matcha", "Milk Based", 20000, "matcha", "Cold"),
  menu("mango-matcha", "Mango Matcha", "Milk Based", 20000, "mango-matcha", "Cold"),
  ...temperatures("matcha", "Matcha Latte", "Milk Based", 20000, "matcha"),
  menu("strawberry", "Strawberry Matcha", "Milk Based", 20000, "strawberry-matcha", "Cold", 18),
  ...temperatures("chocolate", "Choco", "Milk Based", 18000, "chocolate"),
  ...temperatures("taro", "Taro", "Milk Based", 18000, "taro"),
  ...temperatures("redvelvet", "Redvelvet", "Milk Based", 18000, "redvelvet"),
  menu("platter", "Mix Plate", "Snack & Bites", 20000, "platter", "Snack & Bites", 10),
  menu("fries", "French Fries", "Snack & Bites", 16000, "fries", "Snack & Bites", 15),
  menu("tahu-walik", "Tahu Walik", "Snack & Bites", 16000, "tahu-walik", "Snack & Bites"),
  menu("dimsum", "Dimsum", "Snack & Bites", 18000, "dimsum", "Snack & Bites"),
  menu("piscok", "Piscok", "Snack & Bites", 16000, "piscok", "Snack & Bites"),
  menu("chipy-chips", "Chipy Chips", "Snack & Bites", 12000, "chips", "Snack & Bites"),
  menu("strawberry-tea", "Strawberry Tea", "Tea Series", 15000, "strawberry", "Tea Series"),
  menu("lychee", "Lychee Tea", "Tea Series", 15000, "lychee", "Tea Series", 25),
  menu("mango-tea", "Mango Tea", "Tea Series", 15000, "peach", "Tea Series"),
  menu("original-tea", "Original Tea", "Tea Series", 12000, "lychee", "Tea Series"),
  menu("rice", "Chicken Garlic Butter", "All Day", 24000, "rice", "All Day", 14),
  menu("katsu-bbq", "Katsu Bbq", "All Day", 24000, "katsu", "All Day"),
  menu("katsu-mentai", "Katsu Mentai", "All Day", 26000, "katsu", "All Day"),
  menu("katsu-cabai-merah", "Katsu Cabai Merah", "All Day", 24000, "katsu", "All Day"),
  menu("beef-teriyaki", "Ricebowl Beef Teriyaki", "All Day", 27000, "beef", "All Day"),
];
