import { useEffect, useState } from 'react'
import './CheckoutSuccess.css'

export default function CheckoutSuccess({ onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 500)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className={`checkout-success ${visible ? 'checkout-success--visible' : ''}`}>
      <div className="checkout-success-inner">
        <div className="checkout-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="checkout-success-text">
          <p className="checkout-success-title">Order Placed</p>
          <p className="checkout-success-sub">Your cart has been cleared. Thank you for shopping with LUXE.</p>
        </div>
        <button className="checkout-success-close" onClick={() => { setVisible(false); setTimeout(onDismiss, 400) }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="checkout-success-progress" />
    </div>
  )
}
