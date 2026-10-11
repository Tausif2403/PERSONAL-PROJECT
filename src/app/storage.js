const CART_KEY = 'shopverse_cart'
const AUTH_KEY = 'shopverse_auth'
const USERS_KEY = 'shopverse_users'

export const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

export const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    /* storage unavailable - ignore */
  }
}

export const loadAuth = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
}

export const saveAuth = (user) => {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)) } catch { /* storage unavailable */ }
}

export const clearAuth = () => {
  try { localStorage.removeItem(AUTH_KEY) } catch { /* storage unavailable */ }
}

export const loadUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [] } catch { return [] }
}

export const saveUsers = (users) => {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch { /* storage unavailable */ }
}
