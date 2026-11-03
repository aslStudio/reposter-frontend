export type Platform = 'telegram' | 'x' | 'threads'
export type Source = { id: number; platform: Platform; handle: string; url: string; enabled: boolean }
export type Destination = { id: number; platform: Platform; chat_id: string; style_prompt: string; language: string; mode: 'manual_approval' | 'automatic'; daily_limit: number; formatting_enabled: boolean; signature_text: string }
export type Route = { id: number; source_id: number; destination_id: number }
export type DraftStatus = 'pending_approval' | 'ready_to_publish' | 'publishing' | 'published' | 'publish_failed'
export type Draft = { id: number; source_url: string; destination_id: number; body: string; media_urls: string[]; status: DraftStatus; external_post_id?: string; error?: string; created_at: string }
export type Statistic = { destination_id: number; total: number; pending: number; ready: number; published: number; failed: number; published_today: number; x_connected: boolean; x_publish_enabled: boolean }
export type Settings = { automation_enabled: boolean }

export class ApiError extends Error { constructor(public status: number, message: string) { super(message) } }
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/v1${path}`, { ...options, credentials: 'same-origin', cache: 'no-store', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } })
  } catch { throw new ApiError(0, 'Сервер недоступен. Проверьте соединение.') }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: string }
    throw new ApiError(response.status, payload.error || `Ошибка сервера: ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
export const send = <T>(path: string, method: 'POST' | 'PATCH' | 'DELETE', body?: unknown) => api<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) })
