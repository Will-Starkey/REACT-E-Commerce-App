import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../../store/cartSlice'
import authReducer from '../../store/authSlice'
import ProductCard from '../ProductCard'

// Mock Firebase so it never initializes
vi.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
}))

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A great product for testing',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.2, count: 120 },
}

function createStore(preloadedState) {
  return configureStore({
    reducer: { cart: cartReducer, auth: authReducer },
    preloadedState,
  })
}

function renderWithStore(ui, store) {
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('ProductCard', () => {
  it('renders product title, price, description, category, and rating', () => {
    const store = createStore()
    renderWithStore(<ProductCard product={mockProduct} />, store)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('A great product for testing')).toBeInTheDocument()
    expect(screen.getByText('electronics')).toBeInTheDocument()
    expect(screen.getByText('(120)')).toBeInTheDocument()
  })

  it('dispatches addToCart and shows "Added" when button is clicked', () => {
    vi.useFakeTimers()
    const store = createStore()
    renderWithStore(<ProductCard product={mockProduct} />, store)

    const btn = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(btn)

    // Button text changes to "Added"
    expect(screen.getByText('Added')).toBeInTheDocument()

    // Redux store has the product
    expect(store.getState().cart.items).toHaveLength(1)
    expect(store.getState().cart.items[0].title).toBe('Test Product')

    vi.useRealTimers()
  })

  it('shows placeholder image when the original image fails to load', () => {
    const store = createStore()
    renderWithStore(<ProductCard product={mockProduct} />, store)

    const img = screen.getByAltText('Test Product')
    expect(img.src).toBe('https://example.com/image.jpg')

    // Simulate image load error
    fireEvent.error(img)

    expect(img.src).toContain('via.placeholder.com')
  })
})
