'use client';
import { useRef, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ArrowRightOnRectangleIcon, UserCircleIcon, PhotoIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const AccountMenu = () => {
  const { data: session } = useSession();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  if (session) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="h-8 w-8 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <UserCircleIcon className="h-8 w-8" />
          )}
          <span className="text-sm font-medium">{session.user?.name?.split(' ')[0] || 'User'}</span>
        </button>
        {showAccountMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="font-medium text-gray-900">{session.user?.name}</div>
              <div className="text-sm text-gray-500">{session.user?.email}</div>
            </div>
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setShowAccountMenu(false)}
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/gallery#my-uploads"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setShowAccountMenu(false)}
            >
              <PhotoIcon className="h-5 w-5" />
              <span>My Uploads</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setShowAccountMenu(false)}
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => { setShowAccountMenu(false); signOut(); }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <Link
      href="/auth/signin"
      className="px-7 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all text-base font-semibold whitespace-nowrap shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
      style={{whiteSpace: 'nowrap'}}
    >
      <span className="whitespace-nowrap">Sign In</span>
    </Link>
  );
};

export default AccountMenu; 