import type { Application } from './types'

// All calls to the backend live here, so components never deal with fetch details.
// The paths start with /api, which Vite forwards to the Express server (see vite.config.ts).

export async function getApplications(): Promise<Application[]> {
  const res = await fetch('/api/applications')
  if (!res.ok) throw new Error(`Failed to load applications (${res.status})`)
  return res.json()
}
