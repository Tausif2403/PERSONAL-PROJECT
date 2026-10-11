# 🧵 Daste Hunar — Handmade Marketplace

A responsive handmade marketplace built with **React, Redux Toolkit and Tailwind CSS**, consuming the free [Fake Store API](https://fakestoreapi.com) for demo catalog data.

**Live demo:** _add your Vercel link here_
**Screenshots:** _add `docs/home.png`, `docs/cart.png`, `docs/checkout.png` here_

## ✨ Features

- Product listing with **loading skeletons** and **error + retry** states
- **Search**, **category filter**, **max-price slider**, **minimum rating** filter
- **Sorting**: price (asc/desc), top rated, name
- **Product detail page** (React Router, dynamic route)
- **Cart drawer** with quantity controls, subtotal, ESC / backdrop to close
- **Cart persists** across reloads (localStorage)
- **Checkout UI** with form validation, order summary (shipping + tax) and simulated payment
- Fully **responsive** (mobile filter toggle, adaptive grid)
- Accessible: ARIA labels, keyboard-closable dialog, focus-visible inputs

## 🧱 Tech Stack

| Area | Choice |
| --- | --- |
| UI | React 19, Tailwind CSS v4 |
| State | Redux Toolkit (`createSlice`, `createAsyncThunk`, memoized selectors) |
| Routing | React Router |
| Build | Vite |
| API | Fake Store API |

## 🧠 Architecture Highlights (good interview talking points)

- **Feature-based folders** — `features/products`, `features/cart`.
- **`createAsyncThunk`** manages `idle → loading → succeeded/failed` for products, categories and single product.
- **Derived data via `createSelector`** — filtering and sorting live in one memoized selector (`selectVisibleProducts`), so components stay dumb.
- **Store subscription** persists cart to localStorage; storage code is in its own module to avoid circular imports.
- **Controlled forms** with per-field validation and input masking (card number formatting).

## 📁 Folder Structure

```
src/
├── app/            # store + localStorage helpers
├── features/
│   ├── products/   # productsSlice (thunks, filters, selectors)
│   └── cart/       # cartSlice (items, drawer, order)
├── components/     # Header, ProductCard, Filters, CartDrawer, ui helpers
└── pages/          # Home, ProductDetail, Checkout
```

## 🚀 Run locally

```bash
npm install
npm run dev
```

Build: `npm run build` · Preview: `npm run preview`

## ☁️ Deploy (free)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). Click **Deploy**.

`vercel.json` already handles SPA routing so `/product/5` works on refresh.

## 🔮 Ideas to extend

- Wishlist, product reviews
- Pagination / infinite scroll
- Real payments with Stripe test mode
