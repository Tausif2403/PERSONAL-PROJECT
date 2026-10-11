import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openCart, selectCartCount } from '../features/cart/cartSlice'
import { logout } from '../features/auth/authSlice'
import { setFilter } from '../features/products/productsSlice'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const count = useSelector(selectCartCount)
  const search = useSelector((s) => s.products.filters.search)
  const user = useSelector((s) => s.auth.user)
  const [dark, setDark] = useState(() => localStorage.getItem('shopverse_theme') === 'dark')
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('shopverse_theme', next ? 'dark' : 'light')
  }

  const onSearch = (e) => {
    dispatch(setFilter({ search: e.target.value }))
    if (pathname !== '/') navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-orange-100/80 bg-[#fffaf5]/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-3 sm:gap-5 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-orange-300 shadow-lg shadow-orange-200">DH</span>
          <span className="hidden sm:inline">
            Daste <span className="text-brand-600">Hunar</span><span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">India</span>
          </span>
        </Link>

        <div className={`${isAuthPage ? 'hidden sm:block' : ''} relative flex-1`}>
          <input
            type="search"
            value={search}
            onChange={onSearch}
            placeholder="Search handmade treasures…"
            aria-label="Search products"
            className="w-full rounded-2xl border border-orange-100 bg-white/80 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? <button onClick={() => dispatch(logout())} className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-orange-50 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline">Hi, {user.name?.split(' ')[0] || user.username} · Logout</button> : <Link to="/login" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-orange-50 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline">Login</Link>}
          <Link to="/signup" className="hidden rounded-xl border border-orange-200 px-3 py-2 text-sm font-bold text-brand-600 hover:bg-orange-50 lg:block">Sign up</Link>
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="grid h-10 w-10 place-items-center rounded-xl border border-orange-100 bg-white text-lg hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-900">{dark ? '☀️' : '🌙'}</button>
        </div>
        {!isAuthPage && <button
          onClick={() => dispatch(openCart())}
          className="relative rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-brand-600 dark:shadow-none"
          aria-label={`Open cart, ${count} items`}
        >
          🛒 <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold">
              {count}
            </span>
          )}
        </button>}
      </div>
      {!isAuthPage && <nav className="hidden border-t border-orange-100/70 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50 sm:block">
        <div className="mx-auto flex max-w-[1480px] items-center gap-7 px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 lg:px-10"><Link to="/" className="text-slate-900 dark:text-white">Home</Link><a href="#products" className="hover:text-brand-600">Craft categories</a><span className="text-brand-600">Maker&apos;s picks</span><span>Sell your craft</span><span className="ml-auto">🇮🇳 Handmade across India</span></div>
      </nav>}
    </header>
  )
}
