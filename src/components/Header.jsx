import { useSelector } from 'react-redux'
import './Header.css'

export default function Header({ onCartClick }) {
  const items = useSelector((s) => s.cart.items)
  const totalCount = items.reduce((sum, i) => sum + i.count, 0)

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-wordmark">
          <span className="header-wordmark-main">LUXE</span>
          <span className="header-wordmark-sub">BOUTIQUE</span>
        </div>

        <nav className="header-nav">
          <span className="header-nav-item">New Arrivals</span>
          <span className="header-nav-item">Collections</span>
          <span className="header-nav-item">About</span>
        </nav>

        <button className="header-cart-btn" onClick={onCartClick} aria-label="Open cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {totalCount > 0 && (
            <span className="header-cart-badge">{totalCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}
