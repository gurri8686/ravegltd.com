# RavegLtd — Single-Page Website

A responsive, single-page marketing website for **RavegLtd**, a London wholesale supplier of fresh
fruit, vegetables and exotic produce (B2B — sells to retailers, supermarkets and restaurants).

It is built with **plain HTML, CSS and JavaScript** — **no frameworks, no build step, no npm install.**
You can literally double-click `index.html` and it opens in a browser. (A tiny local server is only
recommended so the embedded map and the online stock photos behave perfectly — see **Run it locally**.)

---

## 1. Tech stack & languages

| Layer | Technology | Notes |
|-------|-----------|-------|
| Markup | **HTML5** | `index.html` — one file, all sections |
| Styling | **CSS3** | `css/styles.css` — CSS Custom Properties (variables), Grid & Flexbox, media queries, keyframe animations. **Plain CSS** — no SASS/LESS/Tailwind |
| Behaviour | **JavaScript (vanilla, ES6+)** | `js/script.js` — one IIFE, **no React/Vue/jQuery or any library** |

**There are no dependencies to install.** Nothing is bundled or compiled.

### External resources (loaded over the internet via `<link>` / URLs — nothing installed)
- **Google Fonts** — `Plus Jakarta Sans` (body text) + `Fraunces` (display headings)
- **OpenStreetMap** — the Contact section map (an `<iframe>`, no API key needed)
- **Product photos** — your own local images first, then stock fallbacks from
  `themealdb.com` (clean ingredient cut-outs) and `loremflickr.com` (keyword photos)

> The site works offline too — if the internet/stock images are unavailable, each product image
> falls back to a clean lettered tile, and the map simply won't load. Local images always work.

### Tooling versions (only needed to *serve* the files, not to build them)
This project was created and tested with the following, but it is **not** tied to any version —
any modern browser plus *either* Python 3 *or* Node.js (or a code-editor "Live Server") is enough.

| Tool | Version used | Required? |
|------|--------------|-----------|
| Web browser | Chrome / Edge / Firefox / Safari (current) | ✅ yes |
| Python | 3.13.2 | optional (one way to run a local server) |
| Node.js | 22.18.0 | optional (another way to run a local server) |

---

## 2. Run it locally

### Option A — simplest (no tools)
Open the folder and **double-click `index.html`** (or drag it into a browser).
Everything works except the embedded map may be blocked by the browser's `file://` security
(the rest of the page is fine).

### Option B — local server (recommended)
Running a small server makes the map + online images load reliably. Pick **one**:

**Python 3** (already on most machines):
```bash
cd RavegLtd-Website
python -m http.server 8000
```
Then open **http://127.0.0.1:8000** (or http://localhost:8000).
On some systems the command is `python3` instead of `python`.

**Node.js** (no install needed, uses npx):
```bash
cd RavegLtd-Website
npx serve .
# or:  npx http-server -p 8000
```

**VS Code:** install the **"Live Server"** extension → right-click `index.html` → *Open with Live Server*.

> Tip: after editing any file, do a **hard refresh** in the browser — `Ctrl + Shift + R`
> (Windows/Linux) or `Cmd + Shift + R` (Mac) — to bypass the cache.

---

## 3. Project structure

```
RavegLtd-Website/
├─ index.html                 # all the markup (every section lives here)
├─ css/
│  └─ styles.css              # all styling + responsive rules + animations
├─ js/
│  └─ script.js               # all interactivity (catalogue, quote basket, etc.)
├─ assets/
│  └─ products/               # product photos, organised by category
│     ├─ fruits/
│     ├─ vegetables/
│     ├─ exotics/
│     └─ herbs/
└─ README.md                  # this file
```

---

## 4. The page & its sections

It is a **single page** (one HTML file). The top navigation (Home · About Us · Products · Contact Us)
smooth-scrolls to each section — these are **sections, not separate pages**.

1. **Home / Hero** (`#home`) — headline, key stats, a "Fresh today" mini-gallery (real photos),
   and a scrolling trust strip.
2. **Why RavegLtd** — 4 benefit cards: *International Imports · Always Fresh · Superior Quality ·
   Competitive Wholesale Prices*.
3. **Top Selling Products** (`#featured`) — a curated grid of 12 best-sellers (click any → quick-view).
4. **About Us** (`#about`) — *Our Story · What We Offer · Our Values*.
5. **Products** (`#products`) — the main catalogue:
   - **Shop by category** tiles (Fruits / Vegetables / Salads & Herbs / Exotic Fruits) — click to filter
   - **Toolbar**: live search · category filter · "In season now" toggle · sort · **Grid/List** view
   - **Product cards / list rows** with pack, unit, grade, MOQ, origin, availability & seasonality
   - **Request-a-quote basket**: "Add to enquiry" → sticky bar → "Request quote" pre-fills the Contact form
   - **Quick-view** drawer with full specs
6. **Contact Us** (`#contact`) — contact details, OpenStreetMap, and a validated enquiry form.
7. **Footer** — brand, menu, legal links, contact details.

**Catalogue size:** 51 products across 4 categories (15 Fruits · 14 Vegetables · 14 Exotics · 8 Herbs).

---

## 5. Product images — how they work & how to add your own

### How an image is chosen (fallback chain)
For every product, the site tries these **in order** and uses the first that loads:
1. **Your local file** — `assets/products/<category>/<slug>.<ext>` (if listed in `LOCAL_IMAGES`, see below)
2. **Stock cut-out** — `themealdb.com` clean studio photo (for common produce)
3. **Keyword photo** — `loremflickr.com` (for a few exotics without a cut-out)
4. **Lettered tile** — a clean monogram so a broken/offline image never shows a broken icon

