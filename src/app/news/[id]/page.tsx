"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from "next/link";

interface MatchDetails {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  summary?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  intro?: string;
  matchDetails?: MatchDetails;
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Failed to fetch news article");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError("Could not load news article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    // Fetch related news (other articles, up to 3, excluding current)
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/news`);
        if (!res.ok) return;
        const data: NewsArticle[] = await res.json();
        setRelated(data.filter(a => a.id !== id).slice(0, 3));
      } catch {}
    };
    fetchRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-700">News Article Not Found</h2>
        <p className="text-gray-500 mb-6">The news article you are looking for does not exist or could not be loaded.</p>
        <button onClick={() => router.push("/news")} className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">Back to News</button>
      </div>
    );
  }

  const createdDate = new Date(article.createdAt).toLocaleDateString();
  const updatedDate = new Date(article.updatedAt).toLocaleDateString();
  const showUpdated = article.updatedAt && article.updatedAt !== article.createdAt;
  const intro = article.intro || article.content.split('\n')[0];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Hero Image */}
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-80 object-cover rounded-2xl shadow mb-8"
        />
      )}

      {/* Headline and Metadata */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            {createdDate}
          </span>
          <span>
            <UserIcon className="inline h-4 w-4 mr-1" />
            {article.author}
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
            {article.category}
          </span>
          {showUpdated && (
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium ml-2">
              Updated: {updatedDate}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">Post ID: {article.id}</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{article.title}</h1>

      {/* Intro Paragraph */}
      <p className="text-lg text-gray-700 mb-6 font-medium">
        {intro}
      </p>

      {/* Main Content */}
      <div
        className="prose prose-lg max-w-none text-gray-800 mb-10"
        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
      />

      {/* Match Details Box (if relevant) */}
      {article.matchDetails && (
        <>
          <div className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-blue-900">Match Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <div><span className="font-semibold">Teams:</span> {article.matchDetails.homeTeam} vs {article.matchDetails.awayTeam}</div>
              <div><span className="font-semibold">Competition:</span> {article.matchDetails.competition}</div>
              <div><span className="font-semibold">Date:</span> {article.matchDetails.date}</div>
              <div><span className="font-semibold">Time:</span> {article.matchDetails.time}</div>
              <div><span className="font-semibold">Venue:</span> {article.matchDetails.venue}</div>
            </div>
          </div>
          {/* Match Overview Section */}
          <div className="mb-10 p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-blue-900">Overview</h3>
            <div className="text-gray-800 text-base">
              {article.matchDetails.summary ? article.matchDetails.summary : 'No overview available for this match.'}
            </div>
          </div>
        </>
      )}

      {/* Related News */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Related News</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map(r => (
              <Link key={r.id} href={`/news/${r.id}`} className="flex gap-4 items-center bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                {r.imageUrl && (
                  <img src={r.imageUrl} alt={r.title} className="w-20 h-20 object-cover rounded-md" />
                )}
                <div>
                  <div className="text-xs text-gray-500 mb-1">{new Date(r.createdAt).toLocaleDateString()}</div>
                  <div className="font-semibold text-gray-900 line-clamp-2">{r.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 