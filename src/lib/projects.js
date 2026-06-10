import { compressImageFile } from './compressImage.js'
import { builderProjectToDb } from './builderProjects.js'
import { supabase, isSupabaseConfigured } from './supabase.js'

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }
  return supabase
}

export async function listProjects(portfolioId) {
  const client = requireClient()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createProject(portfolioId, fields) {
  const client = requireClient()
  const { data: maxRow } = await client
    .from('projects')
    .select('sort_order')
    .eq('portfolio_id', portfolioId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sort_order = (maxRow?.sort_order ?? -1) + 1

  const { data, error } = await client
    .from('projects')
    .insert({
      portfolio_id: portfolioId,
      title: fields.title,
      description: fields.description || '',
      category: fields.category || '',
      stack: fields.stack || '',
      img1: fields.img1 || '',
      img2: fields.img2 || '',
      img3: fields.img3 || '',
      live_url: fields.live_url || '',
      repo_url: fields.repo_url || '',
      project_url: fields.project_url || '',
      sort_order,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(projectId, fields) {
  const client = requireClient()
  const { data, error } = await client
    .from('projects')
    .update({
      title: fields.title,
      description: fields.description || '',
      category: fields.category || '',
      stack: fields.stack || '',
      img1: fields.img1 || '',
      img2: fields.img2 || '',
      img3: fields.img3 || '',
      live_url: fields.live_url || '',
      repo_url: fields.repo_url || '',
      project_url: fields.project_url || '',
    })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(projectId) {
  const client = requireClient()
  const { error } = await client.from('projects').delete().eq('id', projectId)
  if (error) throw error
}

export async function reorderProjects(portfolioId, orderedIds) {
  const client = requireClient()
  const updates = orderedIds.map((id, index) =>
    client.from('projects').update({ sort_order: index }).eq('id', id).eq('portfolio_id', portfolioId)
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

async function uploadDataUrlImage(userId, dataUrl) {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const file = new File([blob], 'project.jpg', { type: blob.type || 'image/jpeg' })
  return uploadProjectImage(userId, file)
}

async function resolveImageField(userId, value) {
  if (!value) return ''
  if (value.startsWith('data:') && userId) {
    return uploadDataUrlImage(userId, value)
  }
  return value
}

/** Replace all Supabase projects for a portfolio from builder form (max 3). */
export async function replaceProjectsFromBuilder(portfolioId, builderProjects = [], userId) {
  const client = requireClient()
  const rows = builderProjects.filter((p) => p.title?.trim())

  const { error: delErr } = await client.from('projects').delete().eq('portfolio_id', portfolioId)
  if (delErr) throw delErr

  for (let i = 0; i < rows.length; i++) {
    const fields = builderProjectToDb(rows[i])
    fields.img1 = await resolveImageField(userId, fields.img1)
    fields.img2 = await resolveImageField(userId, fields.img2)
    fields.img3 = await resolveImageField(userId, fields.img3)

    const { error } = await client.from('projects').insert({
      portfolio_id: portfolioId,
      ...fields,
      sort_order: i,
    })
    if (error) throw error
  }
}

export async function uploadProjectImage(userId, file) {
  const client = requireClient()
  const compressed = await compressImageFile(file)
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`

  const { error } = await client.storage
    .from('project-images')
    .upload(path, compressed, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = client.storage.from('project-images').getPublicUrl(path)
  return data.publicUrl
}
