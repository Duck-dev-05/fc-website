
'use client'

import { Match } from '@/types/match'
import Link from 'next/link'

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 border border-blue-100 relative">
      {/* Status/Plan Badge */}
      <Link
        href={`/matches/${match.id}`}
        className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-sm font-bold shadow-md transition-colors
          ${match.status === 'Cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
            match.status === 'Finished' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
            match.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
            'bg-blue-100 text-blue-700 hover:bg-blue-200'}
        `}
        style={{ letterSpacing: '0.03em' }}
        title={`Status: ${match.status}`}
        aria-label={`Status: ${match.status}`}
      >
        {match.status}
      </Link>
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <span className="text-sm font-medium text-gray-500">
            {match.competition}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="font-extrabold text-xl md:text-2xl">{match.homeTeam}</p>
          </div>
          <div className="px-4 text-gray-400">vs</div>
          <div className="text-center flex-1">
            <p className="font-extrabold text-xl md:text-2xl">{match.awayTeam}</p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>{formattedDate}</p>
          <p>{match.time}</p>
          <p className="mt-1">{match.venue}</p>
        </div>

        {match.score && (
          <div className="text-center font-extrabold text-3xl text-blue-900 my-2">
            {match.score}
          </div>
        )}

        <Link
          href={`/matches/${match.id}`}
          className="mt-4 text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg shadow"
        >
          View Details
        </Link>
      </div>
    </div>
  )
} 