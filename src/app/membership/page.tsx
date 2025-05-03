"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

export default function MembershipPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/membership");
        if (!res.ok) throw new Error("Failed to fetch membership plans");
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        setError("Could not load membership plans.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        // ignore
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [authStatus]);

  // Require login
  if (authStatus === "loading" || loading || profileLoading) {
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
          <p className="mt-2 text-gray-600">Please sign in to view and purchase memberships.</p>
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

  const handlePurchase = async (planId: string, price: number) => {
    if (price === 0) return;
    setProcessing(planId);
    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout.");
      }
    } catch (e) {
      alert("Failed to start checkout.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Membership Plans</h1>
          <p className="text-xl text-gray-600">Choose the perfect plan for your football experience</p>
        </div>

        {profile?.isMember && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Current Membership</h2>
            <p className="text-blue-700">
              You are currently a {profile.membershipType} member since {new Date(profile.memberSince).toLocaleDateString()}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-lg">
            Your membership purchase was successful! Thank you for joining us.
          </div>
        )}

        {canceled && (
          <div className="mb-8 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
            Your membership purchase was canceled. You can try again anytime.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => {
            const isSubscribed = profile?.isMember && profile?.membershipType?.toLowerCase() === plan.id;
            return (
              <div key={plan.id} className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border ${isSubscribed ? 'border-blue-500' : 'border-blue-100'} hover:shadow-2xl transition-all`}>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">{plan.name}</h2>
                <div className="text-3xl font-extrabold text-gray-900 mb-2">{plan.price === 0 ? "Free" : `$${plan.price}`}</div>
                <div className="text-gray-600 mb-4 text-center">{plan.description}</div>
                <ul className="text-left space-y-2 mb-4 w-full max-w-xs mx-auto">
                  {plan.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-blue-800">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-auto px-6 py-2 rounded-full ${isSubscribed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'} font-semibold shadow hover:bg-blue-700 transition-all flex items-center justify-center ${plan.price === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={plan.price === 0 || processing === plan.id || isSubscribed}
                  onClick={() => handlePurchase(plan.id, plan.price)}
                >
                  {processing === plan.id ? (
                    <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>Processing...</span>
                  ) : isSubscribed ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Free'
                  ) : (
                    'Choose'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 