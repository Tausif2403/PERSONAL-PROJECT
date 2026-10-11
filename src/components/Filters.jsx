import { useDispatch, useSelector } from 'react-redux'
import {
  resetFilters,
  selectFilters,
  selectPriceCeiling,
  setFilter,
} from '../features/products/productsSlice'
import { formatPrice } from './ui'

const SORTS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name: A–Z' },
]

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase())

export default function Filters() {
  const dispatch = useDispatch()
  const categories = useSelector((s) => s.products.categories)
  const filters = useSelector(selectFilters)
  const ceiling = useSelector(selectPriceCeiling)

  return (
    <aside className="space-y-6 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Filters</h2>
        <button onClick={() => dispatch(resetFilters())} className="text-sm text-brand-600 hover:underline">
          Reset
        </button>
      </div>

      <div>
        <label htmlFor="sort" className="mb-2 block text-sm font-medium">Sort by</label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Category</p>
        <div className="flex flex-wrap gap-2">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => dispatch(setFilter({ category: c }))}
              className={`rounded-full px-3 py-1 text-sm transition ${
                filters.category === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'all' ? 'All' : titleCase(c)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="price" className="mb-2 flex justify-between text-sm font-medium">
          <span>Max price</span>
          <span className="text-brand-600">{formatPrice(filters.maxPrice)}</span>
        </label>
        <input
          id="price"
          type="range"
          min="0"
          max={ceiling}
          value={Math.min(filters.maxPrice, ceiling)}
          onChange={(e) => dispatch(setFilter({ maxPrice: Number(e.target.value) }))}
          className="w-full accent-brand-600"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Minimum rating</p>
        <div className="flex gap-2">
          {[0, 3, 4].map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setFilter({ minRating: r }))}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-sm transition ${
                filters.minRating === r
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r === 0 ? 'Any' : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
