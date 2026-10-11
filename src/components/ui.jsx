export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export function Stars({ rate = 0, count }) {
  const full = Math.round(rate)
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-amber-400" aria-hidden="true">
        {'★'.repeat(full)}
        <span className="text-slate-300">{'★'.repeat(5 - full)}</span>
      </span>
      <span className="text-slate-500" aria-label={`Rated ${rate} out of 5`}>
        {rate.toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <p className="text-lg font-semibold text-red-700">Something went wrong</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
      <div className="h-48 rounded-xl bg-slate-200" />
      <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 h-9 rounded-lg bg-slate-200" />
    </div>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl">🛍️</p>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-slate-500">{text}</p>
      {action}
    </div>
  )
}
