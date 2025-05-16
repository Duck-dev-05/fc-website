'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  category: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setArticles(data)
      } catch (err) {
        setError('Failed to load news articles')
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading news articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-lg max-w-lg mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">Error Loading News</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Latest News</h1>
        <p className="mt-2 text-gray-600">Stay updated with the latest news and updates from our club.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`} passHref legacyBehavior>
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              {article.imageUrl && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="object-cover w-full h-48"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {article.author}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-3">
                  {article.content}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {article.category}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
} 