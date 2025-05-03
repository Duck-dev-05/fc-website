"use client";

import { useEffect, useState } from 'react';

type Match = {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score?: string | null;
};

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading matches...</div>;

  return (
    <ul>
      {matches.map(match => (
        <li key={match.id}>
          {match.homeTeam} vs {match.awayTeam} on {new Date(match.date).toLocaleDateString()} {match.score ? `(Score: ${match.score})` : ''}
        </li>
      ))}
    </ul>
  );
} 