import type { Application } from '../types'

// A component is a function that takes props (inputs) and returns what to show.
export function ApplicationCard({ application }: { application: Application }) {
  return (
    <article className="card">
      <h3>{application.company}</h3>
      <p className="role">{application.role}</p>
      <div className="meta">
        {application.appliedDate && <span>Applied {application.appliedDate}</span>}
        {application.interviewCount > 0 && (
          <span>
            {application.interviewCount} interview{application.interviewCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {application.notes && <p className="notes">{application.notes}</p>}
    </article>
  )
}
