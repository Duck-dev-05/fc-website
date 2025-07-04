"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';
import { Match } from '@/types/match';

export default function RecentMatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/matches/${params.id}`)
      .then(res => res.json())
      .then(data => setMatch(data))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <Spinner />;
  if (!match || (match && (match as any).error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">⚽️</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-700">Match not found</h2>
        <p className="text-gray-500 mb-6">The match you are looking for does not exist or has been removed.</p>
        <a href="/recent-matches" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Back to Recent Matches</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full border border-blue-100 flex flex-col items-center">
        <span className="px-5 py-2 rounded-full text-base font-bold shadow mb-6 tracking-wide uppercase bg-green-100 text-green-700">Finished</span>
        <h2 className="text-4xl font-extrabold mb-2 text-blue-900 text-center drop-shadow">{match.homeTeam} <span className="text-blue-400">vs</span> {match.awayTeam}</h2>
        <div className="text-xl text-blue-700 font-semibold mb-4">{match.competition}</div>
        <div className="w-full border-t border-gray-200 my-4" />
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="text-gray-500 text-base">{new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="text-gray-500 text-base">Kickoff: <span className="font-semibold text-blue-800">{match.time}</span></div>
          <div className="text-gray-500 text-base">Venue: {match.venue}</div>
        </div>
        <div className="w-full border-t border-gray-200 my-4" />
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-3xl font-bold text-green-700 bg-green-50 px-6 py-2 rounded-lg shadow-inner">{match.score}</span>
        </div>
        {/* Add more match details here if needed */}
      </div>
      <a href="/recent-matches" className="mt-8 bg-blue-600 text-white py-2 px-8 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow text-lg">Back to Recent Matches</a>
    </div>
  );
} 