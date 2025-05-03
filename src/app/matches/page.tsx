'use client'

import { useEffect, useState } from 'react'
import MatchList from '@/components/matches/MatchList'
import Spinner from '@/components/Spinner'
import { Match } from '@/types/match'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => setMatches(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Matches</h1>
      {loading ? <Spinner /> : <MatchList matches={matches} />}
    </div>
  )
} 