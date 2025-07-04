import React, { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import Link from 'next/link';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  score: string | null;
  daysAgo?: number;
}

const PAGE_SIZE = 10;

const RecentMatchesList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/recent-matches?page=1&limit=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setHasMore(data.length === PAGE_SIZE);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    setLoadingMore(true);
    fetch(`/api/recent-matches?page=${page + 1}&limit=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setMatches(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setHasMore(data.length === PAGE_SIZE);
      })
      .finally(() => setLoadingMore(false));
  };

  if (loading) return <Spinner />;

  if (!matches || matches.length === 0) {
    return <p className="text-center text-gray-500">No recent matches to display.</p>;
  }

  return (
    <>
      <ul className="space-y-4">
        {matches.map(match => (
          <li key={match.id}>
            <Link href={`/recent-matches/${match.id}`} className="block bg-white rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border border-gray-100 hover:shadow-lg hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-900 text-lg md:text-xl">{match.homeTeam}</span>
                  <span className="mx-1 text-gray-400 font-bold">vs</span>
                  <span className="font-extrabold text-blue-900 text-lg md:text-xl">{match.awayTeam}</span>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">{match.competition}</span>
                <span className="text-gray-500 text-sm">{match.venue}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                <span className="text-2xl font-bold text-green-700 bg-green-50 px-4 py-1 rounded-lg shadow-inner">{match.score}</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium ml-2">{new Date(match.date).toLocaleDateString()} ({match.daysAgo} days ago)</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
};

export default RecentMatchesList; 