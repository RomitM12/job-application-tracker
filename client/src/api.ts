import type { Application, Status } from './types'

// All calls to the backend live here, so components never deal with fetch details.
// The paths start with /api, which Vite forwards to the Express server (see vite.config.ts).

export interface NewApplication {
  company: string
  role: string
  status: Status
  appliedDate: string
  notes: string
}

// Shared helper: send a request, and turn an error response into a thrown Error.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  // 204 No Content has no body to parse.
  return (res.status === 204 ? undefined : await res.json()) as T
}

export function getApplications() {
  return request<Application[]>('/api/applications')
}

export function createApplication(data: NewApplication) {
  return request<Application>('/api/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateStatus(id: number, status: Status) {
  return request<Application>(`/api/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function deleteApplication(id: number) {
  return request<void>(`/api/applications/${id}`, { method: 'DELETE' })
}
