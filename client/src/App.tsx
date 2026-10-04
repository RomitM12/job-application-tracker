import { useEffect, useState } from 'react'
import { getApplications } from './api'
import { ApplicationCard } from './components/ApplicationCard'
import { STATUSES, STATUS_LABELS, type Application } from './types'

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

  return (
    <main className="app">
      <header>
        <h1>Job Application Tracker</h1>
        <p className="subtitle">{applications.length} applications</p>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}. Is the server running?</p>}

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
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default App
