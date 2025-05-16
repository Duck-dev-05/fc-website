'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Spinner from '@/components/Spinner'
import MatchDetails from '@/components/matches/MatchDetails'
import { Match } from '@/types/match'

export default function MatchPage() {
  const params = useParams<{ id: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/matches/${params.id}`)
      .then(res => res.json())
      .then(data => setMatch(data))
      .finally(() => setLoading(false))
  }, [params?.id])

  if (loading) return <Spinner />
  if (!match || (match && (match as any).error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">⚽️</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-700">Match not found</h2>
        <p className="text-gray-500 mb-6">The match you are looking for does not exist or has been removed.</p>
        <a href="/matches" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Back to Matches</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MatchDetails match={match} />
    </div>
  )
} 