### To use your OWN photo for a product (2 steps)
1. **Drop the image** into the matching category folder, named after the product's **slug**, e.g.
   `assets/products/fruits/apples.jpg`  (JPG, JPEG, PNG or WEBP all fine).
2. **Register it** in `js/script.js` — find the `LOCAL_IMAGES` object near the top and add a line
   `slug: "filename.ext"`:
   ```js
   const LOCAL_IMAGES = {
     apples: "apples.jpeg",
     bananas: "bananas.jpeg",
     // add yours here, e.g.:
     lemons: "lemons.jpg",
   };
   ```
   Save, hard-refresh — done. (Photos already wired: apples, bananas, oranges, strawberries, papaya,
   watermelon, mango, plantain, guava, jackfruit.)

### Product slugs (= the filename to use)
```
FRUITS:      apples · bananas · oranges · strawberries · lemons · limes · pineapples ·
             blueberries · raspberries · kiwi · avocados · pomegranates · papaya · apricots · watermelon
VEGETABLES:  tomatoes · potatoes · onions · red-onions · carrots · broccoli · red-peppers · cucumber ·
             courgettes · aubergine · spinach · mushrooms · sweetcorn · green-beans
EXOTICS:     mango · plantain · okra · cassava · yam · dragon-fruit · passion-fruit · lychee ·
             scotch-bonnet · ginger · sweet-potato · pak-choi · guava · jackfruit
HERBS:       coriander · mint · basil · parsley · dill · thyme · rosemary · garlic
```

### Other images on the page
- **Hero "Fresh today" tiles** and **Shop-by-category tiles** reuse the same product photos (no extra files).
- **About-section photos** (Our Story / What We Offer) currently use stock market photos via
  `loremflickr.com` — to use your own, replace the two `<img class="media-card__img" ...>` `src`
  values in `index.html` (in the About section) with a local path like `assets/about/story.jpg`.
- **Logo** is an inline SVG mark (in `index.html`, header + footer). To use a real logo image, replace
  the `<svg>` inside `<span class="brand__mark">` with `<img src="assets/logo.png" alt="RavegLtd">`.

---

## 6. Editing content

| What to change | Where |
|----------------|-------|
| Products (add/remove/edit, pack, origin, season, etc.) | `PRODUCTS` array near the top of `js/script.js` |
| Which 12 items appear in "Top Selling" | `FEATURED` array in `js/script.js` |
| Category tiles + their representative image | `CATEGORIES` array in `js/script.js` |
| Headlines & paragraph text | directly in `index.html` |
| Phone / email / address | Contact section **and** Footer in `index.html` |
| Map location | the OpenStreetMap `<iframe>` `src` in the Contact section (change the `marker=` coordinates) |
| Brand colours & fonts | the CSS variables in `:root { ... }` at the top of `css/styles.css` |

### One `PRODUCTS` entry looks like this
```js
{ name: "Apples", slug: "apples", cat: "fruits", img: "Apple", sku: "FRT-001",
  variety: "Gala & Braeburn", origin: "Kent, UK", pack: "Box · 80–100ct", unit: "per box",
  grade: "Class I", moq: "1 box", season: YR, status: "in",
  storage: "Chilled 1–4°C · 21 days", note: "British-grown, kept fresh from harvest." }
```
- `cat`: `fruits` | `vegetables` | `exotics` | `herbs`
- `img`: TheMealDB ingredient token (stock fallback); `kw` + `lock`: a LoremFlickr keyword fallback instead
- `season`: `YR` (year-round) or `M(5,6,7,8)` (the in-season month numbers)
- `status`: `in` (In stock) | `low` (Limited) | `year` (Year-round) | `seasonal` (Seasonal)

---

## 7. Responsive design

Fully responsive, with breakpoints in `css/styles.css`:
- **≥ 1280px** desktop · **1024px** small desktop · **980px** tablet · **760px** mobile/landscape · **460px** small phones.
- Examples: product grid 5–6 → 2 columns; nav becomes a hamburger drawer; the list view collapses to
  stacked rows; the benefit cards become a single-column icon list.

Tested in current Chrome, Edge, Firefox and Safari. Honours `prefers-reduced-motion`.

---

## 8. The contact / quote form

The form and the "Request quote" basket are **front-end only** (they show a success message / pre-fill
the form, but do not send email yet). To actually receive enquiries, wire the form `submit` handler in
`js/script.js` to a backend, e.g. **Formspree**, **EmailJS**, Netlify Forms, or your own API endpoint.

---

## 9. Deploying (going live)

Because it's a static site, host it anywhere — just upload the folder:
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, done.
- **GitHub Pages** — push to a repo, enable Pages.
- **Any web server** (Apache/Nginx/shared hosting) — copy the files into the web root.

No server-side runtime, database or build pipeline required.

---

## 10. Before going live — checklist
- [ ] Replace placeholder phone / email (`020 8558 8876`, `sales@ravegltd.co.uk`) and social links.
- [ ] Set the real address + map coordinates.
- [ ] Add your own product & about photos (see section 5).
- [ ] Swap the SVG logo for a real logo if you have one.
- [ ] Connect the contact form to a real email/endpoint (section 8).
- [ ] Add real Terms & Conditions / Privacy Policy content.
