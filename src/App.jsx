import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Cart from './components/Cart'
import CheckoutSuccess from './components/CheckoutSuccess'
import RequireAuth from './components/RequireAuth'
import RequireAdmin from './components/RequireAdmin'
import ShopPage from './pages/ShopPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import AdminProductsPage from './pages/AdminProductsPage'
import './App.css'

function Layout({ onCartClick }) {
  return (
    <div className="app">
      <Header onCartClick={onCartClick} />
      <Outlet />
      <footer className="app-footer">
        <span className="app-footer-brand">LUXE BOUTIQUE</span>
        <span className="app-footer-copy">© 2026 · All rights reserved</span>
      </footer>
    </div>
  )
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  function handleCheckout() {
    setShowSuccess(true)
  }

  return (
    <>
      <Routes>
        <Route element={<Layout onCartClick={() => setCartOpen(true)} />}>
          <Route path="/" element={<ShopPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <OrdersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <RequireAuth>
                <OrderDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminProductsPage />
                </RequireAdmin>
              </RequireAuth>
            }
          />
        </Route>
      </Routes>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {showSuccess && (
        <CheckoutSuccess onDismiss={() => setShowSuccess(false)} />
      )}
    </>
  )
}
