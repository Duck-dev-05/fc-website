'use client'

import { useEffect, useState } from 'react'
import MatchList from '@/components/matches/MatchList'
import Spinner from '@/components/Spinner'
import { Match } from '@/types/match'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
      <h1 className="text-3xl font-bold mb-8">Matches</h1>
      {/* Upcoming Matches */}
      {matches.filter(m => m.status === 'Scheduled').length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Matches</h2>
          <MatchList matches={matches.filter(m => m.status === 'Scheduled')} />
        </>
      )}
      {/* Finished Matches */}
      {matches.filter(m => m.status === 'Finished').length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Finished Matches</h2>
          <MatchList matches={matches.filter(m => m.status === 'Finished')} />
        </div>
      )}
      {/* Show all if no matches are found by status */}
      {matches.length > 0 && matches.filter(m => m.status === 'Scheduled').length === 0 && matches.filter(m => m.status === 'Finished').length === 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">All Matches (No Status)</h2>
          <MatchList matches={matches} />
        </div>
      )}
    </div>
  )
} 