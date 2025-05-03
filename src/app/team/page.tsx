'use client'

import { useState, useEffect } from 'react'
import { FaUserShield, FaStar } from 'react-icons/fa'

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  captain: boolean;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/team')
        if (!response.ok) throw new Error('Failed to fetch team members')
        const data = await response.json()
        setMembers(data)
      } catch (err) {
        setError('Failed to load team members')
        console.error('Error fetching team:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-gradient-x">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-gradient-x">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-lg max-w-lg mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">Error Loading Team</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center py-12 px-2 bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-gradient-x">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-lg">Our Team</h1>
        <p className="mt-3 text-gray-700 text-xl font-medium">Player list for FC ESCUELA</p>
      </div>
      <ul className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member, idx) => (
          <li
            key={member.id}
            className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-100 transition-transform hover:scale-[1.03] hover:shadow-2xl group animate-fade-in relative"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {member.captain && (
              <span className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-full shadow-lg font-bold text-xs z-10">
                <FaStar className="text-white drop-shadow" /> Captain
              </span>
            )}
            <div className="flex-shrink-0">
              <img
                src={member.image || '/default-player.png'}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg bg-white group-hover:scale-105 transition-transform duration-200"
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg width=\'96\' height=\'96\' xmlns=\'http://www.w3.org/2000/svg\'><rect width=\'100%\' height=\'100%\' fill=\'%23e0e7ef\'/><text x=\'50%\' y=\'54%\' font-size=\'32\' text-anchor=\'middle\' fill=\'%236b7280\' dy=\'.3em\'>👤</text></svg>';
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-center flex-1 min-w-0 mt-4">
              <span className="text-2xl font-bold text-gray-900 truncate drop-shadow-sm text-center">{member.name}</span>
              <span className="inline-flex items-center gap-2 mt-3 px-4 py-1 text-base font-semibold bg-blue-200/70 text-blue-900 rounded-full w-fit shadow border border-blue-300">
                <FaUserShield className="text-blue-500" />
                {member.role}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
} 