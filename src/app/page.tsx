'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { matchApi, Match as BaseMatch } from '@/services/api'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaFutbol, FaTrophy, FaUsers, FaChartLine, FaUser, FaImages } from 'react-icons/fa';

// Tooltip component
function Tooltip({ text, children }: { text: string, children: React.ReactNode }) {
  return (
    <span className="relative group cursor-pointer">
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-3 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
        {text}
      </span>
    </span>
  );
}

export default function Home() {
  // Extend Match type to include status and score for local use
  type Match = BaseMatch & { status?: string; score?: string };
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamStats, setTeamStats] = useState<any>(null)
  const [teamCount, setTeamCount] = useState<number | null>(null)
  const [playerOfTheMonth, setPlayerOfTheMonth] = useState<any>(null)
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all matches
        const matchResponse = await matchApi.getAll();
        console.log('MATCHES:', matchResponse.data);
        setUpcomingMatches(matchResponse.data);
        setRecentMatches(matchResponse.data);
        // Fetch real team stats from API
        const statsRes = await fetch('/api/matches/stats')
        if (statsRes.ok) {
          const stats = await statsRes.json()
          setTeamStats(stats)
        } else {
          setTeamStats(null)
        }
        // Fetch team data from API
        const teamRes = await fetch('/api/team')
        if (teamRes.ok) {
          const teamData = await teamRes.json()
          // Always use the team API to get the player count
          let count = Array.isArray(teamData.team) ? teamData.team.length : (Array.isArray(teamData) ? teamData.length : null)
          setTeamCount(count)
          // Set player of the month if available
          if (teamData.playerOfTheMonth) setPlayerOfTheMonth(teamData.playerOfTheMonth)
        } else {
          setTeamCount(null)
          setPlayerOfTheMonth(null)
        }
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
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ 
                delay: 3500, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              speed={600}
              grabCursor={true}
              allowTouchMove={true}
              allowSlideNext={true}
              allowSlidePrev={true}
              className="!pb-12 upcoming-matches-swiper"
              style={{
                '--swiper-navigation-color': '#3b82f6',
                '--swiper-pagination-color': '#3b82f6',
              } as React.CSSProperties}
            >
              {upcomingMatches.map((match) => (
                <SwiperSlide key={match.id}>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col">
                    <div className="p-8 flex flex-col gap-6 flex-1">
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
                              <span className="text-2xl font-bold text-blue-700">{match.homeTeam?.charAt(0)}</span>
                            </div>
                            <p className="font-medium text-blue-700">{match.homeTeam}</p>
                          </div>
                          <span className="text-3xl font-bold text-gray-400">vs</span>
                          <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-2 border-blue-300">
                              <span className="text-2xl font-bold text-blue-700">{match.awayTeam?.charAt(0)}</span>
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
                </SwiperSlide>
              ))}
            </Swiper>
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
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{ 
              delay: 3500, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            speed={600}
            grabCursor={true}
            allowTouchMove={true}
            allowSlideNext={true}
            allowSlidePrev={true}
            className="!pb-12 recent-matches-swiper"
            style={{
              '--swiper-navigation-color': '#3b82f6',
              '--swiper-pagination-color': '#3b82f6',
            } as React.CSSProperties}
          >
            {recentMatches.map((match) => (
              <SwiperSlide key={match.id}>
                <Link href={`/recent-matches/${match.id}`} className="group bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-blue-900 text-lg">{match.homeTeam}</span>
                    <span className="mx-1 text-gray-400 font-bold">vs</span>
                    <span className="font-bold text-blue-900 text-lg">{match.awayTeam}</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">{match.competition}</span>
                  <span className="text-gray-500 text-sm mb-2">{match.venue}</span>
                  <span className="text-2xl font-bold text-green-700 bg-green-50 px-4 py-1 rounded-lg shadow-inner mb-2">{match.score || '-'}</span>
                  <span className="text-gray-400 text-xs">{new Date(match.date).toLocaleDateString()}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Team Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-yellow-50 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-800 tracking-tight">Season Stats</h2>
          {teamStats && (
            <div className="relative w-full">
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  480: { slidesPerView: 1, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 24 },
                  1024: { slidesPerView: 4, spaceBetween: 28 },
                  1280: { slidesPerView: 5, spaceBetween: 32 },
                }}
                navigation
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true,
                  renderBullet: function (index, className) {
                    return '<span class="' + className + ' bg-blue-500 opacity-60 hover:opacity-100 transition-opacity"></span>';
                  }
                }}
                modules={[Navigation, Pagination, Autoplay]}
                autoplay={{ 
                  delay: 4000, 
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                speed={800}
                effect="slide"
                grabCursor={true}
                allowTouchMove={true}
                allowSlideNext={true}
                allowSlidePrev={true}
                className="!pb-16 stats-swiper"
                style={{
                  '--swiper-navigation-color': '#3b82f6',
                  '--swiper-pagination-color': '#3b82f6',
                } as React.CSSProperties}
              >
                <SwiperSlide>
                  <Tooltip text="Total matches played this season">
                    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-200 flex flex-col items-center hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 relative group">
                      <FaChartLine className="text-blue-500 text-3xl mb-3 drop-shadow-lg" />
                      <h3 className="text-sm font-semibold text-gray-700 mb-1 tracking-wide text-center">Matches Played</h3>
                      <p className="text-3xl font-extrabold text-blue-700 drop-shadow-xl tracking-tight mb-1">{teamStats.played}</p>
                    </div>
                  </Tooltip>
                </SwiperSlide>
                <SwiperSlide>
                  <Tooltip text="Total goals scored by the team">
                    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-green-200 flex flex-col items-center hover:scale-105 hover:shadow-2xl hover:border-green-400 transition-all duration-300 relative group">
                      <FaFutbol className="text-green-500 text-3xl mb-3 drop-shadow-lg" />
                      <h3 className="text-sm font-semibold text-gray-700 mb-1 tracking-wide text-center">Goals Scored</h3>
                      <p className="text-3xl font-extrabold text-green-600 drop-shadow-xl tracking-tight mb-1">{teamStats.goalsFor}</p>
                    </div>
                  </Tooltip>
                </SwiperSlide>
                <SwiperSlide>
                  <Tooltip text="Total goals conceded by the team">
                    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-red-200 flex flex-col items-center hover:scale-105 hover:shadow-2xl hover:border-red-400 transition-all duration-300 relative group">
                      <FaFutbol className="text-red-500 text-3xl mb-3 drop-shadow-lg rotate-180" />
                      <h3 className="text-sm font-semibold text-gray-700 mb-1 tracking-wide text-center">Goals Against</h3>
                      <p className="text-3xl font-extrabold text-red-600 drop-shadow-xl tracking-tight mb-1">{teamStats.goalsAgainst}</p>
                    </div>
                  </Tooltip>
                </SwiperSlide>
                <SwiperSlide>
                  <Tooltip text="Total points accumulated (3 for win, 1 for draw)">
                    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-yellow-200 flex flex-col items-center hover:scale-105 hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 relative group">
                      <FaTrophy className="text-yellow-400 text-3xl mb-3 drop-shadow-lg" />
                      <h3 className="text-sm font-semibold text-gray-700 mb-1 tracking-wide text-center">Points</h3>
                      <p className="text-3xl font-extrabold text-yellow-600 drop-shadow-xl tracking-tight mb-1">{teamStats.points}</p>
                    </div>
                  </Tooltip>
                </SwiperSlide>
                {teamCount !== null && (
                  <SwiperSlide>
                    <Tooltip text="Number of players currently in the team">
                      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-200 flex flex-col items-center hover:scale-105 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 relative group">
                        <FaUsers className="text-blue-500 text-3xl mb-3 drop-shadow-lg" />
                        <h3 className="text-sm font-semibold text-gray-700 mb-1 tracking-wide text-center">Players in Team</h3>
                        <p className="text-3xl font-extrabold text-blue-700 drop-shadow-xl tracking-tight mb-1">{teamCount}</p>
                      </div>
                    </Tooltip>
                  </SwiperSlide>
                )}
                {playerOfTheMonth && (
                  <SwiperSlide>
                    <Tooltip text="Player of the Month - Outstanding performance">
                      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-yellow-200 flex flex-col items-center hover:scale-105 hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 relative group">
                        <FaUser className="text-yellow-400 text-3xl mb-3 drop-shadow-lg" />
                        <h3 className="text-sm font-semibold text-gray-700 mb-1 tracking-wide text-center">Player of the Month</h3>
                        {playerOfTheMonth.image ? (
                          <img src={`/avatars/${playerOfTheMonth.image}`} alt={playerOfTheMonth.name} className="w-12 h-12 rounded-full mb-2 object-cover border-2 border-yellow-400 shadow-lg" />
                        ) : (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white mb-2 shadow-lg" style={{ background: 'linear-gradient(135deg, #facc15 60%, #fde68a 100%)' }}>
                            {playerOfTheMonth.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                        )}
                        <p className="text-lg font-extrabold text-yellow-600 drop-shadow-xl tracking-tight mb-1 text-center">{playerOfTheMonth.name}</p>
                        <p className="text-xs text-gray-500 font-semibold tracking-wide text-center">{playerOfTheMonth.role}</p>
                      </div>
                    </Tooltip>
                  </SwiperSlide>
                )}
              </Swiper>
              <style jsx>{`
                .upcoming-matches-swiper .swiper-button-next,
                .upcoming-matches-swiper .swiper-button-prev,
                .recent-matches-swiper .swiper-button-next,
                .recent-matches-swiper .swiper-button-prev,
                .stats-swiper .swiper-button-next,
                .stats-swiper .swiper-button-prev {
                  background: rgba(255, 255, 255, 0.9);
                  border-radius: 50%;
                  width: 44px;
                  height: 44px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                  transition: all 0.3s ease;
                }
                .upcoming-matches-swiper .swiper-button-next:hover,
                .upcoming-matches-swiper .swiper-button-prev:hover,
                .recent-matches-swiper .swiper-button-next:hover,
                .recent-matches-swiper .swiper-button-prev:hover,
                .stats-swiper .swiper-button-next:hover,
                .stats-swiper .swiper-button-prev:hover {
                  background: white;
                  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                  transform: scale(1.1);
                }
                .upcoming-matches-swiper .swiper-button-next::after,
                .upcoming-matches-swiper .swiper-button-prev::after,
                .recent-matches-swiper .swiper-button-next::after,
                .recent-matches-swiper .swiper-button-prev::after,
                .stats-swiper .swiper-button-next::after,
                .stats-swiper .swiper-button-prev::after {
                  font-size: 18px;
                  font-weight: bold;
                }
                .upcoming-matches-swiper .swiper-pagination-bullet,
                .recent-matches-swiper .swiper-pagination-bullet,
                .stats-swiper .swiper-pagination-bullet {
                  width: 10px;
                  height: 10px;
                  background: #3b82f6;
                  opacity: 0.6;
                  transition: all 0.3s ease;
                }
                .upcoming-matches-swiper .swiper-pagination-bullet-active,
                .recent-matches-swiper .swiper-pagination-bullet-active,
                .stats-swiper .swiper-pagination-bullet-active {
                  opacity: 1;
                  transform: scale(1.2);
                }
                .upcoming-matches-swiper .swiper-slide,
                .recent-matches-swiper .swiper-slide,
                .stats-swiper .swiper-slide {
                  transition: transform 0.3s ease;
                }
                .upcoming-matches-swiper .swiper-slide:hover,
                .recent-matches-swiper .swiper-slide:hover,
                .stats-swiper .swiper-slide:hover {
                  transform: translateY(-5px);
                }
                .upcoming-matches-swiper .swiper-wrapper,
                .recent-matches-swiper .swiper-wrapper,
                .stats-swiper .swiper-wrapper {
                  cursor: grab;
                }
                .upcoming-matches-swiper .swiper-wrapper:active,
                .recent-matches-swiper .swiper-wrapper:active,
                .stats-swiper .swiper-wrapper:active {
                  cursor: grabbing;
                }
              `}</style>
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
      <section className="py-20 animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white shadow-2xl p-12 flex flex-col items-center">
            <h2 className="text-4xl font-extrabold mb-6 text-center drop-shadow">Join FC Escuela Today</h2>
            <p className="text-xl mb-10 max-w-2xl text-center font-light drop-shadow">
              Be part of our growing football family and take your game to the next level
            </p>
            <div className="flex flex-wrap gap-8 justify-center">
              <Link href="/team" className="flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white">
                <FaUsers className="text-2xl" />
                First Team
              </Link>
              <Link href="/gallery" className="flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white">
                <FaImages className="text-2xl" />
                Gallery
              </Link>
            </div>
          </div>
        </div>
        <style jsx>{`
          .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.4,0,0.2,1) both; }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        `}</style>
      </section>
    </main>
  )
}
