import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'
import authReducer from '../features/auth/authSlice'
import { saveCart } from './storage'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
})

// Persist cart items whenever they change
let prevItems = store.getState().cart.items
store.subscribe(() => {
  const items = store.getState().cart.items
  if (items !== prevItems) {
    prevItems = items
    saveCart(items)
  }
})
