'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, ShoppingBagIcon, LifebuoyIcon, TicketIcon, TrophyIcon, NewspaperIcon, UserGroupIcon, PhotoIcon, HomeIcon, UsersIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'
import AccountMenu from './AccountMenu'
import React from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Navigation links config
const NAV_LINKS = [
  { href: '/team', label: 'First Team', icon: UsersIcon, match: (pathname: string) => pathname.startsWith('/team') },
  { href: '/matches', label: 'Matches', icon: CalendarDaysIcon, match: (pathname: string) => pathname.startsWith('/matches') },
  { href: '/recent-matches', label: 'Recent Matches', icon: TrophyIcon, match: (pathname: string) => pathname.startsWith('/recent-matches') },
  { href: '/gallery', label: 'Gallery', icon: PhotoIcon, match: (pathname: string) => pathname.startsWith('/gallery') },
];

function NavLinksList({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV_LINKS.map(({ href, label, icon: Icon, match }) => (
        <Link
          key={href}
          href={href}
          aria-current={match(pathname) ? 'page' : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            match(pathname)
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <Icon className="h-5 w-5" />{label}
        </Link>
      ))}
    </>
  );
}

function MobileNavLinksList() {
  return (
    <>
      {NAV_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-base transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Icon className="h-5 w-5" />{label}
        </Link>
      ))}
    </>
  );
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
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

  return (
    <nav className="backdrop-blur-md bg-white/90 shadow-lg shadow-blue-100/40 sticky top-0 z-50 rounded-b-2xl border-b border-blue-100 transition-all duration-300">
      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex flex-nowrap items-center h-20 gap-6 px-2 xl:px-0 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group min-w-fit mr-4">
            <Image
              src="/images/logo.jpg"
              alt="FC ESCUELA"
              width={40}
              height={40}
              className="rounded-full shadow-lg border-2 border-blue-300 group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-2xl font-extrabold text-blue-700 tracking-tight group-hover:text-blue-900 transition-colors duration-200 drop-shadow whitespace-nowrap">FC ESCUELA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center min-w-0">
            <div className="flex flex-nowrap space-x-4 overflow-x-auto min-w-max scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
              <NavLinksList pathname={pathname} />
            </div>
          </div>

          {/* Search and Auth */}
          <div className="hidden lg:flex items-center space-x-4 min-w-fit">
            <div className="max-w-xs w-full"><SearchBar /></div>
            <div className="flex items-center">
              <AccountMenu />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-full text-blue-700 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-7 w-7"
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white/95 border-t border-blue-100 shadow-md rounded-b-2xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <div className="container-custom py-6 space-y-3">
          <MobileNavLinksList />
          <div className="border-t border-gray-100 my-2" />
          <AccountMenu />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && searchResults && (
        <div className="absolute left-0 right-0 mt-2 mx-auto w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-4">
            {searchResults.pages?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Pages</h3>
                <div className="space-y-1">
                  {searchResults.pages.map((item: any) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => setShowDropdown(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {searchResults.news?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">News</h3>
                <div className="space-y-1">
                  {searchResults.news.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => setShowDropdown(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 