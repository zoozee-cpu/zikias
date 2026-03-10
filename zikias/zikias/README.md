# 🌿 Zikias — Luxury Fragrance App

A mobile-first PWA for Zikias fragrances. Built with React + Vite.

**Color Palette**
- Background: `#1B4242` (Deep Forest Green)
- Gold: `#C5A059` (Champagne Gold)
- Button Gold: `#9F814D` (Antique Gold)
- Text: `#FFFFFF`

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## ⚙️ Owner Setup (Do This Before Going Live)

### 1. Set Your WhatsApp Number
Edit `src/data/config.js`:
```js
whatsappNumber: '923001234567',  // Your number with country code, no + or spaces
```

### 2. Update Social Media Links
In the same file:
```js
socials: {
  instagram: 'https://instagram.com/YOUR_HANDLE',
  facebook:  'https://facebook.com/YOUR_PAGE',
  tiktok:    'https://tiktok.com/@YOUR_HANDLE',
},
```

### 3. Change Admin PIN
```js
adminPin: '1234',  // Change to your preferred PIN
```

---

## 🛍️ Managing Products

Edit `src/data/products.js` to add, remove, or edit products.

Each product has:
```js
{
  id:          1,           // Unique number
  name:        'Name',      // Product name
  family:      'woody',     // woody | citrus | oriental | green | aquatic
  mood:        'calm',      // used in Finder quiz
  occasion:    'daily',     // daily | evening | special
  intensity:   'light',     // light | rich | intense
  price:       4500,        // Price in PKR (no commas)
  size:        '50ml',
  notes: {
    top:   'Notes here',
    heart: 'Notes here',
    base:  'Notes here',
  },
  tag:         'New',       // Badge shown on card
  emoji:       '🌿',        // Visual placeholder (replace with images later)
  description: 'Short description shown on product detail page',
}
```

---

## 🎁 Managing Offers

### Via Admin Panel (In-app)
1. Open the app → tap **Admin** tab
2. Enter PIN
3. Toggle offers on/off, add new offers, or delete them

### Via Code
Edit `src/data/offers.js`:
```js
{
  id:     1,
  title:  'Offer Name',
  desc:   'Description of the offer',
  code:   'PROMOCODE',
  active: true,   // false = hidden
  color:  '#C5A059',
}
```

---

## 📁 Folder Structure

```
zikias/
├── public/
│   ├── manifest.json       ← PWA manifest
│   └── favicon.svg
├── src/
│   ├── components/         ← Reusable UI pieces
│   │   ├── Icon.jsx        ← All SVG icons
│   │   ├── TopBar.jsx      ← Header with cart button
│   │   ├── BottomNav.jsx   ← Navigation bar
│   │   ├── WhatsAppFAB.jsx ← Floating WhatsApp button
│   │   ├── ProductCard.jsx ← Product grid card
│   │   ├── ProductDetail.jsx ← Product detail modal
│   │   └── CartDrawer.jsx  ← Cart + Checkout flow
│   ├── pages/              ← One file per screen
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── FinderPage.jsx  ← Fragrance quiz
│   │   ├── OffersPage.jsx
│   │   └── AdminPage.jsx
│   ├── data/               ← ⭐ EDIT THESE FILES
│   │   ├── config.js       ← WhatsApp, PIN, socials
│   │   ├── products.js     ← All fragrances
│   │   ├── offers.js       ← Default promotions
│   │   └── quiz.js         ← Quiz questions
│   ├── hooks/
│   │   ├── useCart.js      ← Cart state logic
│   │   └── useOffers.js    ← Offers state logic
│   ├── utils/
│   │   ├── whatsapp.js     ← Order formatting & dispatch
│   │   └── recommend.js    ← Fragrance recommendation engine
│   ├── styles/
│   │   ├── global.css      ← All styles, animations, tokens
│   │   └── theme.js        ← Color/font constants
│   ├── App.jsx             ← Root component
│   └── main.jsx            ← Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 📱 Adding Real Product Images

Replace the emoji visuals by editing `ProductCard.jsx` and `ProductDetail.jsx`:

1. Add images to `public/images/`
2. Add an `image` field to each product in `products.js`:
   ```js
   image: '/images/illusion-noir.jpg',
   ```
3. In `ProductCard.jsx`, replace the emoji `<div>` with:
   ```jsx
   <img src={product.image} alt={product.name} style={{ width:'100%', height:120, objectFit:'cover' }} />
   ```

---

## 🌐 Deploying to GitHub Pages

```bash
# 1. Build
npm run build

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Add to package.json scripts:
"deploy": "gh-pages -d dist"

# 4. Deploy
npm run deploy
```

Or push to GitHub and connect to **Vercel** / **Netlify** for automatic deploys.

---

## 🛒 How Orders Work

1. User adds items → Cart → Checkout
2. Fills in Name, Phone, Address
3. Taps **Place Order via WhatsApp**
4. App opens WhatsApp with a pre-filled order message
5. Owner receives the order and can confirm/process manually

No backend required. All state is in-memory.

---

## 🔧 Customization Quick Reference

| What to change | File |
|---|---|
| WhatsApp number | `src/data/config.js` |
| Admin PIN | `src/data/config.js` |
| Colors | `src/styles/global.css` (CSS vars) + `src/styles/theme.js` |
| Products | `src/data/products.js` |
| Offers | `src/data/offers.js` |
| Quiz questions | `src/data/quiz.js` |
| Brand name/tagline | `src/data/config.js` |
