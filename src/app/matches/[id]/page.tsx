'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Spinner from '@/components/Spinner'
import MatchDetails from '@/components/matches/MatchDetails'
import { Match } from '@/types/match'

export default function MatchPage() {
  const params = useParams<{ id: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  // Countdown and calendar/map logic hooks (always defined)
  const kickoff = match ? new Date(match.date) : new Date();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const diff = match ? kickoff.getTime() - now.getTime() : 0;
  const countdown = useMemo(() => {
    if (!match) return '';
    if (diff <= 0) return 'Kickoff time!';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [diff, match]);
  const calendarUrl = useMemo(() => {
    if (!match || !match.date || isNaN(new Date(match.date).getTime())) return '#';
    // Use only match.date, which is already an ISO string
    const start = new Date(match.date).toISOString().replace(/[-:]|\.\d{3}/g, '');
    const end = new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]|\.\d{3}/g, '');
    const details = encodeURIComponent(`Watch ${match.homeTeam} vs ${match.awayTeam} at ${match.venue}`);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(match.homeTeam + ' vs ' + match.awayTeam)}&dates=${start}/${end}&details=${details}&location=${encodeURIComponent(match.venue)}`;
  }, [match]);
  const mapsUrl = match ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.venue)}` : '#';

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

  if (match.status === 'Upcoming' || match.status === 'Scheduled') {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center min-h-[80vh]">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full border border-blue-100 flex flex-col items-center">
          <span className={`px-5 py-2 rounded-full text-base font-bold shadow mb-6 tracking-wide uppercase ${match.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{match.status}</span>
          <h2 className="text-4xl font-extrabold mb-2 text-blue-900 text-center drop-shadow">{match.homeTeam} <span className="text-blue-400">vs</span> {match.awayTeam}</h2>
          <div className="text-xl text-blue-700 font-semibold mb-4">{match.competition}</div>
          <div className="w-full border-t border-gray-200 my-4" />
          <div className="flex flex-col items-center gap-1 mb-4">
            <div className="text-gray-500 text-base">{new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-gray-500 text-base">Kickoff: <span className="font-semibold text-blue-800">{match.time}</span></div>
            <div className="text-gray-500 text-base">Venue: <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700 font-medium">{match.venue}</a></div>
          </div>
          <div className="w-full border-t border-gray-200 my-4" />
          <div className="bg-blue-50 rounded-lg p-4 text-center text-blue-700 font-medium mb-4 text-base">
            {match.status === 'Upcoming' ? (
              <>This match is upcoming. Stay tuned for updates and check back closer to the match date for more information.</>
            ) : (
              <>This match is scheduled. Details will be available after the match is completed.</>
            )}
          </div>
          <div className="flex flex-col items-center gap-4 w-full mt-2">
            <div className="text-lg font-semibold text-blue-800 bg-blue-100 px-4 py-2 rounded-lg shadow-inner">Kickoff Countdown: <span className="font-mono text-blue-900">{countdown}</span></div>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors text-base w-full text-center">Add to Google Calendar</a>
          </div>
        </div>
        <a href="/matches" className="mt-8 bg-blue-600 text-white py-2 px-8 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow text-lg">Back to Matches</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MatchDetails match={match} />
    </div>
  )
} 