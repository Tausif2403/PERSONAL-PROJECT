import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, phoneLogin, signup } from '../features/auth/authSlice'

export default function Auth({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, status, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '' })
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loginMethod, setLoginMethod] = useState('phone')
  const [otpSent, setOtpSent] = useState(false)
  const [demoOtp, setDemoOtp] = useState('')
  const [message, setMessage] = useState('')

  if (user) return <Navigate to={location.state?.from || '/'} replace />
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const sendOtp = () => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) return setMessage('Enter a valid 10-digit Indian mobile number.')
    const nextOtp = String(Math.floor(100000 + Math.random() * 900000))
    setDemoOtp(nextOtp)
    setOtpSent(true)
    setMessage(`Demo OTP: ${nextOtp}`)
  }

  const submit = (event) => {
    event.preventDefault(); setMessage('')
    if (isSignup) {
      if (form.name.trim().length < 2) return setMessage('Please enter your full name.')
      if (form.password.length < 6) return setMessage('Password must be at least 6 characters.')
      if (form.password !== form.confirm) return setMessage('Passwords do not match.')
      dispatch(signup({ name: form.name.trim(), username: form.username.trim(), password: form.password }))
      return
    }
    if (loginMethod === 'phone') {
      if (!otpSent) return sendOtp()
      if (otp !== demoOtp) return setMessage('That OTP is not correct. Please try again.')
      dispatch(phoneLogin(phone.replace(/\D/g, '')))
      return
    }
    dispatch(login({ username: form.username.trim(), password: form.password })).unwrap().then(() => navigate(location.state?.from || '/')).catch(() => {})
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
      <section className="hidden rounded-[2rem] bg-slate-950 p-10 text-white shadow-xl lg:block">
        <p className="text-5xl">🛍️</p>
        <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-orange-300">Daste Hunar · India</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">Handmade stories, made for you.</h1>
        <p className="mt-4 leading-relaxed text-slate-300">Discover thoughtful handmade pieces from India&apos;s creative makers.</p>
        <p className="mt-10 text-sm text-slate-400">Created by <span className="font-bold text-white">Md Tausif Raza</span></p>
      </section>
      <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/40 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600">{isSignup ? 'Join Daste Hunar' : 'Welcome back'}</p>
        <h2 className="mt-2 text-3xl font-black">{isSignup ? 'Create your account' : 'Sign in to continue'}</h2>
        <p className="mt-2 text-sm text-slate-500">{isSignup ? 'It takes less than a minute.' : 'Your next great find is waiting.'}</p>
        {!isSignup && <div className="mt-7 grid grid-cols-2 rounded-xl bg-orange-50 p-1 text-sm font-bold dark:bg-slate-800">
          <button type="button" onClick={() => { setLoginMethod('phone'); setMessage(''); setOtpSent(false) }} className={`rounded-lg py-2.5 transition ${loginMethod === 'phone' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}>📱 Phone OTP</button>
          <button type="button" onClick={() => { setLoginMethod('password'); setMessage('') }} className={`rounded-lg py-2.5 transition ${loginMethod === 'password' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}>🔐 Password</button>
        </div>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          {isSignup && <Field label="Full name" value={form.name} onChange={update('name')} placeholder="Md Tausif Raza" />}
          {(isSignup || loginMethod === 'password') && <Field label="Username or email" value={form.username} onChange={update('username')} placeholder="Enter your username" autoComplete="username" />}
          {(isSignup || loginMethod === 'password') && <Field label="Password" type="password" value={form.password} onChange={update('password')} placeholder="••••••••" autoComplete={isSignup ? 'new-password' : 'current-password'} />}
          {!isSignup && loginMethod === 'phone' && <>
            <Field label="Mobile number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" inputMode="numeric" autoComplete="tel" />
            {otpSent && <Field label="6-digit OTP" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter demo OTP" inputMode="numeric" autoComplete="one-time-code" />}
          </>}
          {isSignup && <Field label="Confirm password" type="password" value={form.confirm} onChange={update('confirm')} placeholder="••••••••" autoComplete="new-password" />}
          {(message || error) && <p className={`rounded-xl p-3 text-sm font-medium ${message.startsWith('Demo OTP') ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-600'}`}>{message || error}</p>}
          <button disabled={status === 'loading'} className="w-full rounded-xl bg-slate-950 py-3.5 font-bold text-white transition hover:bg-brand-600 disabled:opacity-60">
            {status === 'loading' ? 'Please wait…' : isSignup ? 'Create account' : loginMethod === 'phone' ? (otpSent ? 'Verify OTP' : 'Send OTP') : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">{isSignup ? 'Already have an account?' : 'New to Daste Hunar?'}{' '}
          <Link to={isSignup ? '/login' : '/signup'} className="font-bold text-brand-600 hover:underline">{isSignup ? 'Sign in' : 'Create an account'}</Link>
        </p>
        {!isSignup && <p className="mt-4 text-center text-xs text-slate-400">Free demo auth · no payment required</p>}
      </section>
    </main>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete, inputMode }) {
  return <label className="block text-sm font-semibold"><span className="mb-1.5 block">{label}</span><input required type={type} inputMode={inputMode} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} className="w-full rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100" /></label>
}
