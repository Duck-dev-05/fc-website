"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const pages = [
  { name: "About Us", href: "/about", description: "Learn more about FC ESCUELA, our mission, and our story." },
  { name: "Matches", href: "/matches", description: "View upcoming and past matches, scores, and match details." },
  { name: "Tickets", href: "/tickets", description: "Purchase tickets for upcoming matches and events." },
  { name: "News", href: "/news", description: "Read the latest news and updates about FC ESCUELA." },
  { name: "Team", href: "/team", description: "Meet our players, coaches, and staff." },
  { name: "Gallery", href: "/gallery", description: "Browse photos and videos from matches and events." },
  { name: "Profile", href: "/profile", description: "View and edit your personal profile and account information." },
  { name: "Orders", href: "/orders", description: "Check your ticket and merchandise orders." },
  { name: "Settings", href: "/settings", description: "Manage your account settings and preferences." },
  { name: "Support", href: "/support", description: "Get help and support for any issues or questions." },
  { name: "Sign In", href: "/auth/signin", description: "Access your account by signing in." },
  { name: "Register", href: "/auth/register", description: "Create a new account to join FC ESCUELA." },
  { name: "Forgot Password", href: "/auth/forgot-password", description: "Reset your password if you've forgotten it." },
  { name: "Reset Password", href: "/auth/reset-password", description: "Set a new password for your account." },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [newsResults, setNewsResults] = useState<any[]>([]);
  const [teamResults, setTeamResults] = useState<any[]>([]);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Static page search (as before)
  const pageResults = query
    ? pages.filter(
        (page) =>
          page.name.toLowerCase().includes(query) ||
          page.href.toLowerCase().includes(query)
      )
    : [];

  useEffect(() => {
    if (!query) {
      setNewsResults([]);
      setTeamResults([]);
      setMatchResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setNewsResults(data.news || []);
        setTeamResults(data.team || []);
        setMatchResults(data.matches || []);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const hasResults =
    pageResults.length > 0 ||
    newsResults.length > 0 ||
    teamResults.length > 0 ||
    matchResults.length > 0;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{searchParams.get("query")}"</h1>
      {loading && <div>Loading...</div>}
      {!loading && !hasResults && <div>No results found.</div>}
      <ul>
        {pageResults.length > 0 && (
          <li className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Pages</h2>
            <ul>
              {pageResults.map((item, idx) => (
                <li key={idx} className="mb-4 p-4 border rounded bg-white shadow-sm">
                  <Link href={item.href} className="text-blue-600 hover:underline font-semibold text-lg">
                    {item.name}
                  </Link>
                  <span className="ml-2 text-gray-500 text-xs">({item.href})</span>
                  <div className="text-gray-600 mt-1 text-sm">{item.description}</div>
                </li>
              ))}
            </ul>
          </li>
        )}
        {newsResults.length > 0 && (
          <li className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-green-700">News Posts</h2>
            <ul>
              {newsResults.map((item) => (
                <li key={item.id} className="mb-2 p-3 border rounded bg-green-50">
                  <Link href={`/news/${item.id}`} className="text-green-700 hover:underline font-semibold">
                    {item.title}
                  </Link>
                  <div className="text-gray-600 text-sm">{item.content?.slice(0, 100)}...</div>
                  <div className="text-xs text-gray-500">By {item.author} | {item.category}</div>
                </li>
              ))}
            </ul>
          </li>
        )}
        {teamResults.length > 0 && (
          <li className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-purple-700">Team Members</h2>
            <ul>
              {teamResults.map((item) => (
                <li key={item.id} className="mb-2 p-3 border rounded bg-purple-50">
                  <Link href={`/team#${item.name.toLowerCase().replace(/ /g, '-')}`} className="text-purple-700 hover:underline font-semibold">
                    {item.name}
                  </Link>
                  <div className="text-gray-600 text-sm">{item.role}</div>
                  <div className="text-xs text-gray-500">{item.bio?.slice(0, 80)}...</div>
                </li>
              ))}
            </ul>
          </li>
        )}
        {matchResults.length > 0 && (
          <li className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-orange-700">Matches</h2>
            <ul>
              {matchResults.map((item) => (
                <li key={item.id} className="mb-2 p-3 border rounded bg-orange-50">
                  <Link href={`/matches/${item.id}`} className="text-orange-700 hover:underline font-semibold">
                    {item.homeTeam} vs {item.awayTeam}
                  </Link>
                  <div className="text-gray-600 text-sm">{item.competition} | {item.date?.slice(0, 10)}</div>
                  <div className="text-xs text-gray-500">{item.description?.slice(0, 80)}...</div>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
} 