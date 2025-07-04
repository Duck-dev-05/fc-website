export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  competition: string
  score?: string | null
  referee?: string | null
  attendance?: number | null
  weather?: string | null
  description?: string | null
  manOfTheMatch?: string | null
  stadiumCapacity?: number | null
  tvBroadcast?: string | null
  status?: string
  goalScorers?: string | null
  cards?: string | null
  notes?: string | null
  homeLineup?: { name: string; position: string }[] | null
  awayLineup?: { name: string; position: string }[] | null
  createdAt: string
  updatedAt: string
} 