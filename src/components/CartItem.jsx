import { useDispatch } from 'react-redux'
import { removeFromCart, updateCount } from '../store/cartSlice'
import './CartItem.css'

const PLACEHOLDER = 'https://via.placeholder.com/80x80/1a1714/c9a84c?text=LUXE'

export default function CartItem({ item }) {
  const dispatch = useDispatch()

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrap">
        <img
          src={item.image}
          alt={item.title}
          className="cart-item-image"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
        />
      </div>

      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.title}</h4>
        <span className="cart-item-price">${(item.price * item.count).toFixed(2)}</span>

        <div className="cart-item-controls">
          <div className="cart-item-qty">
            <button
              className="cart-item-qty-btn"
              onClick={() => dispatch(updateCount({ id: item.id, count: item.count - 1 }))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="cart-item-qty-value">{item.count}</span>
            <button
              className="cart-item-qty-btn"
              onClick={() => dispatch(updateCount({ id: item.id, count: item.count + 1 }))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="cart-item-remove"
            onClick={() => dispatch(removeFromCart(item.id))}
            aria-label="Remove item"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
