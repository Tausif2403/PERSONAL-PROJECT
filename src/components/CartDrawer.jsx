import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
  selectCartSubtotal,
} from '../features/cart/cartSlice'
import { formatPrice } from './ui'
import { getProductImage } from '../data/productVisuals'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const { items, isOpen } = useSelector((s) => s.cart)
  const subtotal = useSelector(selectCartSubtotal)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && dispatch(closeCart())
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, dispatch])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={() => dispatch(closeCart())} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col border-l border-orange-100 bg-[#fffaf5] shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-100 bg-white p-5">
          <h2 className="text-lg font-bold">Your cart ({items.length})</h2>
          <button
            onClick={() => dispatch(closeCart())}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center p-6 text-center text-slate-500">
            <div>
              <p className="text-5xl">🛒</p>
              <p className="mt-3 font-medium">Your cart is empty</p>
              <p className="text-sm">Add something you love.</p>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-slate-50 p-2">
                    <img src={getProductImage(item)} alt={item.title} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = item.image }} className="h-full w-full rounded-lg object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-sm font-bold text-brand-600">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button
                          onClick={() => dispatch(decreaseQty(item.id))}
                          aria-label="Decrease quantity"
                          className="h-7 w-7 hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => dispatch(increaseQty(item.id))}
                          aria-label="Increase quantity"
                          className="h-7 w-7 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-slate-100 p-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-slate-500">Shipping and taxes calculated at checkout.</p>
              <div className="rounded-xl bg-orange-50 p-3 text-xs font-medium text-orange-800">✨ Free delivery on orders above {formatPrice(30)}</div>
              <Link
                to="/checkout"
                onClick={() => dispatch(closeCart())}
                className="block rounded-xl bg-slate-950 py-3 text-center font-bold text-white transition hover:bg-brand-600"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
