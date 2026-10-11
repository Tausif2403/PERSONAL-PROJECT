import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, fetchProducts, resetFilters, selectVisibleProducts, setFilter } from '../features/products/productsSlice'
import Filters from '../components/Filters'
import ProductCard from '../components/ProductCard'
import { EmptyState, ErrorMessage, ProductSkeleton } from '../components/ui'

const CATEGORY_META = {
  fashion: { title: 'Wearable warmth', subtitle: 'Sweaters, textiles and soft things made for slow days.', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=90' },
  gifting: { title: 'Little celebrations', subtitle: 'Bouquets and thoughtful gifts for the people you love.', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=90' },
  'home-decor': { title: 'Home, but warmer', subtitle: 'Ceramics, candles and handmade details for your space.', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=90' },
  jewellery: { title: 'Small treasures', subtitle: 'Hand-finished jewellery and keepsakes with a little soul.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=90' },
}

export default function CategoryPage() {
  const { category = 'fashion' } = useParams()
  const dispatch = useDispatch()
  const meta = CATEGORY_META[category] || CATEGORY_META.fashion
  const { status, error } = useSelector((state) => state.products)
  const products = useSelector(selectVisibleProducts)

  useEffect(() => {
    dispatch(setFilter({ category }))
    if (status === 'idle') {
      dispatch(fetchProducts())
      dispatch(fetchCategories())
    }
  }, [category, status, dispatch])

  return (
    <main className="mx-auto w-full max-w-[1760px] px-3 pb-16 pt-5 sm:px-5 lg:px-8">
      <Link to="/" className="text-sm font-bold text-brand-600 hover:underline">← Back to collection</Link>
      <section className="relative mt-5 overflow-hidden rounded-[2rem] bg-[#23372e] p-8 text-white sm:p-12"><img src={meta.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-r from-[#23372e] via-[#23372e]/85 to-transparent" /><div className="relative max-w-xl"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#e9c39a]">Daste Hunar collection</p><h1 className="mt-3 font-serif text-4xl sm:text-6xl">{meta.title}</h1><p className="mt-4 text-base leading-relaxed text-[#dbe7df] sm:text-lg">{meta.subtitle}</p></div></section>
      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]"><div><div className="lg:sticky lg:top-28"><Filters /></div></div><section aria-live="polite">{status === 'failed' ? <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} /> : status === 'loading' || status === 'idle' ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)}</div> : products.length === 0 ? <EmptyState title="No handmade pieces here yet" text="Try another collection." action={<button onClick={() => dispatch(resetFilters())} className="mt-4 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">View all products</button>} /> : <><div className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">{products.length} pieces in this collection</div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></>}</section></div>
    </main>
  )
}
