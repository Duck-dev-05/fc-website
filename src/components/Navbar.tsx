'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, ShoppingBagIcon, LifebuoyIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'About Us', href: '/about' },
  { name: 'Matches', href: '/matches' },
  { name: 'Recent Matches', href: '/tickets' },
  { name: 'News', href: '/news' },
  { name: 'Team', href: '/team' },
  { name: 'Gallery', href: '/gallery' },
]

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession();
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false)
  const router = useRouter();

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetch(`/api/search?query=${encodeURIComponent(debouncedSearch)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setShowDropdown(true);
        });
    } else {
      setSearchResults(null);
      setShowDropdown(false);
    }
  }, [debouncedSearch]);

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [lang, setLang] = useState('en');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setSearch(""); // Optionally clear the search bar
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (!showAccountMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu]);

  // Recommended links for empty search
  const recommendedLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Matches', href: '/matches' },
    { name: 'Recent Matches', href: '/tickets' },
    { name: 'News', href: '/news' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <nav className="bg-gradient-to-b from-white to-blue-50/60 shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center whitespace-nowrap flex-row">
            <span className="text-2xl font-bold text-blue-700 tracking-wide">FC ESCUELA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 relative flex-1 justify-center">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative flex items-center ml-6 w-80 max-w-xs bg-white rounded-full shadow border border-blue-100 focus-within:ring-2 focus-within:ring-blue-400 transition-all"
              role="search"
              aria-label="Site search"
              autoComplete="off"
            >
              <span className="absolute left-3 text-blue-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search..."
                aria-label="Search"
                className="flex-1 bg-transparent outline-none pl-10 pr-8 py-2 text-gray-700 text-base rounded-full focus:ring-0"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => { if (searchResults) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-3 text-gray-400 hover:text-red-500 focus:outline-none"
                  onClick={() => { setSearch(""); setShowDropdown(false); }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
              {/* Instant search dropdown */}
              {showDropdown && (
                <div className="absolute left-0 top-12 w-full bg-white border border-blue-100 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <ul className="p-2">
                    {/* Show recommended links if search is empty */}
                    {!search && (
                      <li className="mb-2">
                        <div className="text-xs font-bold text-gray-700 mb-1">Recommended</div>
                        {recommendedLinks.map((item) => (
                          <Link key={item.href} href={item.href} className="block px-3 py-2 hover:bg-blue-50 rounded text-blue-700 font-semibold" onClick={() => setShowDropdown(false)}>
                            {item.name}
                          </Link>
                        ))}
                      </li>
                    )}
                    {/* Only show search results if search is not empty */}
                    {search && searchResults && (
                      <>
                        {/* Pages */}
                        {searchResults.pages && searchResults.pages.length > 0 && (
                          <li className="mb-2">
                            <div className="text-xs font-bold text-blue-700 mb-1">Pages</div>
                            {searchResults.pages.map((item: any) => (
                              <Link key={item.href} href={item.href} className="block px-3 py-2 hover:bg-blue-50 rounded text-blue-700 font-semibold" onClick={() => setShowDropdown(false)}>
                                {item.name}
                              </Link>
                            ))}
                          </li>
                        )}
                        {/* News */}
                        {searchResults.news && searchResults.news.length > 0 && (
                          <li className="mb-2">
                            <div className="text-xs font-bold text-green-700 mb-1">News</div>
                            {searchResults.news.map((item: any) => (
                              <Link key={item.id} href={`/news/${item.id}`} className="block px-3 py-2 hover:bg-green-50 rounded text-green-700 font-semibold" onClick={() => setShowDropdown(false)}>
                                {item.title}
                              </Link>
                            ))}
                          </li>
                        )}
                        {/* Team Members */}
                        {searchResults.team && searchResults.team.length > 0 && (
                          <li className="mb-2">
                            <div className="text-xs font-bold text-purple-700 mb-1">Team Members</div>
                            {searchResults.team.map((item: any) => (
                              <Link key={item.id} href={`/team#${item.name.toLowerCase().replace(/ /g, '-')}`} className="block px-3 py-2 hover:bg-purple-50 rounded text-purple-700 font-semibold" onClick={() => setShowDropdown(false)}>
                                {item.name}
                              </Link>
                            ))}
                          </li>
                        )}
                        {/* Matches */}
                        {searchResults.matches && searchResults.matches.length > 0 && (
                          <li className="mb-2">
                            <div className="text-xs font-bold text-orange-700 mb-1">Matches</div>
                            {searchResults.matches.map((item: any) => (
                              <Link key={item.id} href={`/matches/${item.id}`} className="block px-3 py-2 hover:bg-orange-50 rounded text-orange-700 font-semibold" onClick={() => setShowDropdown(false)}>
                                {item.homeTeam} vs {item.awayTeam}
                              </Link>
                            ))}
                          </li>
                        )}
                        {/* No results */}
                        {(!searchResults.pages?.length && !searchResults.news?.length && !searchResults.team?.length && !searchResults.matches?.length) && (
                          <li className="text-gray-500 px-3 py-2">No results found.</li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </form>
            {/* Auth section */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                {session ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowAccountMenu((v) => !v)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Account"
                      aria-label="Account menu"
                      aria-haspopup="true"
                      aria-expanded={showAccountMenu}
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                        />
                      ) : (
                        <UserCircleIcon className="h-7 w-7" />
                      )}
                      <svg className={`h-5 w-5 ml-2 text-white transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showAccountMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-blue-100 animate-fade-in" role="menu" aria-label="Account submenu">
                        <div className="px-4 py-2 border-b border-blue-50 mb-2">
                          <div className="font-semibold text-blue-700 truncate">{session.user?.name || 'User'}</div>
                          <div className="text-xs text-gray-500 truncate">{session.user?.email}</div>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <ShoppingBagIcon className="h-5 w-5" />
                          My Orders
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          Settings
                        </Link>
                        <Link
                          href="/support"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <LifebuoyIcon className="h-5 w-5" />
                          Support
                        </Link>

                        {(session?.user?.roles || []).includes('admin') && (
                          <a
                            href="http://localhost:3001/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-blue-700 font-semibold hover:bg-blue-50 hover:text-blue-900 transition-colors cursor-pointer"
                            role="menuitem"
                            tabIndex={0}
                            onClick={() => setShowAccountMenu(false)}
                          >
                            <svg className="h-5 w-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M4 11h16" /></svg>
                            Admin Dashboard
                          </a>
                        )}
                        <div className="my-2 border-t border-blue-100" />
                        <button
                          onClick={() => { setShowAccountMenu(false); signOut(); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          role="menuitem"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ))}
              {/* Add mobile auth section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {session ? (
                  <>
                    <button
                      className="w-full flex items-center px-3 py-2 focus:outline-none"
                      onClick={() => setShowMobileProfileMenu((v) => !v)}
                      aria-expanded={showMobileProfileMenu}
                      aria-controls="mobile-profile-menu"
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="h-8 w-8 rounded-full object-cover border-2 border-white shadow"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      )}
                      <div className="ml-3 text-left flex-1">
                        <div className="text-sm font-medium text-gray-700">{session.user?.name || 'User'}</div>
                        <div className="text-xs text-gray-500">{session.user?.email}</div>
                      </div>
                      <svg className={`h-5 w-5 ml-2 transition-transform ${showMobileProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showMobileProfileMenu && (
                      <div id="mobile-profile-menu" className="mt-2 space-y-1 bg-white rounded-md shadow border border-blue-50">
                        <Link
                          href="/profile"
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        >
                          <div className="flex items-center">
                            <UserCircleIcon className="h-5 w-5 mr-2" />
                            Profile
                          </div>
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        >
                          <div className="flex items-center">
                            <ShoppingBagIcon className="h-5 w-5 mr-2" />
                            My Orders
                          </div>
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        >
                          <div className="flex items-center">
                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                            Settings
                          </div>
                        </Link>
                        <Link
                          href="/support"
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        >
                          <div className="flex items-center">
                            <LifebuoyIcon className="h-5 w-5 mr-2" />
                            Support
                          </div>
                        </Link>

                        {(session?.user?.roles || []).includes('admin') && (
                          <a
                            href="http://localhost:3001/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 text-blue-700 font-semibold hover:text-blue-900"
                          >
                            <div className="flex items-center">
                              <svg className="h-5 w-5 mr-2 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M4 11h16" /></svg>
                              Admin Dashboard
                            </div>
                          </a>
                        )}
                        <button
                          onClick={() => { setIsMenuOpen(false); signOut(); }}
                          className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                        >
                          <div className="flex items-center">
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                            Sign Out
                          </div>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="block w-full px-3 py-2 text-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 