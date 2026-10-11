import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { placeOrder, selectCartSubtotal } from '../features/cart/cartSlice'
import { formatPrice } from '../components/ui'
import { getProductImage } from '../data/productVisuals'

const SHIPPING = 99
const TAX_RATE = 0.08

const validators = {
  name: (v) => (v.trim().length < 2 ? 'Enter your full name' : ''),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email'),
  address: (v) => (v.trim().length < 5 ? 'Enter your street address' : ''),
  city: (v) => (v.trim().length < 2 ? 'Enter your city' : ''),
  zip: (v) => (/^\d{4,6}$/.test(v) ? '' : 'Enter a valid ZIP / PIN code'),
  card: (v) => (v.replace(/\s/g, '').length === 16 ? '' : 'Card number must be 16 digits'),
  expiry: (v) => (/^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? '' : 'Use MM/YY'),
  cvv: (v) => (/^\d{3,4}$/.test(v) ? '' : 'Invalid CVV'),
}

const initial = { name: '', email: '', address: '', city: '', zip: '', card: '', expiry: '', cvv: '' }

function Field({ name, label, placeholder, className = '', type = 'text', inputMode, form, errors, onChange }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={name}
        type={type}
        inputMode={inputMode}
        value={form[name]}
        onChange={onChange(name)}
        placeholder={placeholder}
        aria-invalid={!!errors[name]}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand-100 ${
          errors[name] ? 'border-red-400' : 'border-slate-200 focus:border-brand-500'
        }`}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  )
}

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((s) => s.cart.items)
  const lastOrder = useSelector((s) => s.cart.lastOrder)
  const subtotal = useSelector(selectCartSubtotal)
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const tax = subtotal * TAX_RATE
  const total = subtotal + (items.length ? SHIPPING : 0) + tax

  const update = (field) => (e) => {
    let value = e.target.value
    if (field === 'card') value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    if (field === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    const fieldsToValidate = paymentMethod === 'cod' ? ['name', 'email', 'address', 'city', 'zip'] : Object.keys(validators)
    fieldsToValidate.forEach((k) => {
      const msg = validators[k](form[k])
      if (msg) next[k] = msg
    })
    setErrors(next)
    if (Object.keys(next).length) return

    setPlacing(true)
    setTimeout(() => {
      dispatch(placeOrder({ customer: form.name, email: form.email, total, paymentMethod }))
      setPlacing(false)
      setDone(true)
    }, 1200) // simulated payment
  }

  if (done && lastOrder) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-100">
          <p className="text-6xl">🎉</p>
          <h1 className="mt-4 text-2xl font-extrabold">Order confirmed!</h1>
          <p className="mt-2 text-slate-600">
            Thanks, {lastOrder.customer}. Your order <b>{lastOrder.id}</b> for{' '}
            <b>{formatPrice(lastOrder.total)}</b> has been placed via{' '}
            <b>{lastOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'online payment'}</b>.
          </p>
          <p className="mt-1 text-sm text-slate-500">(Demo checkout — no real payment was made.)</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
          >
            Continue shopping
          </button>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-xl font-bold">Your cart is empty</h1>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">Back to store</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-7"><p className="text-sm font-bold uppercase tracking-widest text-brand-600">Almost there</p><h1 className="mt-1 text-3xl font-black">Complete your order</h1><p className="mt-1 text-sm text-slate-500">Secure checkout · Prices in Indian Rupees</p></div>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 font-bold">Shipping details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field form={form} errors={errors} onChange={update} name="name" label="Full name" placeholder="Jane Doe" className="sm:col-span-2" />
              <Field form={form} errors={errors} onChange={update} name="email" label="Email" type="email" placeholder="jane@example.com" className="sm:col-span-2" />
              <Field form={form} errors={errors} onChange={update} name="address" label="Address" placeholder="123 Main Street" className="sm:col-span-2" />
              <Field form={form} errors={errors} onChange={update} name="city" label="City" placeholder="Mumbai" />
              <Field form={form} errors={errors} onChange={update} name="zip" label="ZIP / PIN" placeholder="400001" inputMode="numeric" />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 font-bold">Payment method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setPaymentMethod('cod')} className={`rounded-xl border p-4 text-left transition ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100 dark:bg-orange-950/40' : 'border-slate-200'}`}><span className="text-xl">💵</span><span className="mt-1 block font-bold">Cash on Delivery</span><span className="text-xs text-slate-500">Pay when your handmade order arrives</span></button>
              <button type="button" onClick={() => setPaymentMethod('card')} className={`rounded-xl border p-4 text-left transition ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100 dark:bg-orange-950/40' : 'border-slate-200'}`}><span className="text-xl">💳</span><span className="mt-1 block font-bold">Card / UPI (demo)</span><span className="text-xs text-slate-500">Secure simulated payment</span></button>
            </div>
            {paymentMethod === 'card' && <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field form={form} errors={errors} onChange={update} name="card" label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" className="sm:col-span-2" />
              <Field form={form} errors={errors} onChange={update} name="expiry" label="Expiry" placeholder="MM/YY" />
              <Field form={form} errors={errors} onChange={update} name="cvv" label="CVV" placeholder="123" inputMode="numeric" />
            </div>}
          </section>

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {placing ? 'Placing order…' : paymentMethod === 'cod' ? `Place COD order · ${formatPrice(total)}` : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:sticky lg:top-24">
          <h2 className="mb-4 font-bold">Order summary</h2>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <img src={getProductImage(i)} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = i.image }} className="h-12 w-12 rounded-lg bg-slate-50 object-cover p-0.5" />
                <span className="line-clamp-1 flex-1">{i.title}</span>
                <span className="text-slate-500">×{i.qty}</span>
                <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{formatPrice(SHIPPING)}</dd></div>
            <div className="flex justify-between"><dt>Tax (8%)</dt><dd>{formatPrice(tax)}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold">
              <dt>Total</dt><dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  )
}
