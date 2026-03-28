import { useState } from 'react'
import ProductList from '../components/ProductList'
import CategoryFilter from '../components/CategoryFilter'

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('')

  return (
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
        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        {selectedCategory && (
          <button className="app-clear-filter" onClick={() => setSelectedCategory('')}>
            Clear filter
          </button>
        )}
      </div>

      <ProductList category={selectedCategory} />
    </main>
  )
}
