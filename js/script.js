/* =========================================================
   RavegLtd — interactions
   ========================================================= */
(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Catalogue data ---------- */
  const YR = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const M = (...mm) => { const a = Array(12).fill(0); mm.forEach((x) => (a[x - 1] = 1)); return a; };
  const MONTH = new Date().getMonth(); // 0–11
  const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const MONTHS_FULL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const CAT_LABEL = { fruits: "Fruits", vegetables: "Vegetables", exotics: "Exotics", herbs: "Herbs & Aromatics" };
  const CAT_SHORT = { fruits: "Fruit", vegetables: "Vegetable", exotics: "Exotic", herbs: "Herb" };
  const STATUS = {
    in:       { label: "In stock",   cls: "in" },
    low:      { label: "Limited",    cls: "low" },
    year:     { label: "Year-round", cls: "year" },
    seasonal: { label: "Seasonal",   cls: "seasonal" },
  };

  // Client-supplied photos in assets/products/{cat}/  (slug: 'filename.ext'). Used in preference to stock.
  const LOCAL_IMAGES = {
    apples: "apples.jpeg", bananas: "bananas.jpeg", oranges: "oranges.jpeg",
    strawberries: "strawberries.jpeg", papaya: "papaya.jpeg", watermelon: "watermelon.jpeg",
    mango: "mango.jpeg", plantain: "plantain.webp", guava: "guava.jpeg", jackfruit: "jackfruit.jpeg",
  };

  // img = TheMealDB ingredient token (real cutout photo); kw/lock = loremflickr keyword fallback for items without a cutout.
  const PRODUCTS = [
    // ---- FRUITS ----
    { name: "Apples", slug: "apples", cat: "fruits", img: "Apple", sku: "FRT-001", variety: "Gala & Braeburn", origin: "Kent, UK", pack: "Box · 80–100ct", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 1–4°C · 21 days", note: "British-grown, kept fresh in controlled-atmosphere storage from harvest." },
    { name: "Bananas", slug: "bananas", cat: "fruits", img: "Banana", sku: "FRT-002", variety: "Cavendish", origin: "Costa Rica / Colombia", pack: "Box · 18kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Ambient 13–15°C", note: "Ripened to order in our own ripening chambers for next-day delivery." },
    { name: "Oranges", slug: "oranges", cat: "fruits", img: "Orange", sku: "FRT-003", variety: "Navel & Valencia", origin: "Spain / Egypt", pack: "Box · 15kg", unit: "per box", grade: "Class I", moq: "1 box", season: M(11, 12, 1, 2, 3, 4), status: "in", storage: "Chilled 3–8°C", note: "Sweet, easy-peel navels through winter; Valencia juicing oranges in spring." },
    { name: "Strawberries", slug: "strawberries", cat: "fruits", img: "Strawberries", sku: "FRT-004", variety: "Driscoll's", origin: "Kent, UK", pack: "Punnet 400g × 10", unit: "per case", grade: "Class I", moq: "1 case", season: M(5, 6, 7, 8, 9), status: "seasonal", storage: "Chilled 2–4°C · 3 days", note: "Peak British season — picked and packed daily for maximum shelf life." },
    { name: "Lemons", slug: "lemons", cat: "fruits", img: "Lemon", sku: "FRT-005", variety: "Primofiori", origin: "Spain", pack: "Box · 10kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 8–10°C", note: "Thin-skinned, high-juice lemons graded by count." },
    { name: "Limes", slug: "limes", cat: "fruits", img: "Lime", sku: "FRT-006", variety: "Persian", origin: "Brazil / Mexico", pack: "Box · 4.5kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 9–10°C", note: "Seedless Persian limes with consistent dark-green skin." },
    { name: "Pineapples", slug: "pineapples", cat: "fruits", img: "Pineapple", sku: "FRT-007", variety: "MD2 Extra Sweet", origin: "Costa Rica", pack: "Box · 8–12ct", unit: "per box", grade: "Extra", moq: "1 box", season: YR, status: "in", storage: "Ambient / chilled", note: "Extra-sweet MD2 with golden flesh and low acidity." },
    { name: "Blueberries", slug: "blueberries", cat: "fruits", img: "Blueberries", sku: "FRT-008", variety: "Duke & Bluecrop", origin: "Peru / Spain", pack: "Punnet 125g × 12", unit: "per case", grade: "Class I", moq: "1 case", season: YR, status: "in", organic: true, storage: "Chilled 2–4°C", note: "Firm, large-calibre berries available year-round across hemispheres." },
    { name: "Raspberries", slug: "raspberries", cat: "fruits", img: "Raspberries", sku: "FRT-009", variety: "Driscoll's", origin: "UK / Portugal", pack: "Punnet 150g × 12", unit: "per case", grade: "Class I", moq: "1 case", season: M(6, 7, 8, 9, 10), status: "low", storage: "Chilled 2–4°C · 2 days", note: "Delicate fruit — handled cold-chain throughout." },
    { name: "Kiwi", slug: "kiwi", cat: "fruits", img: "Kiwi", sku: "FRT-010", variety: "Hayward green", origin: "Italy / New Zealand", pack: "Tray · 30ct", unit: "per tray", grade: "Class I", moq: "1 tray", season: YR, status: "in", storage: "Chilled 0–4°C", note: "Ready-to-eat and firm options available to spec." },
    { name: "Avocados", slug: "avocados", cat: "fruits", img: "Avocado", sku: "FRT-011", variety: "Hass", origin: "Peru / Spain", pack: "Box · 16–20ct", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", organic: true, storage: "Chilled 5–7°C", note: "Ripe-and-ready or hard-ripe programmes to match your turnover." },
    { name: "Pomegranates", slug: "pomegranates", cat: "fruits", img: "Pomegranate", sku: "FRT-012", variety: "Wonderful", origin: "Spain / India", pack: "Box · 12ct", unit: "per box", grade: "Class I", moq: "1 box", season: M(9, 10, 11, 12, 1, 2), status: "seasonal", storage: "Chilled 5–7°C", note: "Deep-red arils, high brix — the Wonderful variety." },
    { name: "Papaya", slug: "papaya", cat: "fruits", img: "Papaya", sku: "FRT-013", variety: "Formosa", origin: "Brazil", pack: "Box · 6–9ct", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Ambient / chilled", note: "Large Formosa papaya, ripened for foodservice." },
    { name: "Apricots", slug: "apricots", cat: "fruits", img: "Apricot", sku: "FRT-014", variety: "Bergeron", origin: "Spain / France", pack: "Box · 5kg", unit: "per box", grade: "Class I", moq: "1 box", season: M(5, 6, 7, 8), status: "low", storage: "Chilled 2–4°C", note: "Aromatic stone fruit at the height of summer." },
    { name: "Watermelon", slug: "watermelon", cat: "fruits", kw: "watermelon", lock: 31, sku: "FRT-015", variety: "Seedless", origin: "Spain / Brazil", pack: "Box · 3–5ct", unit: "per box", grade: "Class I", moq: "1 box", season: M(6, 7, 8, 9), status: "seasonal", storage: "Chilled 8–10°C", note: "Sweet, crisp seedless watermelon at its summer peak." },

    // ---- VEGETABLES ----
    { name: "Tomatoes", slug: "tomatoes", cat: "vegetables", img: "Tomato", sku: "VEG-001", variety: "Vine-ripened", origin: "UK / Netherlands", pack: "Box · 6kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Ambient 12–15°C", note: "Vine, plum and cherry available — all grown under glass." },
    { name: "Potatoes", slug: "potatoes", cat: "vegetables", img: "Potatoes", sku: "VEG-002", variety: "Maris Piper", origin: "UK", pack: "Sack · 25kg", unit: "per sack", grade: "Class I", moq: "1 sack", season: YR, status: "in", storage: "Cool, dark, ambient", note: "All-rounder Maris Piper; whites and reds also stocked." },
    { name: "Onions", slug: "onions", cat: "vegetables", img: "Onion", sku: "VEG-003", variety: "Brown", origin: "UK / Netherlands", pack: "Sack · 25kg", unit: "per sack", grade: "Class I", moq: "1 sack", season: YR, status: "in", storage: "Cool, dry, ambient", note: "Firm brown onions graded by size." },
    { name: "Red Onions", slug: "red-onions", cat: "vegetables", img: "Red Onion", sku: "VEG-004", variety: "Red", origin: "UK / Netherlands", pack: "Sack · 10kg", unit: "per sack", grade: "Class I", moq: "1 sack", season: YR, status: "in", storage: "Cool, dry, ambient", note: "Mild, sweet red onions for salads and service." },
    { name: "Carrots", slug: "carrots", cat: "vegetables", img: "Carrots", sku: "VEG-005", variety: "Nantes", origin: "UK", pack: "Sack · 20kg", unit: "per sack", grade: "Class I", moq: "1 sack", season: YR, status: "in", organic: true, storage: "Chilled 0–4°C", note: "Washed and graded; jumbo and batons to order." },
    { name: "Broccoli", slug: "broccoli", cat: "vegetables", img: "Broccoli", sku: "VEG-006", variety: "Calabrese", origin: "UK / Spain", pack: "Box · 10ct", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 0–4°C", note: "Tight, dark-green heads with short stalk." },
    { name: "Red Peppers", slug: "red-peppers", cat: "vegetables", img: "Red Pepper", sku: "VEG-007", variety: "Capsicum", origin: "Netherlands / Spain", pack: "Box · 5kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 7–10°C", note: "Mixed traffic-light cases also available." },
    { name: "Cucumber", slug: "cucumber", cat: "vegetables", img: "Cucumber", sku: "VEG-008", variety: "Telegraph", origin: "UK / Netherlands", pack: "Box · 12ct", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 10–12°C", note: "Long, straight telegraph cucumbers." },
    { name: "Courgettes", slug: "courgettes", cat: "vegetables", img: "Courgette", sku: "VEG-009", variety: "Green", origin: "Spain / UK", pack: "Box · 5kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Zucchini"], storage: "Chilled 7–10°C", note: "Firm, glossy courgettes graded by length." },
    { name: "Aubergine", slug: "aubergine", cat: "vegetables", img: "Aubergine", sku: "VEG-010", variety: "Classic", origin: "Spain / Netherlands", pack: "Box · 5kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Eggplant", "Brinjal", "Baingan"], storage: "Chilled 8–10°C", note: "Deep-purple, glossy fruit with firm flesh." },
    { name: "Spinach", slug: "spinach", cat: "vegetables", img: "Spinach", sku: "VEG-011", variety: "Baby leaf", origin: "UK / Italy", pack: "Case · 1.5kg", unit: "per case", grade: "Class I", moq: "1 case", season: YR, status: "in", organic: true, storage: "Chilled 2–4°C", note: "Triple-washed baby leaf, ready to use." },
    { name: "Mushrooms", slug: "mushrooms", cat: "vegetables", img: "Mushrooms", sku: "VEG-012", variety: "Chestnut & button", origin: "UK / Ireland", pack: "Box · 3kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 1–4°C", note: "Closed-cup, chestnut and flat caps to order." },
    { name: "Sweetcorn", slug: "sweetcorn", cat: "vegetables", img: "Sweetcorn", sku: "VEG-013", variety: "Supersweet", origin: "UK / Spain", pack: "Box · 12ct", unit: "per box", grade: "Class I", moq: "1 box", season: M(7, 8, 9, 10), status: "low", storage: "Chilled 0–4°C", note: "Cobs in husk; peak British supply late summer." },
    { name: "Green Beans", slug: "green-beans", cat: "vegetables", img: "Green Beans", sku: "VEG-014", variety: "Fine beans", origin: "Kenya / Egypt", pack: "Case · 4kg", unit: "per case", grade: "Class I", moq: "1 case", season: YR, status: "in", storage: "Chilled 4–7°C", note: "Topped-and-tailed fine beans available to spec." },

    // ---- EXOTICS ----
    { name: "Mango", slug: "mango", cat: "exotics", img: "Mango", sku: "EXO-001", variety: "Alphonso & Kesar", origin: "India / Pakistan", pack: "Box · 6–10ct", unit: "per box", grade: "Premium", moq: "1 box", season: M(4, 5, 6, 7), status: "seasonal", storage: "Ambient, ripen to order", note: "Flagship Indian season — Alphonso and Kesar in limited allocation." },
    { name: "Plantain", slug: "plantain", cat: "exotics", kw: "plantain", lock: 21, sku: "EXO-002", variety: "Green & ripe", origin: "Ghana / Colombia", pack: "Box · 22kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Ambient 13–15°C", note: "Both green (cooking) and yellow (ripe) supplied year-round." },
    { name: "Okra", slug: "okra", cat: "exotics", kw: "okra,vegetable", lock: 22, sku: "EXO-003", variety: "Lady's finger", origin: "India / Kenya", pack: "Case · 5kg", unit: "per case", grade: "Class I", moq: "1 case", season: YR, status: "in", aliases: ["Bhindi", "Lady finger"], storage: "Chilled 7–10°C", note: "Tender, bright-green pods graded for size." },
    { name: "Cassava", slug: "cassava", cat: "exotics", kw: "cassava,root", lock: 23, sku: "EXO-004", variety: "Fresh root", origin: "Costa Rica", pack: "Box · 18kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Yuca", "Manioc"], storage: "Cool, dry, ambient", note: "Waxed fresh cassava root with long shelf life." },
    { name: "Yam", slug: "yam", cat: "exotics", kw: "yam,tuber", lock: 24, sku: "EXO-005", variety: "Puna white", origin: "Ghana", pack: "Box · 15kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Cool, dry, ambient", note: "Authentic West-African white yam." },
    { name: "Dragon Fruit", slug: "dragon-fruit", cat: "exotics", kw: "dragonfruit,pitaya", lock: 25, sku: "EXO-006", variety: "Pink pitaya", origin: "Vietnam", pack: "Box · 8–10ct", unit: "per box", grade: "Extra", moq: "1 box", season: YR, status: "low", aliases: ["Pitaya"], storage: "Chilled 7–10°C", note: "Striking pink-skin pitaya for retail display." },
    { name: "Passion Fruit", slug: "passion-fruit", cat: "exotics", kw: "passionfruit", lock: 26, sku: "EXO-007", variety: "Purple", origin: "Colombia", pack: "Box · 2kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 7–10°C", note: "Aromatic, wrinkle-when-ripe purple passion fruit." },
    { name: "Lychee", slug: "lychee", cat: "exotics", kw: "lychee,fruit", lock: 27, sku: "EXO-008", variety: "Fresh", origin: "Madagascar / India", pack: "Box · 2kg", unit: "per box", grade: "Class I", moq: "1 box", season: M(11, 12, 1, 2, 5, 6), status: "seasonal", storage: "Chilled 2–5°C", note: "Floral, sweet lychee in branch and loose packs." },
    { name: "Scotch Bonnet", slug: "scotch-bonnet", cat: "exotics", img: "Scotch Bonnet", sku: "EXO-009", variety: "Hot pepper", origin: "Jamaica / Uganda", pack: "Case · 3kg", unit: "per case", grade: "Class I", moq: "1 case", season: YR, status: "in", aliases: ["Scotch bonnet chilli", "Bonney pepper"], storage: "Chilled 7–10°C", note: "Fiery, fruity Caribbean staple — mixed colours." },
    { name: "Ginger", slug: "ginger", cat: "exotics", img: "Ginger", sku: "EXO-010", variety: "Fresh root", origin: "China / Peru", pack: "Box · 10kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Adrak"], storage: "Cool, dry, ambient", note: "Plump, low-fibre root ginger." },
    { name: "Sweet Potato", slug: "sweet-potato", cat: "exotics", img: "Sweet Potatoes", sku: "EXO-011", variety: "Orange flesh", origin: "USA / Egypt", pack: "Box · 6kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Kumara"], storage: "Cool, dry, ambient", note: "Sweet orange-flesh variety; graded by size." },
    { name: "Pak Choi", slug: "pak-choi", cat: "exotics", img: "Pak Choi", sku: "EXO-012", variety: "Baby", origin: "UK / Netherlands", pack: "Case · 5kg", unit: "per case", grade: "Class I", moq: "1 case", season: YR, status: "in", aliases: ["Bok choy", "Pak choy"], storage: "Chilled 2–4°C", note: "Crisp baby pak choi for stir-fry and service." },
    { name: "Guava", slug: "guava", cat: "exotics", kw: "guava,fruit", lock: 32, sku: "EXO-013", variety: "Pink & white", origin: "India / Egypt", pack: "Box · 4kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Amrood"], storage: "Chilled 8–10°C", note: "Fragrant tropical guava, pink and white flesh." },
    { name: "Jackfruit", slug: "jackfruit", cat: "exotics", kw: "jackfruit", lock: 33, sku: "EXO-014", variety: "Whole & cut", origin: "India / Vietnam", pack: "Per piece", unit: "per piece", grade: "Class I", moq: "1 piece", season: YR, status: "low", aliases: ["Kathal"], storage: "Ambient / chilled", note: "Large tropical jackfruit — whole or pre-cut to order." },

    // ---- HERBS & AROMATICS ----
    { name: "Coriander", slug: "coriander", cat: "herbs", img: "Coriander", sku: "HRB-001", variety: "Fresh bunch", origin: "UK / Italy", pack: "Box · 10 bunch", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Cilantro", "Dhania"], storage: "Chilled 2–4°C", note: "Fragrant, full-leaf bunches." },
    { name: "Mint", slug: "mint", cat: "herbs", img: "Mint", sku: "HRB-002", variety: "Spearmint", origin: "UK / Morocco", pack: "Box · 10 bunch", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 2–4°C", note: "Aromatic spearmint, large bunches." },
    { name: "Basil", slug: "basil", cat: "herbs", img: "Basil", sku: "HRB-003", variety: "Genovese", origin: "Italy / UK", pack: "Box · 12 pot", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Ambient 12–15°C", note: "Living pots and cut bunches available." },
    { name: "Parsley", slug: "parsley", cat: "herbs", img: "Parsley", sku: "HRB-004", variety: "Flat-leaf", origin: "UK / Italy", pack: "Box · 10 bunch", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Italian parsley"], storage: "Chilled 2–4°C", note: "Flat-leaf and curled both stocked." },
    { name: "Dill", slug: "dill", cat: "herbs", img: "Dill", sku: "HRB-005", variety: "Fresh", origin: "UK / Netherlands", pack: "Box · 10 bunch", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 2–4°C", note: "Feathery, aromatic dill bunches." },
    { name: "Thyme", slug: "thyme", cat: "herbs", img: "Thyme", sku: "HRB-006", variety: "Fresh", origin: "UK / Spain", pack: "Box · 500g", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 2–4°C", note: "Woody, fragrant thyme sprigs." },
    { name: "Rosemary", slug: "rosemary", cat: "herbs", img: "Rosemary", sku: "HRB-007", variety: "Fresh", origin: "UK / Spain", pack: "Box · 500g", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", storage: "Chilled 2–4°C", note: "Long, fragrant rosemary stems." },
    { name: "Garlic", slug: "garlic", cat: "herbs", img: "Garlic", sku: "HRB-008", variety: "White", origin: "Spain / China", pack: "Box · 5kg", unit: "per box", grade: "Class I", moq: "1 box", season: YR, status: "in", aliases: ["Lehsun"], storage: "Cool, dry, ambient", note: "Firm white bulbs; peeled cloves to order." },
  ];

  const BY_SLUG = {};
  PRODUCTS.forEach((p) => (BY_SLUG[p.slug] = p));

  /* ---------- Image helpers (local → TheMealDB cutout → loremflickr → monogram) ---------- */
  function candidates(p) {
    const out = [];
    if (LOCAL_IMAGES[p.slug]) out.push({ url: "assets/products/" + p.cat + "/" + LOCAL_IMAGES[p.slug], fit: "cover" });
    if (p.img) out.push({ url: "https://www.themealdb.com/images/ingredients/" + encodeURIComponent(p.img) + ".png", fit: "contain" });
    if (p.kw) out.push({ url: "https://loremflickr.com/600/600/" + encodeURIComponent(p.kw) + "?lock=" + (p.lock || 1), fit: "cover" });
    return out;
  }
  function wirePlate(plate, p) {
    const img = plate.querySelector(".pcard__img");
    if (!img) return;
    const cands = candidates(p);
    let i = 0;
    const next = () => {
      if (i >= cands.length) { plate.classList.add("is-mono"); plate.classList.add("is-loaded"); return; }
      const c = cands[i++];
      plate.dataset.fit = c.fit;
      img.src = c.url;
    };
    img.addEventListener("error", next);
    img.addEventListener("load", () => plate.classList.add("is-loaded"));
    next();
    if (img.complete && img.naturalWidth === 0) next();
  }

  /* ---------- State ---------- */
  const state = { cat: "all", q: "", inSeason: false, sort: "featured", view: "grid", limit: 16 };
  const STEP = 16;
  let quote = readLS("raveg:quote", {});
  state.view = readLS("raveg:view", "grid") === "list" ? "list" : "grid";

  function readLS(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } }
  function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

  /* ---------- DOM refs ---------- */
  const grid = $("#productGrid");
  if (!grid) return; // products section not on page

  const elSearch = $("#catalogSearch"), elSearchClear = $("#searchClear");
  const elTabs = $$(".cat-tab"), elSort = $("#catalogSort"), elSeason = $("#seasonToggle");
  const elViewBtns = $$(".view-btn"), elToolbar = $("#catalogToolbar");
  const elCount = $("#catalogCount"), elChips = $("#catalogChips"), elClearAll = $("#clearAll");
  const elEmpty = $("#catalogEmpty"), elMore = $("#catalogMore"), elLoadMore = $("#loadMore");
  const elMeta = $("#catalogMeta");

  /* ---------- Category counts ---------- */
  const counts = { all: PRODUCTS.length, fruits: 0, vegetables: 0, exotics: 0, herbs: 0 };
  PRODUCTS.forEach((p) => counts[p.cat]++);
  $$("[data-count-for]").forEach((el) => (el.textContent = counts[el.dataset.countFor]));
  if (elMeta) elMeta.textContent = "Market-fresh produce · 4 categories";

  /* ---------- Filter + sort ---------- */
  function getFiltered() {
    const q = state.q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (state.inSeason && !p.season[MONTH]) return false;
      if (q) {
        const hay = [p.name, p.variety, p.origin, CAT_LABEL[p.cat], ...(p.aliases || [])].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const s = state.sort;
    if (s === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (s === "origin") list.sort((a, b) => a.origin.localeCompare(b.origin) || a.name.localeCompare(b.name));
    else if (s === "category") list.sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
    else if (s === "season") list.sort((a, b) => (b.season[MONTH] - a.season[MONTH]) || a.name.localeCompare(b.name));
    return list;
  }

  /* ---------- HTML builders ---------- */
  function seasonBar(p) {
    return '<div class="seasonbar" aria-hidden="true">' +
      p.season.map((on, i) => '<span class="' + (on ? "on" : "") + (i === MONTH ? " now" : "") + '"></span>').join("") +
      "</div>";
  }
  // Grid card: show a clear "Year-round" caption for always-available lines, a labelled bar for seasonal ones.
  function availBlock(p) {
    if (p.season.every((v) => v === 1)) {
      return '<p class="pcard__avail"><span>Availability</span><b>Year-round</b></p>';
    }
    const label = "In season: " + p.season.map((on, i) => (on ? MONTHS_FULL[i] : null)).filter(Boolean).join(", ");
    return '<div class="pcard__avail-block"><span class="pcard__avail-cap">Seasonality (now: ' + MONTHS_FULL[MONTH] + ")</span>" +
      '<div class="seasonbar" role="img" aria-label="' + esc(label) + '">' +
      p.season.map((on, i) => '<span class="' + (on ? "on" : "") + (i === MONTH ? " now" : "") + '"></span>').join("") +
      "</div></div>";
  }
  const PIN = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/></svg>';

  function plateHTML(p, mono) {
    const st = STATUS[p.status] || STATUS.in;
    return '<div class="pcard__plate" data-fit="contain">' +
      '<span class="pcard__cat"><i></i>' + esc(CAT_SHORT[p.cat]) + "</span>" +
      '<span class="pcard__status status--' + st.cls + '"><i></i>' + st.label + "</span>" +
      '<img class="pcard__img" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' +
      '<span class="pcard__mono" aria-hidden="true">' + esc(p.name[0]) + "</span>" +
      "</div>";
  }

  function cardHTML(p) {
    const sel = !!quote[p.slug];
    return '<article class="pcard' + (sel ? " is-selected" : "") + '" data-slug="' + p.slug + '">' +
      plateHTML(p) +
      '<div class="pcard__body">' +
        '<div class="pcard__head"><h3 class="pcard__name"><button class="pcard__open" type="button" data-act="quick" data-slug="' + p.slug + '">' + esc(p.name) + "</button></h3>" + (p.organic ? '<span class="pcard__organic">Organic</span>' : "") + "</div>" +
        '<p class="pcard__variety">' + esc(p.variety) + "</p>" +
        '<p class="pcard__origin">' + PIN + esc(p.origin) + "</p>" +
        '<div class="pcard__specs">' +
          "<div><span>Pack</span><b>" + esc(p.pack) + "</b></div>" +
          "<div><span>Unit</span><b>" + esc(p.unit) + "</b></div>" +
          "<div><span>Grade</span><b>" + esc(p.grade) + "</b></div>" +
          "<div><span>MOQ</span><b>" + esc(p.moq) + "</b></div>" +
        "</div>" +
        availBlock(p) +
        '<div class="pcard__actions">' +
          '<button class="btn-enquire' + (sel ? " is-added" : "") + '" type="button" data-act="enquire" data-slug="' + p.slug + '">' + (sel ? "Added ✓" : "Add to enquiry") + "</button>" +
          '<button class="btn-quick" type="button" data-act="quick" data-slug="' + p.slug + '">Quick view</button>' +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function listHeadHTML() {
    return '<div class="prow--head" aria-hidden="true">' +
      '<span class="pcol pcol--thumb"></span>' +
      '<span class="pcol pcol--name">Product</span>' +
      '<span class="pcol pcol--origin">Origin</span>' +
      '<span class="pcol pcol--pack">Pack</span>' +
      '<span class="pcol pcol--unit">Unit</span>' +
      '<span class="pcol pcol--grade">Grade</span>' +
      '<span class="pcol pcol--avail">Availability</span>' +
      '<span class="pcol pcol--season">Season</span>' +
      '<span class="pcol pcol--act"></span>' +
    "</div>";
  }
  function rowHTML(p) {
    const sel = !!quote[p.slug];
    const st = STATUS[p.status] || STATUS.in;
    return '<div class="prow' + (sel ? " is-selected" : "") + '" data-slug="' + p.slug + '">' +
      '<div class="prow__thumb">' + plateHTML(p) + "</div>" +
      '<div class="prow__name"><button class="prow__open" type="button" data-act="quick" data-slug="' + p.slug + '">' + esc(p.name) + "</button><span>" + esc(p.variety) + "</span></div>" +
      '<div class="prow__cell prow__cell--origin" data-label="Origin">' + esc(p.origin) + "</div>" +
      '<div class="prow__cell prow__cell--pack" data-label="Pack">' + esc(p.pack) + "</div>" +
      '<div class="prow__cell prow__cell--unit" data-label="Unit">' + esc(p.unit) + "</div>" +
      '<div class="prow__cell prow__cell--grade" data-label="Grade">' + esc(p.grade) + "</div>" +
      '<div class="prow__cell prow__cell--avail" data-label="Availability"><span class="chip-status status--' + st.cls + '"><i></i>' + st.label + "</span></div>" +
      '<div class="prow__cell prow__season" data-label="Season">' + seasonBar(p) + "</div>" +
      '<div class="prow__act">' +
        '<button class="btn-enquire' + (sel ? " is-added" : "") + '" type="button" data-act="enquire" data-slug="' + p.slug + '">' + (sel ? "✓ Added" : "Add") + "</button>" +
        '<button class="btn-quick" type="button" data-act="quick" data-slug="' + p.slug + '">View</button>' +
      "</div>" +
    "</div>";
  }

  /* ---------- Render ---------- */
  function render() {
    const all = getFiltered();
    const total = all.length;
    const shown = all.slice(0, state.limit);

    grid.className = state.view === "list" ? "product-list" : "product-grid";
    if (state.view === "list") {
      grid.innerHTML = (total ? listHeadHTML() : "") + shown.map(rowHTML).join("");
    } else {
      grid.innerHTML = shown.map(cardHTML).join("");
    }
    grid.querySelectorAll(".pcard__plate").forEach((plate) => {
      const host = plate.closest("[data-slug]");
      if (host) wirePlate(plate, BY_SLUG[host.dataset.slug]);
    });

    elEmpty.hidden = total !== 0;
    if (total === 0) { const em = $("#emptyMsg"); if (em) em.textContent = state.q.trim() ? 'No produce matches “' + state.q.trim() + '”.' : "No produce matches the selected filters."; }
    elMore.hidden = total <= state.limit;
    if (elCount) elCount.textContent = shown.length >= total ? "Showing all " + total + " lines" : "Showing " + shown.length + " of " + total;
    renderChips();
  }

  function renderChips() {
    const chips = [];
    if (state.cat !== "all") chips.push({ k: "cat", label: CAT_LABEL[state.cat] });
    if (state.inSeason) chips.push({ k: "season", label: "In season now" });
    if (state.q.trim()) chips.push({ k: "q", label: '“' + state.q.trim() + '”' });
    elChips.innerHTML = chips.map((c) => '<span class="catalog-chip">' + esc(c.label) + '<button type="button" data-chip="' + c.k + '" aria-label="Remove filter">&times;</button></span>').join("");
    elClearAll.hidden = chips.length === 0;
  }

  /* ---------- Toolbar events ---------- */
  function resetLimit() { state.limit = STEP; }

  let searchT;
  if (elSearch) elSearch.addEventListener("input", () => {
    elSearchClear.hidden = !elSearch.value;
    clearTimeout(searchT);
    searchT = setTimeout(() => { state.q = elSearch.value; resetLimit(); render(); }, 150);
  });
  if (elSearchClear) elSearchClear.addEventListener("click", () => { elSearch.value = ""; elSearchClear.hidden = true; state.q = ""; resetLimit(); render(); elSearch.focus(); });

  elTabs.forEach((tab) => tab.addEventListener("click", () => {
    elTabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-pressed", "false"); });
    tab.classList.add("is-active"); tab.setAttribute("aria-pressed", "true");
    state.cat = tab.dataset.filter; resetLimit(); render();
  }));

  if (elSort) elSort.addEventListener("change", () => { state.sort = elSort.value; resetLimit(); render(); });
  if (elSeason) elSeason.addEventListener("click", () => {
    state.inSeason = !state.inSeason;
    elSeason.setAttribute("aria-pressed", String(state.inSeason));
    resetLimit(); render();
  });

  function setView(v) {
    state.view = v; writeLS("raveg:view", v);
    elViewBtns.forEach((b) => { const on = b.dataset.view === v; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    render();
  }
  elViewBtns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

  if (elLoadMore) elLoadMore.addEventListener("click", () => { state.limit += STEP; render(); });

  elChips.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chip]");
    if (!btn) return;
    const k = btn.dataset.chip;
    if (k === "cat") { state.cat = "all"; elTabs.forEach((t) => { const on = t.dataset.filter === "all"; t.classList.toggle("is-active", on); t.setAttribute("aria-pressed", String(on)); }); }
    if (k === "season") { state.inSeason = false; elSeason.setAttribute("aria-pressed", "false"); }
    if (k === "q") { state.q = ""; if (elSearch) { elSearch.value = ""; elSearchClear.hidden = true; } }
    resetLimit(); render();
  });

  function clearAll() {
    state.cat = "all"; state.q = ""; state.inSeason = false;
    if (elSearch) { elSearch.value = ""; elSearchClear.hidden = true; }
    elTabs.forEach((t) => { const on = t.dataset.filter === "all"; t.classList.toggle("is-active", on); t.setAttribute("aria-pressed", String(on)); });
    if (elSeason) elSeason.setAttribute("aria-pressed", "false");
    resetLimit(); render();
  }
  if (elClearAll) elClearAll.addEventListener("click", clearAll);
  if ($("#emptyClear")) $("#emptyClear").addEventListener("click", clearAll);

  /* ---------- Grid interaction (delegated) ---------- */
  grid.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]");
    if (act) { e.stopPropagation();
      if (act.dataset.act === "enquire") toggleEnquire(act.dataset.slug);
      else if (act.dataset.act === "quick") openQuick(act.dataset.slug);
      return;
    }
    const host = e.target.closest("[data-slug]");
    if (host) openQuick(host.dataset.slug);
  });

  /* ---------- Quote basket ---------- */
  const quoteBar = $("#quoteBar"), quoteCount = $("#quoteCount"), quoteThumbs = $("#quoteThumbs"), quoteLabel = $("#quoteLabel"), quoteStatus = $("#quoteStatus");

  function toggleEnquire(slug) {
    if (quote[slug]) delete quote[slug];
    else quote[slug] = 1;
    writeLS("raveg:quote", quote);
    refreshSelected();
    updateQuoteBar();
  }
  function refreshSelected() {
    $$("[data-slug]").forEach((el) => {
      const inQ = !!quote[el.dataset.slug];
      el.classList.toggle("is-selected", inQ);
      const b = el.querySelector(".btn-enquire");
      if (b) {
        const short = !!el.closest(".prow");
        b.classList.toggle("is-added", inQ);
        b.textContent = inQ ? (short ? "✓ Added" : "Added ✓") : (short ? "Add" : "Add to enquiry");
      }
    });
  }
  function updateQuoteBar() {
    const slugs = Object.keys(quote);
    const n = slugs.length;
    if (quoteCount) quoteCount.textContent = n;
    if (quoteLabel) quoteLabel.textContent = (n === 1 ? "line" : "lines") + " in your enquiry";
    if (quoteThumbs) {
      quoteThumbs.innerHTML = slugs.slice(0, 5).map((s) => {
        const p = BY_SLUG[s]; const c = candidates(p)[0];
        return c ? '<img class="qthumb" data-mono="' + esc(p.name[0]) + '" src="' + c.url + '" alt="" width="26" height="26">'
                 : '<span class="quote-bar__mono">' + esc(p.name[0]) + "</span>";
      }).join("") + (n > 5 ? '<span class="quote-bar__more">+' + (n - 5) + "</span>" : "");
      quoteThumbs.querySelectorAll("img.qthumb").forEach((img) => {
        img.addEventListener("error", () => { const s = document.createElement("span"); s.className = "quote-bar__mono"; s.textContent = img.dataset.mono; img.replaceWith(s); }, { once: true });
      });
    }
    if (quoteStatus) quoteStatus.textContent = n === 0 ? "" : n + (n === 1 ? " line" : " lines") + " in your enquiry";
    if (quoteBar) {
      if (n > 0) { quoteBar.hidden = false; requestAnimationFrame(() => quoteBar.classList.add("show")); }
      else { quoteBar.classList.remove("show"); setTimeout(() => { if (!Object.keys(quote).length) quoteBar.hidden = true; }, 350); }
    }
  }
  if ($("#quoteClear")) $("#quoteClear").addEventListener("click", () => { quote = {}; writeLS("raveg:quote", quote); refreshSelected(); updateQuoteBar(); });
  if ($("#quoteRequest")) $("#quoteRequest").addEventListener("click", requestQuote);

  function requestQuote() {
    const slugs = Object.keys(quote);
    if (!slugs.length) return;
    const lines = slugs.map((s) => { const p = BY_SLUG[s]; return "• " + p.name + " (" + p.sku + ") — qty " + quote[s] + " × " + p.pack; });
    const subject = $("#subject"), message = $("#message");
    if (subject) subject.value = "Trade quote request";
    if (message) message.value =
      "Hello RavegLtd,\n\nI'd like a trade quote for the following " + slugs.length + " line(s):\n\n" +
      lines.join("\n") +
      "\n\nDelivery postcode: \nPreferred delivery date: \n\nThank you.";
    closeQuick();
    const contact = $("#contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
    if (message) {
      message.classList.add("flash");
      setTimeout(() => message.classList.remove("flash"), 1200);
      setTimeout(() => { message.focus({ preventScroll: true }); }, 500);
    }
  }

  /* ---------- Quick view ---------- */
  const qv = $("#quickview"), qvBody = $("#qvBody"), qvPanel = $(".quickview__panel"), qvClose = $("#qvClose"), qvOverlay = $("#qvOverlay");
  let qvLastFocus = null, qvSlug = null;

  function openQuick(slug) {
    const p = BY_SLUG[slug];
    if (!p || !qv) return;
    qvSlug = slug; qvLastFocus = document.activeElement;
    const st = STATUS[p.status] || STATUS.in;
    const inQ = !!quote[slug];
    const specs = [
      ["SKU", p.sku], ["Pack", p.pack], ["Unit", p.unit], ["Grade", p.grade],
      ["MOQ", p.moq], ["Origin", p.origin], ["Storage", p.storage || "—"], ["Certification", p.organic ? "Organic" : "Conventional"],
    ];
    qvBody.innerHTML =
      plateHTML(p).replace("pcard__plate", "pcard__plate qv__plate") +
      '<span class="qv__cat">' + esc(CAT_LABEL[p.cat]) + "</span>" +
      '<h3 class="qv__title" id="qvTitle">' + esc(p.name) + "</h3>" +
      '<p class="qv__variety">' + esc(p.variety) + "</p>" +
      '<p class="qv__status"><span class="chip-status status--' + st.cls + '"><i></i>' + st.label + "</span></p>" +
      '<div class="qv__specs">' + specs.map((s) => "<div><span>" + s[0] + "</span><b>" + esc(s[1]) + "</b></div>").join("") + "</div>" +
      '<p class="qv__seasonh">Seasonality</p>' +
      '<div class="qv__seasonbar" aria-hidden="true">' + p.season.map((on, i) => '<span class="' + (on ? "on" : "") + (i === MONTH ? " now" : "") + '"><i></i>' + MONTHS_FULL[i].slice(0, 1) + "</span>").join("") + "</div>" +
      (p.note ? '<p class="qv__note">' + esc(p.note) + "</p>" : "") +
      '<div class="qv__buy">' +
        '<div class="qv__qty"><button type="button" data-qty="-1" aria-label="Decrease">−</button><span id="qvQty">' + (quote[slug] || 1) + "</span><button type=\"button\" data-qty=\"1\" aria-label=\"Increase\">+</button></div>" +
        '<button class="btn-enquire' + (inQ ? " is-added" : "") + '" type="button" id="qvEnquire">' + (inQ ? "Added ✓ — update" : "Add to enquiry") + "</button>" +
      "</div>";

    const plate = qvBody.querySelector(".pcard__plate");
    if (plate) wirePlate(plate, p);

    qv.hidden = false;
    document.body.classList.add("noscroll");
    requestAnimationFrame(() => qv.classList.add("is-open"));
    if (qvClose) qvClose.focus();
  }
  function closeQuick() {
    if (!qv || qv.hidden) return;
    qv.classList.remove("is-open");
    document.body.classList.remove("noscroll");
    setTimeout(() => { qv.hidden = true; }, 320);
    if (qvLastFocus && qvLastFocus.focus) qvLastFocus.focus({ preventScroll: true });
    qvSlug = null;
  }
  if (qvClose) qvClose.addEventListener("click", closeQuick);
  if (qvOverlay) qvOverlay.addEventListener("click", closeQuick);
  if (qvBody) qvBody.addEventListener("click", (e) => {
    const qbtn = e.target.closest("[data-qty]");
    if (qbtn) {
      const span = $("#qvQty");
      let n = Math.max(1, (parseInt(span.textContent, 10) || 1) + parseInt(qbtn.dataset.qty, 10));
      span.textContent = n;
      if (quote[qvSlug]) { quote[qvSlug] = n; writeLS("raveg:quote", quote); updateQuoteBar(); }
      return;
    }
    if (e.target.closest("#qvEnquire")) {
      const n = parseInt(($("#qvQty") || {}).textContent, 10) || 1;
      quote[qvSlug] = n; writeLS("raveg:quote", quote);
      refreshSelected(); updateQuoteBar();
      const b = $("#qvEnquire"); b.classList.add("is-added"); b.textContent = "Added ✓ — update";
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && qv && !qv.hidden) closeQuick();
    if (e.key === "Tab" && qv && !qv.hidden) {
      const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', qvPanel).filter((el) => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Featured ("Top Selling") + category showcase ---------- */
  function wireAllPlates(root) {
    root.querySelectorAll(".pcard__plate").forEach((plate) => {
      const host = plate.closest("[data-slug]");
      if (host && BY_SLUG[host.dataset.slug]) wirePlate(plate, BY_SLUG[host.dataset.slug]);
    });
  }

  function applyCategory(cat) {
    state.cat = cat; state.q = ""; state.inSeason = false; resetLimit();
    if (elSearch) { elSearch.value = ""; if (elSearchClear) elSearchClear.hidden = true; }
    if (elSeason) elSeason.setAttribute("aria-pressed", "false");
    elTabs.forEach((t) => { const on = t.dataset.filter === cat; t.classList.toggle("is-active", on); t.setAttribute("aria-pressed", String(on)); });
    render();
    const tb = $("#catalogToolbar"), hd = $("#header");
    if (tb) window.scrollTo({ top: tb.getBoundingClientRect().top + window.scrollY - (hd ? hd.offsetHeight : 70) - 8, behavior: "smooth" });
  }

  const FEATURED = ["mango", "bananas", "watermelon", "papaya", "okra", "onions", "tomatoes", "yam", "plantain", "spinach", "coriander", "scotch-bonnet"];
  const featuredGrid = $("#featuredGrid");
  if (featuredGrid) {
    featuredGrid.innerHTML = FEATURED.map((slug) => {
      const p = BY_SLUG[slug]; if (!p) return "";
      return '<button class="fcard" type="button" data-slug="' + p.slug + '" aria-label="' + esc(p.name + " — quick view") + '">' +
        plateHTML(p) + '<span class="fcard__name">' + esc(p.name) + "<small>" + esc(p.variety) + "</small></span></button>";
    }).join("");
    wireAllPlates(featuredGrid);
    featuredGrid.addEventListener("click", (e) => { const c = e.target.closest("[data-slug]"); if (c) openQuick(c.dataset.slug); });
  }

  const CATEGORIES = [
    { key: "fruits", label: "Fruits", rep: "oranges" },
    { key: "vegetables", label: "Vegetables", rep: "tomatoes" },
    { key: "herbs", label: "Salads & Herbs", rep: "coriander" },
    { key: "exotics", label: "Exotic Fruits", rep: "mango" },
  ];
  const showcase = $("#catShowcase");
  if (showcase) {
    showcase.innerHTML =
      '<div class="cat-showcase__head"><span class="kicker">Shop by category</span>' +
      "<p>Market leaders in Indian &amp; Afro-Caribbean produce — browse by category, or search the full range below.</p></div>" +
      '<div class="cat-grid">' + CATEGORIES.map((c) => {
        const p = BY_SLUG[c.rep] || PRODUCTS.find((x) => x.cat === c.key);
        return '<button class="cat-tile" type="button" data-filter="' + c.key + '" data-slug="' + p.slug + '" aria-label="Browse ' + esc(c.label) + '">' +
          plateHTML(p) +
          '<span class="cat-tile__label"><strong>' + esc(c.label) + "</strong><span>" + counts[c.key] + " lines</span><em>Browse &rarr;</em></span></button>";
      }).join("") + "</div>";
    wireAllPlates(showcase);
    showcase.addEventListener("click", (e) => { const t = e.target.closest("[data-filter]"); if (t) applyCategory(t.dataset.filter); });
  }

  // Hero "Fresh today" mini tiles (real product photos)
  const FRESH = [["mango", "Mangoes"], ["broccoli", "Broccoli"], ["apples", "Apples"], ["oranges", "Oranges"], ["aubergine", "Aubergine"], ["sweetcorn", "Sweetcorn"]];
  const freshGrid = $("#freshGrid");
  if (freshGrid) {
    freshGrid.innerHTML = FRESH.map(([slug, name]) => {
      const p = BY_SLUG[slug]; if (!p) return "";
      return '<div class="mini" data-slug="' + slug + '"><span class="mini__plate pcard__plate" data-fit="contain"><img class="pcard__img" alt=""><span class="pcard__mono">' + esc(name[0]) + '</span></span><span class="mini__name">' + esc(name) + "</span></div>";
    }).join("");
    wireAllPlates(freshGrid);
  }

  // Trust marquee (clean icon, no emoji)
  const marqueeTrack = $("#marqueeTrack");
  if (marqueeTrack) {
    const items = ["Daily Deliveries", "Globally Sourced", "Cold-Chain Fresh", "Trade Accounts", "Low Waste", "Premium Grade"];
    const check = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.4 2.4 4.8-5.2"/></svg>';
    const one = items.map((t) => "<span>" + check + esc(t) + "</span>").join("");
    marqueeTrack.innerHTML = one + one;
  }

  /* ---------- Initial paint ---------- */
  elViewBtns.forEach((b) => { const on = b.dataset.view === state.view; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
  render();
  refreshSelected();
  updateQuoteBar();

  /* =========================================================
     Site-wide interactions (header, nav, reveal, counters, form)
     ========================================================= */

  const header = $("#header"), progress = $("#scrollProgress"), toTop = $("#toTop");
  const headerH = header ? header.offsetHeight : 76;
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (toTop) toTop.classList.toggle("show", y > 600);
    if (progress) { const h = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%"; }
    if (elToolbar) { const top = elToolbar.getBoundingClientRect().top; elToolbar.classList.toggle("is-stuck", top <= headerH + 1); }
  }
  let scrollTicking = false;
  window.addEventListener("scroll", () => { if (!scrollTicking) { requestAnimationFrame(() => { onScroll(); scrollTicking = false; }); scrollTicking = true; } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Mobile nav
  const navToggle = $("#navToggle"), nav = $("#nav");
  function closeNav() { if (!nav) return; nav.classList.remove("is-open"); navToggle.classList.remove("is-open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.setAttribute("aria-label", "Open menu"); }
  if (navToggle) navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  if (nav) nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

  // Scroll spy
  const navLinks = $$(".nav__link");
  const SECTION_TO_NAV = { "why-us": "home", "featured": "home" }; // home sub-sections keep Home active
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const navId = SECTION_TO_NAV[en.target.id] || en.target.id;
      if ([].some.call(navLinks, (l) => l.getAttribute("href") === "#" + navId)) {
        navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + navId));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // Reveal on scroll
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => { if (en.isIntersecting) { const d = en.target.dataset.delay || 0; setTimeout(() => en.target.classList.add("is-visible"), +d); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealObs.observe(el));

  // Hero counters
  const statsBlock = $("#stats");
  if (statsBlock) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", isFloat = !Number.isInteger(target), dur = 1400, start = performance.now();
      const step = (now) => { const t = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - t, 3), val = target * eased; el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + (t === 1 ? suffix : ""); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const sObs = new IntersectionObserver((entries, obs) => { entries.forEach((en) => { if (en.isIntersecting) { statsBlock.querySelectorAll(".stat__num").forEach(animate); obs.disconnect(); } }); }, { threshold: 0.4 });
    sObs.observe(statsBlock);
  }

  // Contact form validation
  const form = $("#contactForm");
  if (form) {
    const note = $("#formNote");
    const setError = (field, msg) => { const wrap = field.closest(".field"); wrap.classList.toggle("has-error", !!msg); const small = wrap.querySelector(".error"); if (small) small.textContent = msg || ""; };
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const validators = {
      name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
      email: (v) => (!v.trim() ? "Email is required." : !emailOk(v) ? "Enter a valid email address." : ""),
      subject: (v) => (v.trim().length < 3 ? "Add a short subject." : ""),
      message: (v) => (v.trim().length < 10 ? "Message should be at least 10 characters." : ""),
    };
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("blur", () => setError(el, validators[el.name] ? validators[el.name](el.value) : ""));
      el.addEventListener("input", () => { if (el.closest(".field").classList.contains("has-error")) setError(el, validators[el.name](el.value)); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      Object.keys(validators).forEach((key) => { const el = form.elements[key]; const msg = validators[key](el.value); setError(el, msg); if (msg && !firstBad) firstBad = el; });
      if (firstBad) { note.textContent = "Please fix the highlighted fields."; note.className = "form-note bad"; firstBad.focus(); return; }
      const btn = form.querySelector('button[type="submit"]'); const original = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending…";
      setTimeout(() => {
        form.reset(); form.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
        btn.disabled = false; btn.textContent = original;
        note.textContent = "✓ Thanks! Your message has been sent — we'll be in touch shortly."; note.className = "form-note ok";
      }, 1100);
    });
  }

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
