import { supabase, isSupabaseConfigured } from './supabase.js'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add keys to .env — see supabase/SETUP.md')
  }
  return supabase
}

export function mapAuthError(error) {
  const msg = (error?.message || '').toLowerCase()

  if (msg.includes('rate limit') || msg.includes('email rate')) {
    return 'Too many emails sent from Supabase. Use Google sign-in below, or wait about an hour.'
  }
  if (msg.includes('invalid login credentials')) {
    return 'Wrong email or password. Try again or use Google sign-in.'
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'This email already has an account. Switch to Sign in.'
  }
  if (msg.includes('password should be at least')) {
    return 'Password must be at least 6 characters.'
  }
  if (msg.includes('unable to validate email')) {
    return 'Enter a valid email address.'
  }

  return error?.message || 'Authentication failed'
}

export function authCallbackUrl(nextPath = '/dashboard') {
  const next = encodeURIComponent(nextPath)
  return `${window.location.origin}/auth/callback?next=${next}`
}

export async function signInWithGoogle(nextPath = '/dashboard') {
  const client = requireClient()
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: authCallbackUrl(nextPath),
      queryParams: { prompt: 'select_account' },
    },
  })
  if (error) throw new Error(mapAuthError(error))
}

export async function signUpWithEmail({ email, password, firstName, lastName }) {
  const client = requireClient()
  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
      },
      emailRedirectTo: authCallbackUrl('/dashboard'),
    },
  })
  if (error) throw new Error(mapAuthError(error))
  return data
}

export async function signInWithEmail({ email, password }) {
  const client = requireClient()
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) throw new Error(mapAuthError(error))
  return data
}

export async function signOut() {
  const client = requireClient()
  const { error } = await client.auth.signOut()
  if (error) throw new Error(mapAuthError(error))
}
