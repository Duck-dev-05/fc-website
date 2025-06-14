'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { matchApi, Match } from '@/services/api'
import Image from 'next/image'

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<any[]>([])
  const [teamStats, setTeamStats] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch next match
        const matchResponse = await matchApi.getAll()
        const upcomingMatches = matchResponse.data
          .filter((match: Match) => new Date(match.date) > new Date())
          .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        setNextMatch(upcomingMatches[0] || null)

        // Fetch latest news
        const newsResponse = await fetch('/api/news')
        const newsData = await newsResponse.json()
        setNews(newsData.slice(0, 3)) // Get latest 3 news items

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
    <main className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative h-[80vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 text-center">
            FC ESCUELA
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center mb-12">
            More than a club - a community united by passion for football
          </p>
          <div className="flex gap-4">
            <Link href="/matches" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors">
              View Matches
            </Link>
            <Link href="/tickets" className="border border-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors">
              Buy Tickets
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium">
              View All News →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <Image
                      src={article.imageUrl || '/images/default-news.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">{article.content}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{article.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Next Match Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Next Match</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : nextMatch ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">{nextMatch.competition}</h3>
                    <p className="text-gray-600">
                      {new Date(nextMatch.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600">{nextMatch.venue}</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold">{nextMatch.homeTeam.charAt(0)}</span>
                      </div>
                      <p className="font-medium">{nextMatch.homeTeam}</p>
                    </div>

                    <span className="text-3xl font-bold">vs</span>

                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold">{nextMatch.awayTeam.charAt(0)}</span>
                      </div>
                      <p className="font-medium">{nextMatch.awayTeam}</p>
                    </div>
                  </div>

                  <Link
                    href={`/matches/${nextMatch.id}`}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Match Details
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No upcoming matches scheduled</p>
          )}
        </div>
      </section>

      {/* Team Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Season Stats</h2>
          
          {teamStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Matches Played</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.played}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Goals Scored</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.goalsFor}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Goals Against</h3>
                <p className="text-3xl font-bold text-blue-600">{teamStats.goalsAgainst}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
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
