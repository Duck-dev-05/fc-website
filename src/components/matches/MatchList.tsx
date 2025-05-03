'use client'

import { Match } from '@/types/match'
import MatchCard from './MatchCard'

interface MatchListProps {
  matches: Match[]
}

export default function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matches scheduled at the moment.</p>
      </div>
    )
  }

  // Remove duplicates based on homeTeam, awayTeam, date, time, competition, and score
  const uniqueMatches = matches.filter((match, idx, arr) =>
    arr.findIndex(m =>
      m.homeTeam === match.homeTeam &&
      m.awayTeam === match.awayTeam &&
      m.date === match.date &&
      m.time === match.time &&
      m.competition === match.competition &&
      m.score === match.score
    ) === idx
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {uniqueMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
} 