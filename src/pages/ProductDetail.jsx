import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../features/products/productsSlice'
import { addToCart } from '../features/cart/cartSlice'
import { ErrorMessage, Spinner, Stars, formatPrice } from '../components/ui'
import { getProductImage } from '../data/productVisuals'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected, selectedStatus, selectedError } = useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchProductById(id))
    window.scrollTo(0, 0)
  }, [id, dispatch])

  const product = selected && String(selected.id) === id ? selected : null
  const visual = product ? getProductImage(product) : null

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <Link to="/" className="text-sm font-semibold text-brand-600 hover:underline">← Back to store</Link>

      {selectedStatus === 'failed' ? (
        <div className="mt-8">
          <ErrorMessage message={selectedError} onRetry={() => dispatch(fetchProductById(id))} />
        </div>
      ) : !product ? (
        <Spinner label="Loading product…" />
      ) : (
        <div className="mt-6 grid gap-8 rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl shadow-orange-100/50 md:grid-cols-2 md:p-8">
          <div className="grid min-h-[22rem] place-items-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-8">
            <img src={visual} alt={product.title} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = product.image }} className="h-96 w-full rounded-xl object-cover shadow-lg shadow-orange-100/50" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{product.category}</span>
            <h1 className="mt-2 text-2xl font-extrabold leading-snug">{product.title}</h1>
            <div className="mt-3">
              <Stars rate={product.rating?.rate} count={product.rating?.count} />
            </div>
            <p className="mt-4 text-3xl font-extrabold">{formatPrice(product.price)}</p>
            <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>
            <div className="mt-6 grid grid-cols-3 gap-2 border-y border-slate-100 py-4 text-center text-xs text-slate-500"><span>🚚<br /><b className="text-slate-800">Fast delivery</b></span><span>↩️<br /><b className="text-slate-800">Easy returns</b></span><span>🔒<br /><b className="text-slate-800">Secure pay</b></span></div>
            <button
              onClick={() => dispatch(addToCart({ ...product, image: visual }))}
              className="mt-6 rounded-xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-brand-600 active:scale-[0.98]"
            >
              Add to cart
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
