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
        .then(data => setMatches(data))
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
          onClick={() => router.push('/login')}
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Matches</h1>
      <MatchList matches={matches} />
    </div>
  )
} 