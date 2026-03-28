import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserOrders } from '../firebase/orderService'
import './OrdersPage.css'

export default function OrdersPage() {
  const { user } = useAuth()

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => getUserOrders(user.uid),
    enabled: !!user,
  })

  return (
    <main className="orders-page">
      <div className="orders-page-inner">
        <h1 className="orders-title">Order History</h1>
        <p className="orders-subtitle">Your past purchases with LUXE Boutique</p>

        {isLoading && (
          <div className="orders-loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="order-skeleton" />
            ))}
          </div>
        )}

        {isError && (
          <p className="orders-error">Failed to load orders. Please try again.</p>
        )}

        {!isLoading && !isError && orders?.length === 0 && (
          <div className="orders-empty">
            <p className="orders-empty-title">No orders yet</p>
            <p className="orders-empty-sub">Your completed purchases will appear here.</p>
            <Link className="orders-shop-link" to="/">Browse Products</Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.orderId} className="order-row">
                <Link className="order-row-link" to={`/orders/${order.orderId}`}>
                  <div className="order-row-left">
                    <span className="order-id">#{order.orderId.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      {order.createdAt?.toDate
                        ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })
                        : 'Processing…'}
                    </span>
                    <span className="order-items-count">
                      {order.totalCount} item{order.totalCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="order-row-right">
                    <span className="order-total">${order.totalPrice?.toFixed(2)}</span>
                    <span className="order-status order-status--confirmed">Confirmed</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
