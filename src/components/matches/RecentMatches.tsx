'use client'

import { useState, useEffect } from 'react'
import { Match } from '@/types/match'
import MatchCard from './MatchCard'

export default function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        // Sort matches by date in descending order and take the most recent ones
        const sortedMatches = data.sort((a: Match, b: Match) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 6) // Show last 6 matches
        setMatches(sortedMatches)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading recent matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Recent Matches</h1>
        <p className="mt-2 text-gray-600">View our most recent matches and their results.</p>
      </div>

      {matches.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recent matches found.</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <a
          href="/matches"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Matches
        </a>
      </div>
    </div>
  )
} 