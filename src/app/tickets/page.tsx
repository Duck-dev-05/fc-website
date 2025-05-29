'use client'

import { Suspense } from 'react'
import RecentMatches from '@/components/matches/RecentMatches'

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading recent matches...</p>
        </div>
      </div>
    }>
      <RecentMatches />
    </Suspense>
  )
} 