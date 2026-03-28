import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,      // { uid, email, name, isAdmin }
    loading: true,   // true until onAuthStateChanged fires on boot
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    clearAuth(state) {
      state.user = null
      state.loading = false
      state.error = null
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setUser, clearAuth, setLoading, setError } = authSlice.actions
export default authSlice.reducer
