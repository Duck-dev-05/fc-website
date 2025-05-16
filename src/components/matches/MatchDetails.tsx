'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import {
  CheckCircleIcon,
  UserIcon,
  UsersIcon,
  CloudIcon,
  TvIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

interface MatchDetailsProps {
  match: Match
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 flex flex-col items-center">
      <div className="max-w-2xl w-full animate-fade-in bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl border border-blue-100 p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3 text-blue-900 flex items-center justify-center gap-3 drop-shadow-lg">
            <TrophyIcon className="w-10 h-10 text-yellow-500 inline" />
            {match.competition}
          </h1>
          <p className="text-gray-500 text-lg">{formattedDate}</p>
          <p className="text-gray-500 text-lg">{match.time}</p>
        </div>
        <div className="border-b border-blue-100 mb-8"></div>
        {/* Teams and Score */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold mb-2 text-blue-800 drop-shadow">{match.homeTeam}</h2>
          </div>
          <div className="px-8 text-2xl font-bold text-gray-400">vs</div>
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold mb-2 text-blue-800 drop-shadow">{match.awayTeam}</h2>
          </div>
        </div>
        {match.score && (
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-200 text-blue-900 text-6xl font-extrabold px-12 py-4 rounded-2xl shadow-lg border-4 border-blue-300">
              {match.score}
            </span>
          </div>
        )}
        {/* Venue */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold mb-2 text-gray-700 flex items-center justify-center gap-2">
            <ClipboardDocumentListIcon className="w-7 h-7 text-blue-400" />
            Venue
          </h3>
          <p className="text-gray-600 text-lg">{match.venue}</p>
        </div>
        <div className="border-b border-blue-100 mb-10"></div>

        {/* Scheduled Info Section */}
        {(!match.status || match.status === 'Scheduled') && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center shadow-sm">
              <p className="text-blue-800 text-lg font-semibold mb-2">This match is scheduled.</p>
              <p className="text-blue-700 text-sm">Stay tuned for updates on lineups, tickets, and more! Check back closer to the match date for the latest information.</p>
            </div>
          </div>
        )}

        {/* Line-up Section */}
        {(match.homeLineup || match.awayLineup) && (
          <div className="mb-12 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl p-8 shadow-xl border border-blue-200 transition hover:shadow-2xl">
              <div className="flex flex-col items-center mb-6">
                <h3 className="text-3xl font-extrabold text-blue-700 flex items-center gap-3 tracking-wide animate-fade-in">
                  <UsersIcon className="w-8 h-8 text-blue-500" />
                  Team Lineups
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full mt-3 mb-3" />
              </div>
              <div className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  {/* Home Team Lineup */}
                  <div className="md:pr-8">
                    <h4 className="text-xl font-bold text-center text-blue-800 mb-4 border-b pb-2 tracking-wide uppercase">{match.homeTeam}</h4>
                    <ul className="space-y-2">
                      {match.homeLineup && match.homeLineup.length > 0 ? (
                        match.homeLineup.map((player, idx) => {
                          let icon = '';
                          let badgeColor = 'bg-gray-200 text-gray-700';
                          if (player.position === 'GK') { icon = '🧤'; badgeColor = 'bg-red-100 text-red-700'; }
                          else if (["CB", "RB", "LB", "CDM"].includes(player.position)) { icon = '🛡️'; badgeColor = 'bg-blue-100 text-blue-700'; }
                          else if (["RW", "LW", "AMF"].includes(player.position)) { icon = '⚡'; badgeColor = 'bg-yellow-100 text-yellow-700'; }
                          else if (["CF"].includes(player.position)) { icon = '🎯'; badgeColor = 'bg-green-100 text-green-700'; }
                          else { icon = '⚽'; badgeColor = 'bg-gray-100 text-gray-500'; }
                          return (
                            <li key={idx} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 hover:bg-blue-100 hover:shadow-lg transition transform hover:scale-[1.04] shadow-sm border border-blue-100">
                              <span className="text-xl">{icon}</span>
                              <span className="font-semibold text-gray-800">{player.name}</span>
                              <span className={`ml-auto px-2 py-0.5 rounded-full font-mono text-xs font-bold ${badgeColor} hover:shadow-md transition`}>{player.position}</span>
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-gray-400 text-center">No lineup available</li>
                      )}
                    </ul>
                  </div>
                  {/* Vertical Divider */}
                  <div className="hidden md:block border-l border-blue-200 h-full mx-2"></div>
                  {/* Away Team Lineup */}
                  <div className="md:pl-8">
                    <h4 className="text-xl font-bold text-center text-blue-800 mb-4 border-b pb-2 tracking-wide uppercase">{match.awayTeam}</h4>
                    <ul className="space-y-2">
                      {match.awayLineup && match.awayLineup.length > 0 ? (
                        match.awayLineup.map((player, idx) => {
                          let icon = '';
                          let badgeColor = 'bg-gray-200 text-gray-700';
                          if (player.position === 'GK') { icon = '🧤'; badgeColor = 'bg-red-100 text-red-700'; }
                          else if (["CB", "RB", "LB", "CDM"].includes(player.position)) { icon = '🛡️'; badgeColor = 'bg-blue-100 text-blue-700'; }
                          else if (["RW", "LW", "AMF"].includes(player.position)) { icon = '⚡'; badgeColor = 'bg-yellow-100 text-yellow-700'; }
                          else if (["CF"].includes(player.position)) { icon = '🎯'; badgeColor = 'bg-green-100 text-green-700'; }
                          else { icon = '⚽'; badgeColor = 'bg-gray-100 text-gray-500'; }
                          return (
                            <li key={idx} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 hover:bg-blue-100 hover:shadow-lg transition transform hover:scale-[1.04] shadow-sm border border-blue-100">
                              <span className="text-xl">{icon}</span>
                              <span className="font-semibold text-gray-800">{player.name}</span>
                              <span className={`ml-auto px-2 py-0.5 rounded-full font-mono text-xs font-bold ${badgeColor} hover:shadow-md transition`}>{player.position}</span>
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-gray-400 text-center">No lineup available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match Details Section */}
        {(match.referee ||
          match.attendance ||
          match.weather ||
          match.description ||
          match.manOfTheMatch ||
          match.stadiumCapacity ||
          match.tvBroadcast ||
          match.status ||
          match.goalScorers ||
          match.cards ||
          match.notes) && (
          <div className="mb-12 animate-fade-in">
            <div className="relative bg-white/95 rounded-2xl p-8 shadow-2xl border border-blue-200 transition hover:shadow-2xl overflow-hidden">
              {/* Timeline accent */}
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-100 rounded-full opacity-60 hidden sm:block"></div>
              <div className="flex flex-col items-center mb-6">
                <h3 className="text-3xl font-extrabold text-blue-700 flex items-center gap-3 tracking-wide animate-fade-in">
                  <StarIcon className="w-8 h-8 text-yellow-400" />
                  Match Details
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full mt-3 mb-3" />
              </div>
              <div className="space-y-5 text-gray-800 text-center text-lg">
                {match.status && (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <span className="font-semibold">Status:</span>
                    <span className="text-green-700 font-bold">{match.status}</span>
                  </div>
                )}
                {match.manOfTheMatch && (
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon className="w-6 h-6 text-blue-700" />
                    <span className="font-semibold">Man of the Match:</span>
                    <span className="text-blue-800 font-bold">{match.manOfTheMatch}</span>
                  </div>
                )}
                {match.goalScorers && (
                  <div>
                    <span className="font-semibold">Goal Scorers:</span> <span className="text-gray-700">{match.goalScorers}</span>
                  </div>
                )}
                {match.cards && (
                  <div className="flex items-center justify-center gap-2">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                    <span className="font-semibold">Cards:</span> <span className="text-yellow-800">{match.cards}</span>
                  </div>
                )}
                {match.referee && (
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon className="w-6 h-6 text-gray-500" />
                    <span className="font-semibold">Referee:</span> <span className="text-gray-700">{match.referee}</span>
                  </div>
                )}
                {match.attendance && (
                  <div className="flex items-center justify-center gap-2">
                    <UsersIcon className="w-6 h-6 text-blue-500" />
                    <span className="font-semibold">Attendance:</span> <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">{match.attendance.toLocaleString()}</span>
                  </div>
                )}
                {match.stadiumCapacity && (
                  <div className="flex items-center justify-center gap-2">
                    <UsersIcon className="w-6 h-6 text-gray-400" />
                    <span className="font-semibold">Stadium Capacity:</span> <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-mono">{match.stadiumCapacity.toLocaleString()}</span>
                  </div>
                )}
                {match.weather && (
                  <div className="flex items-center justify-center gap-2">
                    <CloudIcon className="w-6 h-6 text-blue-400" />
                    <span className="font-semibold">Weather:</span> <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-mono">{match.weather}</span>
                  </div>
                )}
                {match.tvBroadcast && (
                  <div className="flex items-center justify-center gap-2">
                    <TvIcon className="w-6 h-6 text-purple-500" />
                    <span className="font-semibold">TV Broadcast:</span> <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-mono">{match.tvBroadcast}</span>
                  </div>
                )}
                {match.description && (
                  <div>
                    <span className="font-semibold">Description:</span> <span className="text-gray-700">{match.description}</span>
                  </div>
                )}
                {match.notes && (
                  <div>
                    <span className="font-semibold">Notes:</span> <span className="text-gray-700">{match.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mt-12">
          <Link
            href="/matches"
            className="bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors shadow text-lg font-semibold"
          >
            Back to Matches
          </Link>
          <Link
            href={`/tickets?match=${match.id}`}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow text-lg font-semibold"
          >
            Buy Tickets
          </Link>
        </div>
      </div>
    </div>
  )
} 