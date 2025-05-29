'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { matchApi, Match } from '@/services/api'
import Image from 'next/image'

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

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
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src="/Team.jpg"
          alt="FC Escuela Team"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            FC ESCUELA
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center mb-12">
            More than a club - a community united by passion for football
          </p>
          <div className="flex gap-4">
            <Link href="/matches" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium">
              View Matches
            </Link>
            <Link href="/about" className="border border-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Next Match */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Next Match</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : nextMatch ? (
            <div className="bg-gray-50 rounded-xl p-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
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
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold">{nextMatch.homeTeam.charAt(0)}</span>
                    </div>
                    <p className="font-medium">{nextMatch.homeTeam}</p>
                  </div>

                  <span className="text-2xl font-bold">vs</span>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold">{nextMatch.awayTeam.charAt(0)}</span>
                    </div>
                    <p className="font-medium">{nextMatch.awayTeam}</p>
                  </div>
                </div>

                <Link
                  href={`/matches/${nextMatch.id}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Details
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No upcoming matches scheduled</p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl">
              <div className="text-4xl mb-4">🏟️</div>
              <h3 className="text-xl font-bold mb-4">Professional Facilities</h3>
              <p className="text-gray-600">State-of-the-art training grounds and match facilities</p>
            </div>

            <div className="bg-white p-8 rounded-xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-4">Strong Community</h3>
              <p className="text-gray-600">Join our passionate community of football lovers</p>
            </div>

            <div className="bg-white p-8 rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Expert Coaching</h3>
              <p className="text-gray-600">Learn from experienced and qualified coaches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Gallery</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "/images/476090611_607359335376923_6698951151074247924_n.jpg",
              "/images/475848156_607359262043597_4715828726527841259_n.jpg", 
              "/images/475969919_607359408710249_8516488549860876522_n.jpg"
            ].map((src, i) => (
              <div key={i} className="aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/gallery" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              View More
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Join FC Escuela Today</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Be part of our growing football family and take your game to the next level
          </p>
          <Link href="/join" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100">
            Become a Member
          </Link>
        </div>
      </section>
    </main>
  )
}
