import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import { Stars, formatPrice } from './ui'
import { getProductImage } from '../data/productVisuals'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { id, title, price, image, category, rating } = product
  const visual = getProductImage(product)

  return (
    <article className="group flex flex-col rounded-[1.4rem] border border-orange-100/80 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60">
      <Link to={`/product/${id}`} className="block">
        <div className="relative grid h-56 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-5">
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">Curated</span>
          <img
            src={visual}
            alt={title}
            loading="lazy"
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = image }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-600">{category}</span>
        <Link to={`/product/${id}`} className="mt-1 line-clamp-2 min-h-12 font-semibold leading-snug hover:text-brand-600">
          {title}
        </Link>
        <div className="mt-2">
          <Stars rate={rating?.rate} count={rating?.count} />
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-bold">{formatPrice(price)}</span>
          <button
            onClick={() => dispatch(addToCart({ ...product, image: visual }))}
            className="rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 active:scale-95"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
