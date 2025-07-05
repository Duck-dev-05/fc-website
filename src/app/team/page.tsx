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

// Role badge color map
const ROLE_COLORS: Record<string, string> = {
  GK: 'bg-red-100 text-red-700 border-red-300',
  CB: 'bg-blue-100 text-blue-700 border-blue-300',
  LB: 'bg-blue-50 text-blue-600 border-blue-200',
  RB: 'bg-blue-50 text-blue-600 border-blue-200',
  CDM: 'bg-purple-100 text-purple-700 border-purple-300',
  AMF: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  LW: 'bg-green-100 text-green-700 border-green-300',
  RW: 'bg-green-100 text-green-700 border-green-300',
  CF: 'bg-orange-100 text-orange-700 border-orange-300',
};

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
        setMembers(Array.isArray(data) ? data : data.team)
      } catch (err) {
        setError('Failed to load team members')
        console.error('Error fetching team:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

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

  // Sort: captain first, then by role order, then the rest A-Z
  const roleOrder = ['GK', 'CB', 'LB', 'RB', 'CDM', 'AMF', 'LW', 'RW', 'CF'];
  const sortedMembers = [...members].sort((a, b) => {
    if (a.captain && !b.captain) return -1;
    if (!a.captain && b.captain) return 1;
    if (a.captain && b.captain) return 0;
    const aRoleIdx = roleOrder.indexOf(a.role.toUpperCase());
    const bRoleIdx = roleOrder.indexOf(b.role.toUpperCase());
    if (aRoleIdx !== -1 && bRoleIdx !== -1) return aRoleIdx - bRoleIdx;
    if (aRoleIdx !== -1) return -1;
    if (bRoleIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  // Helper: get initials
  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center py-12 px-2 bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-gradient-x">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-lg">Our Team</h1>
        <p className="mt-3 text-gray-700 text-xl font-medium">Player list for FC ESCUELA</p>
      </div>
      <ul className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedMembers.map((member, idx) => (
          <li
            key={member.id || member.name}
            className={`flex flex-col items-center bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-7 border-2 transition-transform hover:scale-[1.04] hover:shadow-2xl group animate-fade-in relative ${member.captain ? 'border-yellow-400' : 'border-blue-100'}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {member.captain && (
              <span className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-full shadow-lg font-bold text-xs z-10">
                <FaStar className="text-white drop-shadow" /> Captain
              </span>
            )}
            <div className="flex-shrink-0 mb-3">
              {member.image ? (
                <img
                  src={`/avatars/${member.image}`}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg bg-white group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform duration-200"
                  style={{ background: member.captain ? 'linear-gradient(135deg, #facc15 60%, #fde68a 100%)' : '#60a5fa' }}>
                  {getInitials(member.name)}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center flex-1 min-w-0 mt-2">
              <span className="text-2xl font-bold text-gray-900 truncate drop-shadow-sm text-center">{member.name}</span>
              <span className={`inline-flex items-center gap-2 mt-3 px-4 py-1 text-base font-semibold rounded-full w-fit shadow border ${ROLE_COLORS[member.role.toUpperCase()] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
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