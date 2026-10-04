import { useEffect, useState } from 'react'
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateStatus,
  type NewApplication,
} from './api'
import { ApplicationCard } from './components/ApplicationCard'
import { ApplicationForm } from './components/ApplicationForm'
import { STATUSES, STATUS_LABELS, type Application, type Status } from './types'

function App() {
  // State: data that, when it changes, makes React re-render the page.
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect with [] runs once, after the first render: a good place to load data.
  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Each handler: call the API, then update state with what the server sent back.
  // Updating state (instead of reloading everything) makes the UI change instantly.

  async function handleCreate(data: NewApplication) {
    try {
      const created = await createApplication(data)
      setApplications((prev) => [created, ...prev])
      setError(null)
    } catch (err) {
      setError((err as Error).message)
      throw err // let the form know it failed, so it keeps the typed values
    }
  }

  async function handleStatusChange(id: number, status: Status) {
    try {
      const updated = await updateStatus(id, status)
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteApplication(id)
      setApplications((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Job Application Tracker</h1>
        <p className="subtitle">{applications.length} applications</p>
      </header>

      <ApplicationForm onCreate={handleCreate} />

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {/* One column per status; each column shows the applications with that status. */}
      <section className="board">
        {STATUSES.map((status) => {
          const inColumn = applications.filter((a) => a.status === status)
          return (
            <div key={status} className={`column column-${status}`}>
              <h2>
                {STATUS_LABELS[status]} <span className="count">{inColumn.length}</span>
              </h2>
              {inColumn.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
              {inColumn.length === 0 && <p className="empty">Nothing here yet</p>}
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default App
