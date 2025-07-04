'use client'

import { useEffect, useState } from 'react'
import MatchList from '@/components/matches/MatchList'
import Spinner from '@/components/Spinner'
import { Match } from '@/types/match'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TrophyIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function MatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/matches')
        .then(res => res.json())
        .then(data => {
          setMatches(data);
          console.log('Fetched matches:', data); // Debug log
        })
        .finally(() => setLoading(false))
    }
  }, [status])

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <Spinner />
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="mb-4">You must be logged in to view matches.</p>
        <button
          onClick={() => router.push('/auth/signin')}
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Matches</h1>
      {/* Upcoming Match */}
      {matches.filter(m => m.status === 'Upcoming').length > 0 ? (
        <section className="mb-12 p-6 bg-yellow-50 rounded-2xl shadow border border-yellow-200">
          <div className="flex items-center mb-4">
            <TrophyIcon className="h-7 w-7 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-semibold text-yellow-800">Upcoming Match</h2>
          </div>
          <MatchList matches={matches.filter(m => m.status === 'Upcoming')} />
        </section>
      ) : (
        <section className="mb-12 p-6 bg-yellow-50 rounded-2xl shadow border border-yellow-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrophyIcon className="h-6 w-6 text-yellow-400 mr-2" />
            <span className="text-lg text-yellow-700 font-medium">No upcoming match</span>
          </div>
        </section>
      )}
      {/* Scheduled Matches */}
      {matches.filter(m => m.status === 'Scheduled').length > 0 ? (
        <section className="mb-12 p-6 bg-blue-50 rounded-2xl shadow border border-blue-200">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-semibold text-blue-800">Scheduled Matches</h2>
          </div>
          <MatchList matches={matches.filter(m => m.status === 'Scheduled')} />
        </section>
      ) : (
        <section className="mb-12 p-6 bg-blue-50 rounded-2xl shadow border border-blue-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <CalendarIcon className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-lg text-blue-700 font-medium">No scheduled matches</span>
          </div>
        </section>
      )}
      {/* Finished Matches */}
      {matches.filter(m => m.status === 'Finished').length > 0 ? (
        <section className="mb-12 p-6 bg-green-50 rounded-2xl shadow border border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-semibold text-green-800">Finished Matches</h2>
          </div>
          <MatchList matches={matches.filter(m => m.status === 'Finished')} />
        </section>
      ) : (
        <section className="mb-12 p-6 bg-green-50 rounded-2xl shadow border border-green-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-lg text-green-700 font-medium">No finished matches</span>
          </div>
        </section>
      )}
      {/* Show all if no matches are found by status */}
      {matches.length > 0 && matches.filter(m => m.status === 'Upcoming').length === 0 && matches.filter(m => m.status === 'Scheduled').length === 0 && matches.filter(m => m.status === 'Finished').length === 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">All Matches (No Status)</h2>
          <MatchList matches={matches} />
        </div>
      )}
    </div>
  )
} 