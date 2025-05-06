"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, UserCircleIcon, StarIcon, PhoneIcon, EnvelopeIcon, UserIcon, IdentificationIcon, MapPinIcon, CalendarIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from "react";
import { formatDistanceToNow, format } from 'date-fns';
import { Tab } from '@headlessui/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [membershipType, setMembershipType] = useState<string>('Standard'); // Mocked
  const [membershipExpiry, setMembershipExpiry] = useState<Date | null>(null); // Mocked
  const [joinDate, setJoinDate] = useState<Date | null>(null); // Mocked
  const [lastLogin, setLastLogin] = useState<Date | null>(null); // Mocked
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [username] = useState('testuser');
  const [phone] = useState('+1 555-123-4567');
  const [dob] = useState('1998-05-15');
  const [address] = useState('123 Main St, City, Country');
  const [emailVerified] = useState(true);
  const [userId] = useState('u123456789');
  const [role] = useState('user');
  const [socialLinks] = useState([
    { type: 'Instagram', url: 'https://instagram.com/testuser' },
    { type: 'Facebook', url: 'https://facebook.com/testuser' },
  ]);
  const profileCompletion = 80; // percent, mocked

  const tabs = ['Account', 'Membership', 'Security'];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

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
          <p className="mt-2 text-gray-600">Please sign in to view your profile.</p>
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

  // Profile fields fallback
  const joinDateFallback = profile?.memberSince ? new Date(profile.memberSince) : null;
  const lastLoginFallback = null; // You can add this if you track it
  const sessionExpiryFallback = null; // You can add this if you track it
  const profileCompletionFallback = [
    profile?.name,
    profile?.username,
    profile?.email,
    profile?.phone,
    profile?.dob,
    profile?.address,
    profile?.gender,
    profile?.nationality,
    profile?.language,
    profile?.bio,
    profile?.website,
    profile?.occupation,
    profile?.favoriteTeam,
  ].filter(Boolean).length / 13 * 100;
  const socialLinksFallback = [
    profile?.website ? { type: 'Website', url: profile.website } : null,
  ].filter(Boolean);

  // Use session info for social login if available
  const displayName = session?.user?.name || profile?.name || 'User';
  const displayEmail = session?.user?.email || profile?.email || '';
  const displayImage = session?.user?.image || profile?.image || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_blue_512dp.png';
  const displayId = profile?.id || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full flex flex-col items-center border border-blue-100">
        <Tab.Group>
          <Tab.List className="flex space-x-2 mb-6">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    'px-4 py-2 rounded-full text-sm font-semibold focus:outline-none',
                    selected
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-blue-700 hover:bg-blue-200'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="w-full">
            {/* Account Tab */}
            <Tab.Panel>
              <div className="flex flex-col items-center w-full">
                {/* Profile Picture and Name */}
                <div className="flex flex-col items-center mb-6">
                  {displayImage ? (
                    <img src={displayImage} alt="Profile" className="h-24 w-24 rounded-full object-cover mb-3 border-4 border-blue-200 shadow" />
                  ) : (
                    <UserCircleIcon className="h-24 w-24 text-blue-300 mb-3" />
                  )}
                  <h1 className="text-4xl font-extrabold text-blue-700 mb-1">{displayName}</h1>
                  <div className="flex items-center gap-2 text-gray-500 text-base mb-1">
                    <EnvelopeIcon className="h-5 w-5" />
                    {displayEmail || <span className="italic text-gray-400">Not set</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <IdentificationIcon className="h-4 w-4" />
                    User ID: <span className="font-mono text-gray-600">{displayId || <span className="italic text-gray-400">Not set</span>}</span>
                  </div>
                </div>
                {/* Divider */}
                <div className="w-full border-t border-blue-100 mb-4"></div>
                {/* Info Grid */}
                <div className="w-full max-w-md bg-blue-50 rounded-xl shadow-inner p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Username:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.username || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserGroupIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Role:</span></div>
                  <div className="text-blue-700 font-semibold text-sm flex items-center">user</div>
                  <div className="flex items-center gap-2 text-sm"><PhoneIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Phone:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.phone || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><CalendarIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Date of Birth:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.dob || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><MapPinIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Address:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.address || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Gender:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.gender || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Nationality:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.nationality || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Language:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.language || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Occupation:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.occupation || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Favorite Team:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.favoriteTeam || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><CheckCircleIcon className={profile?.emailVerified ? 'h-5 w-5 text-green-500' : 'h-5 w-5 text-red-500'} /><span className="text-gray-500">Email Verified:</span></div>
                  <div className={profile?.emailVerified ? 'text-green-600 font-semibold text-sm flex items-center' : 'text-red-600 font-semibold text-sm flex items-center'}>{profile?.emailVerified ? 'Yes' : 'No'}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Bio:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.bio || <span className="italic text-gray-400">Not set</span>}</div>
                  <div className="flex items-center gap-2 text-sm"><UserIcon className="h-5 w-5 text-blue-400" /><span className="text-gray-500">Website:</span></div>
                  <div className="text-blue-900 font-medium text-sm flex items-center">{profile?.website ? <a href={profile.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{profile.website}</a> : <span className="italic text-gray-400">Not set</span>}</div>
                </div>
                {/* Divider */}
                <div className="w-full border-t border-blue-100 mb-4"></div>
                {/* Join/Last login */}
                <div className="w-full max-w-md flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 mb-4 gap-2">
                  {profile?.memberSince && (
                    <div className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />Joined: {format(new Date(profile.memberSince), 'PPP')}</div>
                  )}
                </div>
                {/* Membership info */}
                <div className="w-full max-w-md mb-4">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <StarIcon className={profile?.isMember ? 'h-5 w-5 text-yellow-400' : 'h-5 w-5 text-gray-400'} />
                    <span className="text-gray-500">Membership:</span>
                    <span className={profile?.isMember ? 'text-yellow-600 font-semibold' : 'text-gray-600'}>{profile?.isMember ? `Yes (${profile.membershipType || 'Standard'})` : 'No'}</span>
                  </div>
                </div>
                {/* Profile completion bar */}
                <div className="w-full max-w-md mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Profile Completion</span>
                    <span className="text-blue-700 font-semibold">{profileCompletionFallback}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${profileCompletionFallback}%` }}></div>
                  </div>
                </div>
                {/* Social links */}
                <div className="flex gap-4 mt-2 mb-6">
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-base font-medium">Website</a>
                  )}
                </div>
                <button
                  className="px-8 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-base"
                  onClick={() => router.push('/profile/edit')}
                >
                  Edit Profile
                </button>
              </div>
            </Tab.Panel>
            {/* Membership Tab */}
            <Tab.Panel>
              <div className="flex flex-col items-center w-full">
                {isMember ? (
                  <>
                    <span className="inline-flex items-center gap-2 px-4 py-1 text-base font-semibold bg-yellow-400 text-white rounded-full shadow border border-yellow-300 mb-2">
                      <StarIcon className="h-5 w-5" /> Member
                    </span>
                    <div className="text-green-700 font-semibold mb-2">Thank you for being a valued member!</div>
                    <div className="text-sm text-blue-800 mb-2">Membership type: <span className="font-bold">{membershipType}</span></div>
                    {membershipExpiry && (
                      <div className="text-xs text-gray-500 mb-2">Membership expires {formatDistanceToNow(membershipExpiry, { addSuffix: true })}</div>
                    )}
                    <ul className="text-left space-y-2 mb-4 w-full max-w-xs mx-auto">
                      <li className="flex items-center gap-2 text-blue-800"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Access to exclusive content</li>
                      <li className="flex items-center gap-2 text-blue-800"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Priority ticket booking</li>
                      <li className="flex items-center gap-2 text-blue-800"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Member-only events</li>
                    </ul>
                    <button
                      className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all mb-2"
                      onClick={() => router.push('/membership')}
                    >
                      Manage Membership
                    </button>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-2 px-4 py-1 text-base font-semibold bg-gray-200 text-gray-700 rounded-full shadow border border-gray-300 mb-2">
                      Not a Member
                    </span>
                    <div className="text-blue-700 font-semibold mb-2">Become a member to unlock exclusive benefits!</div>
                    {/* Benefits List */}
                    <ul className="text-left space-y-2 mb-4 w-full max-w-xs mx-auto">
                      <li className="flex items-center gap-2 text-blue-800"><CheckCircleIcon className="h-5 w-5 text-green-500" />Access to exclusive content</li>
                      <li className="flex items-center gap-2 text-blue-800"><CheckCircleIcon className="h-5 w-5 text-green-500" />Priority ticket booking</li>
                      <li className="flex items-center gap-2 text-blue-800"><CheckCircleIcon className="h-5 w-5 text-green-500" />Member-only events</li>
                      <li className="flex items-center gap-2 text-blue-800"><CheckCircleIcon className="h-5 w-5 text-green-500" />Special discounts</li>
                      <li className="flex items-center gap-2 text-blue-800"><CheckCircleIcon className="h-5 w-5 text-green-500" />Early access to news</li>
                    </ul>
                    {/* Comparison Table */}
                    <div className="w-full max-w-xs mb-4">
                      <div className="grid grid-cols-3 text-xs text-center font-semibold mb-2">
                        <div></div>
                        <div className="text-gray-500">Free</div>
                        <div className="text-blue-700">Member</div>
                      </div>
                      <div className="grid grid-cols-3 text-xs text-center mb-1">
                        <div>Exclusive Content</div>
                        <div className="text-gray-400">&#10005;</div>
                        <div className="text-green-500">&#10003;</div>
                      </div>
                      <div className="grid grid-cols-3 text-xs text-center mb-1">
                        <div>Priority Tickets</div>
                        <div className="text-gray-400">&#10005;</div>
                        <div className="text-green-500">&#10003;</div>
                      </div>
                      <div className="grid grid-cols-3 text-xs text-center mb-1">
                        <div>Member Events</div>
                        <div className="text-gray-400">&#10005;</div>
                        <div className="text-green-500">&#10003;</div>
                      </div>
                      <div className="grid grid-cols-3 text-xs text-center mb-1">
                        <div>Discounts</div>
                        <div className="text-gray-400">&#10005;</div>
                        <div className="text-green-500">&#10003;</div>
                      </div>
                      <div className="grid grid-cols-3 text-xs text-center mb-1">
                        <div>Early News</div>
                        <div className="text-gray-400">&#10005;</div>
                        <div className="text-green-500">&#10003;</div>
                      </div>
                    </div>
                    {/* Testimonial */}
                    <div className="w-full max-w-xs mb-4 bg-blue-100 rounded-lg p-3 text-xs italic text-blue-800 shadow-inner">
                      "Becoming a member was the best decision! I get early access to tickets and exclusive content."<br />
                      <span className="font-semibold">- Happy Member</span>
                    </div>
                    {/* Learn More Link */}
                    <a href="/membership" className="text-blue-600 hover:underline text-sm mb-4">Learn more about membership</a>
                    <button
                      className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
                      onClick={() => router.push('/membership')}
                    >
                      Become a Member
                    </button>
                  </>
                )}
              </div>
            </Tab.Panel>
            {/* Security Tab */}
            <Tab.Panel>
              <div className="flex flex-col items-center w-full gap-6">
                <div className="w-full max-w-md bg-blue-50 rounded-xl shadow-inner p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2"><CheckCircleIcon className={profile?.emailVerified ? 'h-5 w-5 text-green-500' : 'h-5 w-5 text-red-500'} />Email Verified:</span>
                    <span className={profile?.emailVerified ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{profile?.emailVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2"><UserIcon className="h-5 w-5 text-blue-400" />Last Password Change:</span>
                    <span className="text-blue-900 font-medium">about 2 months ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2"><UserIcon className="h-5 w-5 text-blue-400" />Last Login:</span>
                    <span className="text-blue-900 font-medium">about 1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2"><LockClosedIcon className="h-5 w-5 text-blue-400" />Two-Factor Authentication:</span>
                    <span className="text-red-600 font-semibold">Off</span>
                  </div>
                  <button className="px-4 py-1 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all w-fit self-end text-sm">Set up 2FA</button>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2"><UserGroupIcon className="h-5 w-5 text-blue-400" />Active Sessions:</span>
                    <span className="text-blue-900 font-medium">1 (this device)</span>
                  </div>
                  <button className="px-4 py-1 rounded-full bg-gray-200 text-blue-700 font-semibold shadow hover:bg-gray-300 transition-all w-fit self-end text-sm">Sign out all devices</button>
                </div>
                <button
                  className="px-6 py-2 rounded-full bg-gray-200 text-blue-700 font-semibold shadow hover:bg-gray-300 transition-all mb-2"
                  onClick={() => router.push('/auth/change-password')}
                >
                  Change Password
                </button>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 