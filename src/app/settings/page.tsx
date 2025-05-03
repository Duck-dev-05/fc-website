"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LockClosedIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Login Required</h2>
          <p className="mt-2 text-gray-600">Please sign in to view your settings.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-blue-100 rounded-full p-2 mb-4">
              {profile?.image ? (
                <img src={profile.image} alt="Avatar" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="h-24 w-24 text-blue-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">{profile?.name || '-'}</div>
            <div className="text-gray-500 mb-2">{profile?.email || '-'}</div>
            <div className="flex items-center gap-2">
              {profile?.emailVerified ? (
                <span className="flex items-center text-green-600"><CheckCircleIcon className="h-5 w-5 mr-1" /> Email Verified</span>
              ) : (
                <span className="flex items-center text-red-500"><XCircleIcon className="h-5 w-5 mr-1" /> Email Not Verified</span>
              )}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Username</div>
              <div className="text-gray-800 font-medium">{profile?.username || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Phone</div>
              <div className="text-gray-800 font-medium">{profile?.phone || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Date of Birth</div>
              <div className="text-gray-800 font-medium">{profile?.dob || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Address</div>
              <div className="text-gray-800 font-medium">{profile?.address || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Gender</div>
              <div className="text-gray-800 font-medium">{profile?.gender || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Nationality</div>
              <div className="text-gray-800 font-medium">{profile?.nationality || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Language</div>
              <div className="text-gray-800 font-medium">{profile?.language || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Bio</div>
              <div className="text-gray-800 font-medium">{profile?.bio || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Website</div>
              <div className="text-gray-800 font-medium">{profile?.website || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Occupation</div>
              <div className="text-gray-800 font-medium">{profile?.occupation || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Favorite Team</div>
              <div className="text-gray-800 font-medium">{profile?.favoriteTeam || '-'}</div>
            </div>
          </div>
        </div>
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Membership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Membership Type</div>
              <div className="text-gray-800 font-medium">{profile?.membershipType || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Member Since</div>
              <div className="text-gray-800 font-medium">{profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 