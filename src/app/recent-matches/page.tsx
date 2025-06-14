'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RecentMatchesList from '@/components/matches/RecentMatchesList'
import Spinner from '@/components/Spinner'

export default function RecentMatchesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <Spinner />
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="mb-4">You must be logged in to view recent matches.</p>
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Recent Matches</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <RecentMatchesList />
        </div>
      </div>
    </div>
  )
} 