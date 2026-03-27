import { createSlice } from '@reduxjs/toolkit'

const SESSION_KEY = 'luxe_cart'

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToSession(items) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadFromSession(),
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        existing.count += 1
      } else {
        state.items.push({ ...product, count: 1 })
      }
      saveToSession(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      saveToSession(state.items)
    },
    updateCount(state, action) {
      const { id, count } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item) {
        item.count = count
        if (item.count <= 0) {
          state.items = state.items.filter((i) => i.id !== id)
        }
      }
      saveToSession(state.items)
    },
    clearCart(state) {
      state.items = []
      sessionStorage.removeItem(SESSION_KEY)
    },
  },
})

export const { addToCart, removeFromCart, updateCount, clearCart } = cartSlice.actions
export default cartSlice.reducer
