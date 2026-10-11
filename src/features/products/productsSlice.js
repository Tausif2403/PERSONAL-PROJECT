import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import HANDMADE_PRODUCTS, { HANDMADE_CATEGORIES } from '../../data/handmadeProducts'

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => HANDMADE_PRODUCTS)
export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => HANDMADE_CATEGORIES)
export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  const product = HANDMADE_PRODUCTS.find((item) => String(item.id) === String(id))
  if (!product) throw new Error('This handmade product could not be found.')
  return product
})

const initialState = {
  items: [],
  categories: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  selected: null,
  selectedStatus: 'idle',
  selectedError: null,
  filters: {
    search: '',
    category: 'all',
    maxPrice: 1000,
    minRating: 0,
    sort: 'default',
  },
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters(state) {
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        const top = Math.ceil(Math.max(...action.payload.map((p) => p.price), 0))
        state.filters.maxPrice = top || 1000
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.selectedError = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedStatus = 'failed'
        state.selectedError = action.error.message
      })
  },
})

export const { setFilter, resetFilters } = productsSlice.actions
export default productsSlice.reducer

const selectItems = (s) => s.products.items
export const selectFilters = (s) => s.products.filters

export const selectPriceCeiling = createSelector([selectItems], (items) =>
  Math.ceil(Math.max(...items.map((p) => p.price), 0)) || 1000
)

export const selectVisibleProducts = createSelector(
  [selectItems, selectFilters],
  (items, { search, category, maxPrice, minRating, sort }) => {
    const q = search.trim().toLowerCase()
    let list = items.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        p.price <= maxPrice &&
        (p.rating?.rate ?? 0) >= minRating &&
        (!q || p.title.toLowerCase().includes(q))
    )
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list = [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
        break
      case 'name':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }
    return list
  }
)
