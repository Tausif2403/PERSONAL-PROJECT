import { createSelector, createSlice } from '@reduxjs/toolkit'
import { loadCart } from '../../app/storage'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart() ?? [], // [{ id, title, price, image, qty }]
    isOpen: false,
    lastOrder: null,
  },
  reducers: {
    addToCart(state, action) {
      const { id, title, price, image } = action.payload
      const existing = state.items.find((i) => i.id === id)
      if (existing) existing.qty += 1
      else state.items.push({ id, title, price, image, qty: 1 })
      state.isOpen = true
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    increaseQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.qty += 1
    },
    decreaseQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (!item) return
      if (item.qty <= 1) state.items = state.items.filter((i) => i.id !== item.id)
      else item.qty -= 1
    },
    clearCart(state) {
      state.items = []
    },
    openCart(state) {
      state.isOpen = true
    },
    closeCart(state) {
      state.isOpen = false
    },
    placeOrder(state, action) {
      state.lastOrder = {
        ...action.payload,
        id: `SV-${Date.now().toString().slice(-8)}`,
        items: state.items,
      }
      state.items = []
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  openCart,
  closeCart,
  placeOrder,
} = cartSlice.actions
export default cartSlice.reducer

const selectCartItems = (s) => s.cart.items
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((n, i) => n + i.qty, 0)
)
export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0)
)
