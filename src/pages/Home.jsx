import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, fetchProducts, resetFilters, selectVisibleProducts, setFilter } from '../features/products/productsSlice'
import Filters from '../components/Filters'
import ProductCard from '../components/ProductCard'
import { EmptyState, ErrorMessage, ProductSkeleton } from '../components/ui'

const CATEGORIES = [
  { key: 'fashion', name: 'Wearable warmth', note: 'Sweaters & textiles', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=90' },
  { key: 'gifting', name: 'Little celebrations', note: 'Bouquets & gifts', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=90' },
  { key: 'home-decor', name: 'Home, but warmer', note: 'Ceramics & candles', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=90' },
  { key: 'jewellery', name: 'Small treasures', note: 'Jewellery & keepsakes', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=90' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.products)
  const products = useSelector(selectVisibleProducts)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
      dispatch(fetchCategories())
    }
  }, [status, dispatch])

  const chooseCategory = (category) => {
    dispatch(setFilter({ category }))
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="mx-auto w-full max-w-[1760px] px-3 pb-16 pt-4 sm:px-5 lg:px-8 lg:pt-6">
      <section className="relative grid min-h-[570px] overflow-hidden rounded-[2.5rem] bg-[#23372e] text-white shadow-2xl shadow-[#b9a48c]/30 lg:min-h-[calc(100svh-170px)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10 flex flex-col justify-center p-7 sm:p-12 lg:p-16">
          <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#e9c39a]"><span className="h-px w-8 bg-[#e9c39a]" /> Made slowly, loved longer</div>
          <h1 className="max-w-2xl font-serif text-5xl font-medium leading-[.98] tracking-tight sm:text-7xl">Things with a <em className="text-[#e9c39a]">story.</em></h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#dbe7df] sm:text-lg">Handmade sweaters, wildflower bouquets and little treasures made by real hands across India.</p>
          <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => chooseCategory('all')} className="rounded-full bg-[#e9c39a] px-6 py-3 text-sm font-black text-[#23372e] transition hover:bg-white">Explore the collection <span className="ml-2">↗</span></button><span className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white/80">Free delivery over ₹2,500</span></div>
          <p className="mt-10 text-xs font-bold uppercase tracking-widest text-white/45">Daste Hunar · by Md Tausif Raza</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden lg:min-h-0"><img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=92" alt="Fresh handmade flower bouquet" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#23372e]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#23372e] lg:via-transparent lg:to-transparent" /><div className="absolute bottom-6 right-6 rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-md"><p className="text-xs font-bold text-white/70">This week&apos;s mood</p><p className="mt-1 font-serif text-xl text-[#f6d9af]">Soft, thoughtful, handmade.</p></div></div>
      </section>

      <section className="py-14 sm:py-16"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">Shop by feeling</p><h2 className="mt-2 font-serif text-3xl text-slate-900 sm:text-4xl dark:text-white">Find your kind of beautiful.</h2></div><span className="hidden text-sm text-slate-500 sm:block">Small batches · Big heart</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{CATEGORIES.map((category) => <Link to={`/category/${category.key}`} key={category.key} className="group relative aspect-[.92] overflow-hidden rounded-[1.6rem] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><div className="absolute inset-x-4 bottom-4 text-white"><p className="font-serif text-xl leading-tight sm:text-2xl">{category.name}</p><p className="mt-1 text-xs font-semibold text-white/75 sm:text-sm">{category.note}</p></div></Link>)}</div></section>

      <section id="products" className="scroll-mt-32"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-brand-600">The Daste Hunar edit</p><h2 className="mt-2 font-serif text-3xl text-slate-900 sm:text-4xl dark:text-white">Made for your everyday.</h2></div><button onClick={() => setShowFilters((value) => !value)} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden">{showFilters ? 'Hide filters' : 'Filter & sort'}</button></div>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]"><div className={`${showFilters ? 'block' : 'hidden'} lg:block`}><div className="lg:sticky lg:top-28"><Filters /></div></div><section aria-live="polite">{status === 'failed' ? <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} /> : status === 'loading' || status === 'idle' ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)}</div> : products.length === 0 ? <EmptyState title="Nothing here yet" text="Try another craft category or clear your filters." action={<button onClick={() => dispatch(resetFilters())} className="mt-4 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">View everything</button>} /> : <><div className="mb-4 flex items-center justify-between text-sm"><p className="font-bold text-slate-700 dark:text-slate-200">{products.length} handmade finds</p><p className="hidden text-slate-500 sm:block">Every piece has its own little story.</p></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></>}</section></div>
      </section>
    </main>
  )
}
