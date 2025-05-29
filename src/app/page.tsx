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

    // Auto-advance slider
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/Team.jpg"
            alt="Team background"
            fill
            className="object-cover w-full h-full transform scale-105 transition-transform duration-[2s] hover:scale-110"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-700/60" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container-custom h-full flex flex-col justify-center items-center text-white text-center relative z-10 px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-tight">
            Welcome to <span className="text-blue-400">FC ESCUELA</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow leading-relaxed">
            Join us in celebrating the beautiful game. Experience the passion, the excitement, and the community of football.
          </p>
          <div className="flex gap-6 animate-fade-in-up">
            <Link href="/matches" className="btn-primary text-lg px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300 bg-blue-600 hover:bg-blue-700">
              View Matches
            </Link>
            <Link href="/matches" className="btn-secondary text-lg px-8 py-3 rounded-full border-2 border-white hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
              Recent Matches
            </Link>
          </div>
        </div>
      </section>

      {/* Next Match Section with Glass Effect */}
      <section className="py-16 relative">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Next Match
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : nextMatch ? (
            <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-3 text-blue-800">{nextMatch.competition}</h3>
                    <p className="text-xl text-gray-600 mb-2">
                      {new Date(nextMatch.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-lg text-gray-500">{nextMatch.venue}</p>
                  </div>
                  
                  <div className="flex items-center space-x-12">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 mx-auto flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-800">{nextMatch.homeTeam.charAt(0)}</span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">{nextMatch.homeTeam}</p>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">VS</div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 mx-auto flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-800">{nextMatch.awayTeam.charAt(0)}</span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">{nextMatch.awayTeam}</p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/matches/${nextMatch.id}`}
                    className="btn-primary px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Match Details
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 text-xl">
              No upcoming matches scheduled
            </div>
          )}
        </div>
      </section>

      {/* Features Section with Modern Cards */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Club Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 border border-blue-100">
              <div className="text-blue-600 text-5xl mb-6">🏟️</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Modern Stadium</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience matches in our state-of-the-art stadium with premium facilities and amazing atmosphere.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 border border-blue-100">
              <div className="text-blue-600 text-5xl mb-6">🎫</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Easy Ticketing</h3>
              <p className="text-gray-600 leading-relaxed">
                Book your tickets online with our simple and secure ticketing system. Never miss a match.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300 border border-blue-100">
              <div className="text-blue-600 text-5xl mb-6">👥</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Fan Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Join our vibrant fan community and be part of the club's exciting journey forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with Modern Grid */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Club Gallery
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Relive our most memorable moments through our collection of match and event photos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "/images/476090611_607359335376923_6698951151074247924_n.jpg",
              "/images/475848156_607359262043597_4715828726527841259_n.jpg",
              "/images/475969919_607359408710249_8516488549860876522_n.jpg"
            ].map((src, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500">
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">Memorable Moment</h3>
                    <p className="text-sm opacity-90">Click to view full image</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/gallery" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-400 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Become a member and get exclusive access to match tickets, club events, and more.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/membership" className="px-8 py-3 rounded-full bg-white text-blue-600 font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              Become a Member
            </Link>
            <Link href="/news" className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
              Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
