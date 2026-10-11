import { useEffect } from 'react'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import ProtectedRoute from './routes/ProtectedRoute'
import CategoryPage from './pages/CategoryPage'

function NotFound() {
  return (
    <main className="py-24 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <p className="mt-2 text-slate-600">This page doesn&apos;t exist.</p>
      <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">Go home</Link>
    </main>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  useEffect(() => {
    const savedTheme = localStorage.getItem('shopverse_theme')
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
      {!isAuthPage && <footer className="mt-12 border-t border-orange-100 bg-white/60 py-8 text-center text-sm text-slate-500">
        <p className="font-black text-slate-900">Daste <span className="text-brand-600">Hunar</span></p>
        <p className="mt-1">Handmade with heart · By Md Tausif Raza</p>
      </footer>}
      <CartDrawer />
    </div>
  )
}
