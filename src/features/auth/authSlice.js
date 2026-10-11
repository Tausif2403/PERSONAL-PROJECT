import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { clearAuth, loadAuth, loadUsers, saveAuth, saveUsers } from '../../app/storage'

const API_URL = 'https://fakestoreapi.com/auth/login'

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  const localUser = loadUsers().find((user) => user.username === username && user.password === password)
  if (localUser) return { name: localUser.name, username: localUser.username, source: 'local' }

  try {
    const response = await fetch(API_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) throw new Error('Invalid username or password')
    const { token } = await response.json()
    return { name: username, username, token, source: 'api' }
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to sign in right now')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: loadAuth(), status: 'idle', error: null },
  reducers: {
    phoneLogin(state, action) {
      state.user = { name: 'Daste Hunar customer', phone: action.payload, source: 'otp' }
      state.status = 'succeeded'
      state.error = null
      saveAuth(state.user)
    },
    signup(state, action) {
      const users = loadUsers()
      if (users.some((user) => user.username === action.payload.username)) {
        state.status = 'failed'
        state.error = 'This username is already registered.'
        return
      }
      users.push(action.payload)
      saveUsers(users)
      state.user = { name: action.payload.name, username: action.payload.username, source: 'local' }
      state.status = 'succeeded'
      state.error = null
      saveAuth(state.user)
    },
    logout(state) {
      state.user = null
      state.status = 'idle'
      clearAuth()
    },
    clearAuthError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'; state.user = action.payload; state.error = null; saveAuth(action.payload)
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Login failed' })
  },
})

export const { signup, phoneLogin, logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
