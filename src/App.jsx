import { useState } from 'react'
import Header from './components/Header'
import ProductList from './components/ProductList'
import CategoryFilter from './components/CategoryFilter'
import Cart from './components/Cart'
import CheckoutSuccess from './components/CheckoutSuccess'
import './App.css'

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  function handleCategoryChange(cat) {
    setSelectedCategory(cat)
  }

  function handleCheckout() {
    setShowSuccess(true)
  }

  return (
    <div className="app">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="app-main">
        <section className="app-hero">
          <div className="app-hero-inner">
            <p className="app-hero-eyebrow">New Season Collection</p>
            <h1 className="app-hero-title">Curated for<br /><em>the discerning</em></h1>
            <p className="app-hero-tagline">Premium goods, thoughtfully selected</p>
          </div>
          <div className="app-hero-line" />
        </section>

        <div className="app-controls">
          <CategoryFilter selected={selectedCategory} onChange={handleCategoryChange} />
          {selectedCategory && (
            <button className="app-clear-filter" onClick={() => setSelectedCategory('')}>
              Clear filter
            </button>
          )}
        </div>

        <ProductList category={selectedCategory} />
      </main>

      <footer className="app-footer">
        <span className="app-footer-brand">LUXE BOUTIQUE</span>
        <span className="app-footer-copy">© 2026 · All rights reserved</span>
      </footer>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {showSuccess && (
        <CheckoutSuccess onDismiss={() => setShowSuccess(false)} />
      )}
    </div>
  )
}
