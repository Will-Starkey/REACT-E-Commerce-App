# LUXE Boutique — React E-Commerce App

A full-featured e-commerce application built with React, Redux Toolkit, Firebase, and Vite.

**Live App:** [https://react-e-commerce-app-willstarkey.vercel.app](https://react-e-commerce-app-willstarkey.vercel.app)

## Features

- **Product Catalog** — Browse products with category filtering, star ratings, and image fallbacks
- **Shopping Cart** — Add, update quantity, and remove items with Redux Toolkit state management and sessionStorage persistence
- **Firebase Authentication** — Email/password registration, login, and logout
- **User Profiles** — View and edit profile information, delete account
- **Product Management** — Admin users can create, update, and delete products via Firestore
- **Order Management** — Place orders at checkout, view order history with full details
- **Responsive Design** — Premium dark-themed UI with skeleton loading states

## Tech Stack

- **Frontend:** React 18, React Router, Redux Toolkit, React Query
- **Backend:** Firebase Authentication, Cloud Firestore
- **Build Tool:** Vite
- **Testing:** Vitest, React Testing Library
- **CI/CD:** GitHub Actions with automated deployment to Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Testing

Run all unit and integration tests:

```bash
npm test
```

Tests cover:
- **ProductCard** — Rendering, add-to-cart interaction, image fallback
- **Header** — Auth-aware navigation, cart badge, admin link visibility
- **Cart Integration** — Full flow from clicking "Add to Cart" to verifying Redux store updates

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/main.yml`) runs on every push to `main`:

1. **Build** — Compiles the project with Vite
2. **Test** — Runs the Vitest test suite
3. **Deploy** — Deploys to Vercel (only after tests pass)
