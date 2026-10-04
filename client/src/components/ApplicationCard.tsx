import { STATUSES, STATUS_LABELS, type Application, type Status } from '../types'

interface Props {
  application: Application
  onStatusChange: (id: number, status: Status) => void
  onDelete: (id: number) => void
}

// A component is a function that takes props (inputs) and returns what to show.
// The card doesn't call the API itself: it tells the parent (App) what happened via callbacks.
export function ApplicationCard({ application, onStatusChange, onDelete }: Props) {
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

      <div className="card-actions">
        <select
          aria-label="Change status"
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          className="delete"
          onClick={() => {
            if (confirm(`Delete ${application.role} at ${application.company}?`)) {
              onDelete(application.id)
            }
          }}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
