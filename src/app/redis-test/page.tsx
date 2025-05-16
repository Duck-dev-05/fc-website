'use client';

import { useState, useEffect } from 'react';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

interface Ticket {
  id: number;
  matchId: number;
  userId: number;
  quantity: number;
  category: string;
  purchaseDate: string;
  match: Match;
}

interface Membership {
  id: number;
  userId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  user: {
    username: string;
    email: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
}

type DataType = 'matches' | 'tickets' | 'memberships' | 'team';

export default function RedisTest() {
  const [dataType, setDataType] = useState<DataType>('matches');
  const [matches, setMatches] = useState<Match[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const fetchData = async (type: DataType) => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    try {
      const response = await fetch(`/api/redis-test?type=${type}`);
      const result = await response.json();

      if (response.ok) {
        if (result.data) {
          switch (type) {
            case 'matches':
              setMatches(result.data.matches || []);
              break;
            case 'tickets':
              setTickets(result.data.tickets || []);
              break;
            case 'memberships':
              setMemberships(result.data.memberships || []);
              break;
            case 'team':
              setTeam(result.data.team || []);
              break;
          }
          setCacheStatus(result.message);
        } else {
          setError('No data received');
          setErrorDetails('The API response did not contain data');
        }
      } else {
        setError(result.error || 'Failed to fetch data');
        setErrorDetails(result.details || 'Unknown error occurred');
      }
    } catch (err) {
      setError('Failed to fetch data');
      setErrorDetails(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async (type: DataType) => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    try {
      const response = await fetch('/api/redis-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      const result = await response.json();
      
      if (response.ok) {
        switch (type) {
          case 'matches':
            setMatches([]);
            break;
          case 'tickets':
            setTickets([]);
            break;
          case 'memberships':
            setMemberships([]);
            break;
          case 'team':
            setTeam([]);
            break;
        }
        setCacheStatus('Cache cleared');
        alert(`${type} cache cleared successfully`);
      } else {
        setError(result.error || 'Failed to clear cache');
        setErrorDetails(result.details || 'Unknown error occurred');
      }
    } catch (err) {
      setError('Failed to clear cache');
      setErrorDetails(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dataType);
  }, [dataType]);

  const renderData = () => {
    switch (dataType) {
      case 'matches':
        return matches.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Matches</h2>
            <div className="grid gap-4">
              {matches.map((match) => (
                <div key={match.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium">
                      {match.homeTeam} vs {match.awayTeam}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString()} at {match.time}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Venue: {match.venue}
                  </div>
                  <div className="text-sm text-gray-600">
                    Competition: {match.competition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'tickets':
        return tickets.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Tickets</h2>
            <div className="grid gap-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium">
                      {ticket.match.homeTeam} vs {ticket.match.awayTeam}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(ticket.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Category: {ticket.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    Quantity: {ticket.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'memberships':
        return memberships.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Memberships</h2>
            <div className="grid gap-4">
              {memberships.map((membership) => (
                <div key={membership.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium">
                      {membership.user.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {membership.type}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Status: {membership.status}
                  </div>
                  <div className="text-sm text-gray-600">
                    Period: {new Date(membership.startDate).toLocaleDateString()} - {new Date(membership.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'team':
        return team.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="grid gap-4">
              {team.map((member) => (
                <div key={member.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="text-lg font-medium mb-2">
                    {member.name} <span className="text-sm text-gray-500">({member.role})</span>
                  </div>
                  {member.image && (
                    <img src={member.image} alt={member.name} className="w-16 h-16 object-cover rounded-full mb-2" />
                  )}
                  <div className="text-sm text-gray-600 mb-2">
                    {member.bio}
                  </div>
                  <div className="text-xs text-gray-400">Order: {member.order}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Redis Cache Test</h1>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataType)}
              className="px-4 py-2 border rounded"
            >
              <option value="matches">Matches</option>
              <option value="tickets">Tickets</option>
              <option value="memberships">Memberships</option>
              <option value="team">Team</option>
            </select>

            <button
              onClick={() => fetchData(dataType)}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
            
            <button
              onClick={() => clearCache(dataType)}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Clear Cache
            </button>
          </div>

          {loading && (
            <div className="p-4 bg-blue-100 text-blue-700 rounded">
              Loading data...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              <div className="font-semibold">{error}</div>
              {errorDetails && (
                <div className="mt-2 text-sm">{errorDetails}</div>
              )}
            </div>
          )}

          {cacheStatus && !error && (
            <div className="p-4 bg-blue-100 text-blue-700 rounded">
              {cacheStatus}
            </div>
          )}

          {!loading && !error && renderData()}

          {!loading && !error && !renderData() && (
            <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 