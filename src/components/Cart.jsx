import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../store/cartSlice'
import { useAuth } from '../hooks/useAuth'
import { createOrder } from '../firebase/orderService'
import CartItem from './CartItem'
import './Cart.css'

export default function Cart({ isOpen, onClose, onCheckout }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const items = useSelector((s) => s.cart.items)
  const totalCount = items.reduce((sum, i) => sum + i.count, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.count, 0)
  const [submitting, setSubmitting] = useState(false)

  async function handleCheckout() {
    if (!user) {
      onClose()
      navigate('/login', { state: { from: '/' } })
      return
    }

    setSubmitting(true)
    try {
      await createOrder(user.uid, items, totalPrice, totalCount)
      dispatch(clearCart())
      onClose()
      onCheckout()
    } catch (err) {
      console.error('Order failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose} />}
      <aside className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            {totalCount > 0 && (
              <p className="cart-subtitle">{totalCount} item{totalCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-sub">Add some items to get started</p>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            {!user && (
              <p className="cart-auth-notice">Sign in required to complete your purchase</p>
            )}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Total items</span>
                <span>{totalCount}</span>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={submitting}
            >
              {submitting ? 'Placing order…' : user ? 'Complete Purchase' : 'Sign In to Checkout'}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
