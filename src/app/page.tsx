'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { matchApi, Match } from '@/services/api'
import Image from 'next/image'

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamStats, setTeamStats] = useState<any>(null)
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all matches
        const matchResponse = await matchApi.getAll()
        // Find all upcoming matches (status 'Upcoming')
        const upcoming = matchResponse.data.filter((match: Match) => match.status === 'Upcoming')
        setUpcomingMatches(upcoming)

        // Fetch recent finished matches (with score, sorted by date desc)
        const finishedMatches = matchResponse.data
          .filter((match: Match) => match.score && new Date(match.date) < new Date())
          .sort((a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setRecentMatches(finishedMatches.slice(0, 3))

        // Mock team stats (replace with actual API call)
        setTeamStats({
          played: 38,
          won: 28,
          drawn: 6,
          lost: 4,
          goalsFor: 85,
          goalsAgainst: 20,
          points: 90
        })
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      {/* Hero Section with Team Photo Background */}
      <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/Team.jpg"
          alt="Team photo background"
          fill
          priority
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 text-center drop-shadow-lg tracking-tight">
            FC ESCUELA
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl text-center mb-10 font-light drop-shadow">
            More than a club – a community united by passion for football
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/matches" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
              View Matches
            </Link>
            <Link href="/tickets" className="border border-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-300">
              Buy Tickets
            </Link>
          </div>
        </div>
      </section>

      {/* Next Match Section */}
      <section className="py-20 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-blue-800 tracking-tight">Upcoming Matches</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : upcomingMatches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 transition-shadow duration-300 hover:shadow-2xl">
                  <div className="p-8 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2 text-blue-700">{match.competition}</h3>
                        <p className="text-gray-600">
                          {new Date(match.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-500">{match.venue}</p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-2 border-blue-300">
                            <span className="text-2xl font-bold text-blue-700">{match.homeTeam.charAt(0)}</span>
                          </div>
                          <p className="font-medium text-blue-700">{match.homeTeam}</p>
                        </div>
                        <span className="text-3xl font-bold text-gray-400">vs</span>
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-2 border-blue-300">
                            <span className="text-2xl font-bold text-blue-700">{match.awayTeam.charAt(0)}</span>
                          </div>
                          <p className="font-medium text-blue-700">{match.awayTeam}</p>
                        </div>
                      </div>
                      <Link
                        href={`/matches/${match.id}`}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                      >
                        Match Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No upcoming matches scheduled</p>
          )}
        </div>
      </section>

      {/* Recent Matches Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Recent Matches</h2>
            <Link href="/recent-matches" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Recent Matches →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {recentMatches.length === 0 ? (
              <p className="text-gray-500 col-span-3">No recent matches to display.</p>
            ) : (
              recentMatches.map((match) => (
                <Link key={match.id} href={`/recent-matches/${match.id}`} className="group bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-blue-900 text-lg">{match.homeTeam}</span>
                    <span className="mx-1 text-gray-400 font-bold">vs</span>
                    <span className="font-bold text-blue-900 text-lg">{match.awayTeam}</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">{match.competition}</span>
                  <span className="text-gray-500 text-sm mb-2">{match.venue}</span>
                  <span className="text-2xl font-bold text-green-700 bg-green-50 px-4 py-1 rounded-lg shadow-inner mb-2">{match.score}</span>
                  <span className="text-gray-400 text-xs">{new Date(match.date).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Team Stats Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 via-white to-gray-50 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-blue-800 tracking-tight">Season Stats</h2>
          {teamStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Matches Played</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.played}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Goals Scored</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.goalsFor}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Goals Against</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.goalsAgainst}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Points</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.points}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Gallery</h2>
            <Link href="/gallery" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Photos →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "/images/476090611_607359335376923_6698951151074247924_n.jpg",
              "/images/475848156_607359262043597_4715828726527841259_n.jpg", 
              "/images/475969919_607359408710249_8516488549860876522_n.jpg"
            ].map((src, i) => (
              <div key={i} className="aspect-square relative overflow-hidden rounded-xl group">
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Join FC Escuela Today</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Be part of our growing football family and take your game to the next level
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/join" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Become a Member
            </Link>
            <Link href="/tickets" className="border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Buy Tickets
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
