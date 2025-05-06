'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, ShoppingBagIcon, LifebuoyIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'About Us', href: '/about' },
  { name: 'Matches', href: '/matches' },
  { name: 'Tickets', href: '/tickets' },
  { name: 'News', href: '/news' },
  { name: 'Team', href: '/team' },
  { name: 'Gallery', href: '/gallery' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Demo login state (replace with real auth in production)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [search, setSearch] = useState("");
  const pathname = usePathname()
  const { data: session } = useSession()
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just log the query
    if (search.trim()) {
      console.log("Search query:", search);
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
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-3 text-gray-400 hover:text-red-500 focus:outline-none"
                  onClick={() => setSearch("")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
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
                    </button>
                    {showAccountMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-blue-100 animate-fade-in" role="menu" aria-label="Account submenu">
                        <div className="px-4 py-2 border-b border-blue-50 mb-2">
                          <div className="font-semibold text-blue-700 truncate">{session.user?.name || 'User'}</div>
                          <div className="text-xs text-gray-500 truncate">{session.user?.email}</div>
                        </div>
                        <a
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          Profile
                        </a>
                        <a
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <ShoppingBagIcon className="h-5 w-5" />
                          My Orders
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5" />
                          Settings
                        </a>
                        <a
                          href="/support"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <LifebuoyIcon className="h-5 w-5" />
                          Support
                        </a>
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
                    href="/login"
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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 