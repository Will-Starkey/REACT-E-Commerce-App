import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../../store/cartSlice'
import authReducer from '../../store/authSlice'
import Header from '../Header'

// Mock Firebase modules
vi.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
}))

vi.mock('../../firebase/authService', () => ({
  logoutUser: vi.fn(),
}))

function createStore(preloadedState) {
  return configureStore({
    reducer: { cart: cartReducer, auth: authReducer },
    preloadedState,
  })
}

function renderHeader(store) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header onCartClick={vi.fn()} />
      </MemoryRouter>
    </Provider>
  )
}

describe('Header', () => {
  it('shows Sign In and Register links when user is not logged in', () => {
    const store = createStore({
      cart: { items: [] },
      auth: { user: null, loading: false, error: null },
    })
    renderHeader(store)

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
    expect(screen.queryByText('My Orders')).not.toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('shows My Orders, Profile, and Sign Out when user is logged in', () => {
    const store = createStore({
      cart: { items: [] },
      auth: {
        user: { uid: '123', email: 'test@test.com', name: 'Tester', isAdmin: false },
        loading: false,
        error: null,
      },
    })
    renderHeader(store)

    expect(screen.getByText('My Orders')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
    expect(screen.queryByText('Register')).not.toBeInTheDocument()
  })

  it('displays cart badge with correct count when items are in the cart', () => {
    const store = createStore({
      cart: {
        items: [
          { id: 1, title: 'A', price: 10, count: 2, image: '' },
          { id: 2, title: 'B', price: 20, count: 3, image: '' },
        ],
      },
      auth: { user: null, loading: false, error: null },
    })
    renderHeader(store)

    // 2 + 3 = 5 total items
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('hides cart badge when cart is empty', () => {
    const store = createStore({
      cart: { items: [] },
      auth: { user: null, loading: false, error: null },
    })
    renderHeader(store)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows Admin link only when user is an admin', () => {
    const store = createStore({
      cart: { items: [] },
      auth: {
        user: { uid: '123', email: 'admin@test.com', name: 'Admin', isAdmin: true },
        loading: false,
        error: null,
      },
    })
    renderHeader(store)

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('does not show Admin link for non-admin users', () => {
    const store = createStore({
      cart: { items: [] },
      auth: {
        user: { uid: '123', email: 'user@test.com', name: 'User', isAdmin: false },
        loading: false,
        error: null,
      },
    })
    renderHeader(store)

    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })
})
