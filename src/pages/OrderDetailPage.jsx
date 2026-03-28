import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../firebase/orderService'
import './OrderDetailPage.css'

const PLACEHOLDER = 'https://via.placeholder.com/64x64/1a1714/c9a84c?text=LUXE'

export default function OrderDetailPage() {
  const { orderId } = useParams()

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  })

  if (isLoading) {
    return (
      <main className="order-detail-page">
        <div className="order-detail-inner">
          <div className="order-detail-loading">Loading order…</div>
        </div>
      </main>
    )
  }

  if (isError || !order) {
    return (
      <main className="order-detail-page">
        <div className="order-detail-inner">
          <p className="order-detail-error">Order not found.</p>
          <Link className="order-detail-back" to="/orders">← Back to Orders</Link>
        </div>
      </main>
    )
  }

  const formattedDate = order.createdAt?.toDate
    ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : 'Processing…'

  return (
    <main className="order-detail-page">
      <div className="order-detail-inner">
        <Link className="order-detail-back" to="/orders">← Back to Orders</Link>

        <div className="order-detail-header">
          <div>
            <h1 className="order-detail-title">
              Order #{orderId.slice(-8).toUpperCase()}
            </h1>
            <p className="order-detail-date">{formattedDate}</p>
          </div>
          <span className="order-status order-status--confirmed">Confirmed</span>
        </div>

        <ul className="order-detail-items">
          {order.items.map((item, idx) => (
            <li key={`${item.id}-${idx}`} className="order-detail-item">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.title}
                className="order-detail-item-img"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER }}
              />
              <div className="order-detail-item-info">
                <p className="order-detail-item-title">{item.title}</p>
                <p className="order-detail-item-qty">Qty: {item.count}</p>
              </div>
              <span className="order-detail-item-price">
                ${(item.price * item.count).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="order-detail-summary">
          <div className="order-detail-summary-row">
            <span>Total items</span>
            <span>{order.totalCount}</span>
          </div>
          <div className="order-detail-summary-row order-detail-summary-row--total">
            <span>Order Total</span>
            <span>${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
