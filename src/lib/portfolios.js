import { supabase, isSupabaseConfigured } from './supabase.js'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }
  return supabase
}

export function slugFromName(name = '') {
  const base = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base || 'portfolio'
}

export async function listPortfoliosForUser(userId) {
  const client = requireClient()
  const { data, error } = await client
    .from('portfolios')
    .select('id, slug, display_name, role, theme_id, published, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPortfolio(portfolioId, userId) {
  const client = requireClient()
  const { data, error } = await client
    .from('portfolios')
    .select('*')
    .eq('id', portfolioId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function savePortfolioFromForm(userId, form) {
  const client = requireClient()
  const slug = slugFromName(form.name)
  const payload = {
    user_id: userId,
    slug,
    display_name: form.name?.trim() || 'My Portfolio',
    role: form.role || null,
    theme_id: form.selectedTheme || null,
    form_data: form,
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await client
    .from('portfolios')
    .select('id')
    .eq('user_id', userId)
    .eq('slug', slug)
    .maybeSingle()

  if (existing?.id) {
    const { data, error } = await client
      .from('portfolios')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const { data, error } = await client
    .from('portfolios')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function setPortfolioPublished(portfolioId, userId, published) {
  const client = requireClient()
  const { data, error } = await client
    .from('portfolios')
    .update({ published })
    .eq('id', portfolioId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePortfolio(portfolioId, userId) {
  const client = requireClient()
  const { error } = await client
    .from('portfolios')
    .delete()
    .eq('id', portfolioId)
    .eq('user_id', userId)

  if (error) throw error
}
