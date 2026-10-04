// These types mirror the JSON the API sends back, so TypeScript can check our UI code.

export type Status = 'applied' | 'interviewing' | 'offer' | 'rejected'

export const STATUSES: Status[] = ['applied', 'interviewing', 'offer', 'rejected']

export const STATUS_LABELS: Record<Status, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

export interface Application {
  id: number
  role: string
  status: Status
  appliedDate: string | null
  notes: string | null
  companyId: number
  company: string
  interviewCount: number
}
