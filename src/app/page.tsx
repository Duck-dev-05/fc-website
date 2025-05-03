'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { matchApi, Match } from '@/services/api'
import Image from 'next/image'

const sliderImages = [
  "/src/asset/image/z6087575494598_87ab786058a0e1cbc9c915cbb42d1ca1.jpg",
  "/src/asset/image/z6087575487897_c240c4136fbe9e856d64f7be0811014d.jpg",
  "/src/asset/image/z6087575482857_d05b45fd9decd52881f7b8aefc060cf2.jpg",
]

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)

  const nextSlide = () => setCurrent((prev) => (prev + 1) % sliderImages.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)

  useEffect(() => {
    const fetchNextMatch = async () => {
      try {
        const response = await matchApi.getAll()
        // Get the next upcoming match
        const upcomingMatches = response.data
          .filter((match: Match) => new Date(match.date) > new Date())
          .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        setNextMatch(upcomingMatches[0] || null)
      } catch (err) {
        console.error('Error fetching next match:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNextMatch()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:rounded-3xl md:mx-4 md:mt-6 overflow-hidden shadow-xl">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/Team.jpg"
            alt="Team background"
            fill
            className="object-cover w-full h-full blur-sm scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 via-blue-600/60 to-blue-400/50" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container-custom h-full flex flex-col justify-center items-center text-white text-center relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">Welcome to Our Football Club</h1>
          <p className="text-xl mb-8 max-w-2xl drop-shadow">
            Join us in celebrating the beautiful game. Experience the passion, the excitement, and the community of football.
          </p>
          <div className="flex gap-4">
            <Link href="/matches" className="btn-primary">
              View Matches
            </Link>
            <Link href="/tickets" className="btn-secondary">
              Buy Tickets
            </Link>
          </div>
        </div>
      </section>

      {/* Next Match Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Next Match</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : nextMatch ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="text-2xl font-semibold mb-2">{nextMatch.competition}</h3>
                    <p className="text-gray-600">
                      {nextMatch.date} at {nextMatch.time}
                    </p>
                    <p className="text-gray-600">{nextMatch.venue}</p>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-xl font-bold">{nextMatch.homeTeam}</p>
                    </div>
                    <div className="text-gray-400 text-xl">vs</div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{nextMatch.awayTeam}</p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/tickets?match=${nextMatch.id}`}
                    className="btn-primary mt-6 md:mt-0"
                  >
                    Get Tickets
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              No upcoming matches scheduled
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Club Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-blue-600 text-4xl mb-4">🏟️</div>
              <h3 className="text-xl font-semibold mb-2">Modern Stadium</h3>
              <p className="text-gray-600">
                Experience matches in our state-of-the-art stadium with premium facilities.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-blue-600 text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2">Easy Ticketing</h3>
              <p className="text-gray-600">
                Book your tickets online with our simple and secure ticketing system.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-blue-600 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Fan Community</h3>
              <p className="text-gray-600">
                Join our vibrant fan community and be part of the club's journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Become a member and get exclusive access to match tickets, club events, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/membership" className="btn-primary">
              Become a Member
            </Link>
            <Link href="/news" className="btn-secondary">
              Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
