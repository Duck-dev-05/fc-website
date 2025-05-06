"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  name: string;
  email: string;
  username: string;
  phone?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  language?: string;
  occupation?: string;
  favoriteTeam?: string;
  address?: string;
  website?: string;
  bio?: string;
  [key: string]: string | undefined;
}

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Determine if user is social login (Google, Facebook, etc.)
  const isSocialLogin = Boolean(session?.user?.email && session?.user?.name && session?.user?.image);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (!profile) return;
    if (isSocialLogin && ["name", "email", "username"].includes(e.target.name)) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      // Always send real social data for locked fields
      const submitProfile = { ...profile };
      if (isSocialLogin) {
        submitProfile.name = session?.user?.name || '';
        submitProfile.email = session?.user?.email || '';
        submitProfile.username = session?.user?.email?.split("@")[0] || '';
      }
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitProfile),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      setSaving(false);
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1200);
    } catch (err) {
      setSaving(false);
      setError("Failed to update profile. Please try again.");
    }
  }

  if (loading || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // For social login, always use session data for locked fields
  const lockedFields = isSocialLogin ? {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    username: session?.user?.email?.split("@")[0] || '',
  } : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 flex flex-col items-center">
      {/* Toast notification */}
      {success && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-semibold">Profile updated successfully!</span>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="relative">
                <input
                  name="name"
                  value={lockedFields.name || profile.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                  readOnly={isSocialLogin}
                />
                {isSocialLogin && (
                  <span className="absolute right-2 top-2 text-blue-400" title="This field is managed by your social account.">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2c0-1.104.896-2 2-2z" /></svg>
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <input
                  name="username"
                  value={lockedFields.username || profile.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                  readOnly={isSocialLogin}
                />
                {isSocialLogin && (
                  <span className="absolute right-2 top-2 text-blue-400" title="This field is managed by your social account.">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2c0-1.104.896-2 2-2z" /></svg>
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input
                  name="email"
                  value={lockedFields.email || profile.email}
                  onChange={handleChange}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                  readOnly={isSocialLogin}
                />
                {isSocialLogin && (
                  <span className="absolute right-2 top-2 text-blue-400" title="This field is managed by your social account.">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2c0-1.104.896-2 2-2z" /></svg>
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" value={profile.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input name="dob" value={profile.dob} onChange={handleChange} type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nationality</label>
              <input name="nationality" value={profile.nationality} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <input name="language" value={profile.language} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Occupation</label>
              <input name="occupation" value={profile.occupation} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Favorite Team</label>
              <input name="favoriteTeam" value={profile.favoriteTeam} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="address" value={profile.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input name="website" value={profile.website} onChange={handleChange} type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => router.push('/profile')} className="px-6 py-2 rounded-full bg-gray-200 text-blue-700 font-semibold shadow hover:bg-gray-300 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 