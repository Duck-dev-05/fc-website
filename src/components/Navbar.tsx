'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, ShoppingBagIcon, LifebuoyIcon, TicketIcon, TrophyIcon, NewspaperIcon, UserGroupIcon, PhotoIcon } from '@heroicons/react/24/outline'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'
import AccountMenu from './AccountMenu'

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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo.jpg"
              alt="FC ESCUELA"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-2xl font-bold text-blue-700 tracking-wide">FC ESCUELA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Search and Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <SearchBar />
            <AccountMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container-custom py-4 space-y-1">
            <NavLinks />
            <div className="border-t border-gray-100 my-2" />
            <AccountMenu />
          </div>
        </div>
      )}

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
                      className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
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
                      className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
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