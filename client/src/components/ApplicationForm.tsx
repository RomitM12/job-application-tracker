import { useState, type FormEvent } from 'react'
import type { NewApplication } from '../api'
import { STATUSES, STATUS_LABELS } from '../types'

// Today's date as YYYY-MM-DD in the user's local timezone.
// (toISOString() alone uses UTC, which can be tomorrow's date in the evening.)
function today() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

const emptyForm = (): NewApplication => ({
  company: '',
  role: '',
  status: 'applied',
  appliedDate: today(),
  notes: '',
})

// A "controlled" form: React state holds every field's value, and each input shows that state.
export function ApplicationForm({ onCreate }: { onCreate: (data: NewApplication) => Promise<void> }) {
  const [form, setForm] = useState<NewApplication>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Update one field, keeping the others (...form copies the old values).
  function update<K extends keyof NewApplication>(field: K, value: NewApplication[K]) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault() // stop the browser's default full-page reload
    setSaving(true)
    try {
      await onCreate(form)
      setForm(emptyForm()) // clear the form after a successful save
    } catch {
      // App already shows the error message; keep the typed values so the user can fix them.
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        placeholder="Company *"
        value={form.company}
        onChange={(e) => update('company', e.target.value)}
        required
      />
      <input
        placeholder="Role *"
        value={form.role}
        onChange={(e) => update('role', e.target.value)}
        required
      />
      <select
        value={form.status}
        onChange={(e) => update('status', e.target.value as NewApplication['status'])}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={form.appliedDate}
        onChange={(e) => update('appliedDate', e.target.value)}
      />
      <input
        className="notes-input"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => update('notes', e.target.value)}
      />
      <button type="submit" disabled={saving}>
        {saving ? 'Adding…' : 'Add application'}
      </button>
    </form>
  )
}
