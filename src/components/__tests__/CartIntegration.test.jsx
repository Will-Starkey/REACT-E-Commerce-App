import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../../store/cartSlice'
import authReducer from '../../store/authSlice'
import ProductCard from '../ProductCard'

// Mock Firebase
vi.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
}))

const mockProduct = {
  id: 42,
  title: 'Integration Test Widget',
  price: 15.5,
  description: 'Widget for integration testing',
  category: 'testing',
  image: 'https://example.com/widget.jpg',
  rating: { rate: 3.5, count: 50 },
}

function createStore() {
  return configureStore({
    reducer: { cart: cartReducer, auth: authReducer },
  })
}

describe('Cart Integration — adding products updates Redux store', () => {
  it('adds a product to the cart when "Add to Cart" is clicked', () => {
    vi.useFakeTimers()
    const store = createStore()

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )

    // Cart starts empty
    expect(store.getState().cart.items).toHaveLength(0)

    // Click "Add to Cart"
    const btn = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(btn)

    // Cart now has 1 item with count 1
    const items = store.getState().cart.items
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe(42)
    expect(items[0].title).toBe('Integration Test Widget')
    expect(items[0].price).toBe(15.5)
    expect(items[0].count).toBe(1)

    vi.useRealTimers()
  })

  it('increments count when the same product is added twice', () => {
    vi.useFakeTimers()
    const store = createStore()

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    )

    const btn = screen.getByRole('button', { name: /add to cart/i })

    // First click
    fireEvent.click(btn)
    expect(store.getState().cart.items[0].count).toBe(1)

    // Button shows "Added" — advance timer so it resets back to "Add to Cart"
    act(() => {
      vi.advanceTimersByTime(1500)
    })

    // Second click
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(store.getState().cart.items).toHaveLength(1) // still 1 item, not 2
    expect(store.getState().cart.items[0].count).toBe(2) // count incremented

    vi.useRealTimers()
  })

  it('can add multiple different products to the cart', () => {
    vi.useFakeTimers()
    const store = createStore()

    const secondProduct = {
      id: 99,
      title: 'Another Widget',
      price: 25.0,
      description: 'Another product',
      category: 'testing',
      image: 'https://example.com/other.jpg',
      rating: { rate: 5, count: 10 },
    }

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
        <ProductCard product={secondProduct} />
      </Provider>
    )

    const buttons = screen.getAllByRole('button', { name: /add to cart/i })
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])

    const items = store.getState().cart.items
    expect(items).toHaveLength(2)
    expect(items[0].id).toBe(42)
    expect(items[1].id).toBe(99)

    vi.useRealTimers()
  })
})
