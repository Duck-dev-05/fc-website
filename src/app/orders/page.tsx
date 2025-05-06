"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockClosedIcon, TicketIcon, CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Order {
  type: 'ticket' | 'membership';
  id: string;
  date: Date;
  details: {
    match?: {
      id: string;
      name: string;
      date: string;
      time: string;
      venue: string;
    };
    quantity?: number;
    category?: string;
    planId?: string;
    status?: string;
    endDate?: Date;
  };
}

function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          // MOCK DATA for demo/testing
          setOrders([
            {
              type: 'membership',
              id: 'm1',
              date: new Date('2023-01-01'),
              details: {
                planId: 'premium',
                status: 'active',
                endDate: new Date('2024-01-01'),
              },
            },
            {
              type: 'membership',
              id: 'm2',
              date: new Date('2022-01-01'),
              details: {
                planId: 'vip',
                status: 'canceled',
                endDate: new Date('2023-01-01'),
              },
            },
            {
              type: 'ticket',
              id: 't1',
              date: new Date('2024-12-01'),
              details: {
                match: {
                  id: 'match1',
                  name: 'FC ESCUELA vs City FC',
                  date: '2024-12-01',
                  time: '18:00',
                  venue: 'Stadium A',
                },
                quantity: 2,
                category: 'VIP',
              },
            },
            {
              type: 'ticket',
              id: 't2',
              date: new Date('2023-05-01'),
              details: {
                match: {
                  id: 'match2',
                  name: 'FC ESCUELA vs United',
                  date: '2023-05-01',
                  time: '20:00',
                  venue: 'Stadium B',
                },
                quantity: 1,
                category: 'Standard',
              },
            },
          ]);
        }
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchOrders();
  }, [session]);

  useEffect(() => {
    async function fetchProfile() {
      setProfileLoading(true);
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data.user);
        console.log("Profile data:", data.user);
      } catch (err) {
        // Optionally handle error
      } finally {
        setProfileLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  if (status === "loading" || loading || profileLoading) {
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
          <p className="mt-2 text-gray-600">Please sign in to view your orders.</p>
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

  // Convert date fields to Date objects for all orders
  const safeOrders = orders.map(order => ({
    ...order,
    date: new Date(order.date),
    details: {
      ...order.details,
      endDate: order.details.endDate ? new Date(order.details.endDate) : undefined,
      match: order.details.match ? {
        ...order.details.match,
        date: order.details.match.date,
      } : undefined,
    },
  }));

  // Split orders into current and past
  const now = new Date();
  const membershipOrders = safeOrders.filter(order => order.type === 'membership');
  const ticketOrders = safeOrders.filter(order => order.type === 'ticket');
  const currentOrders = ticketOrders.filter(order => {
    const matchDate = new Date(order.details.match?.date || '');
    return matchDate > now;
  });
  const pastOrders = ticketOrders.filter(order => {
    const matchDate = new Date(order.details.match?.date || '');
    return matchDate <= now;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {success === "1" && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-lg text-center text-lg font-semibold shadow">
            Thank you for your order! Your purchase was successful.
          </div>
        )}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Orders</h1>
          <p className="text-xl text-gray-600">View your current and past orders</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Membership Orders Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Membership Orders</h2>
          {membershipOrders.length > 0 ? (
            <div className="grid gap-6">
              {membershipOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{order.details.planId === 'premium' ? 'Premium' : order.details.planId === 'vip' ? 'VIP' : order.details.planId} Membership</h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-500">
                      <span>Status: <span className={order.details.status === 'active' ? 'text-green-600 font-semibold' : 'text-gray-600'}>{order.details.status}</span></span>
                      <span>Started: {order.date.toLocaleDateString()}</span>
                      {order.details.endDate && <span>Expires: {new Date(order.details.endDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No membership orders found.</div>
          )}
        </div>

        {/* Ticket Orders Section (current and past) */}
        {currentOrders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Ticket Orders</h2>
            <div className="grid gap-6">
              {currentOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <TicketIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {order.details.match?.name}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {order.details.match?.date} at {order.details.match?.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {order.details.match?.venue}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {order.details.quantity} {order.details.category} ticket(s)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Ticket Orders</h2>
            <div className="grid gap-6">
              {pastOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <TicketIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {order.details.match?.name}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {order.details.match?.date} at {order.details.match?.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {order.details.match?.venue}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {order.details.quantity} {order.details.category} ticket(s)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">You haven't made any purchases yet.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/tickets')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Tickets
              </button>
            </div>
          </div>
        )}

        {/* Membership promotion card for non-members (for testing, always shown) */}
        {true && (
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Become a Member</h2>
            <p className="text-gray-700 mb-4">Unlock exclusive benefits, early ticket access, and more by joining FC ESCUELA as a member.</p>
            <button
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
              onClick={() => router.push('/membership')}
            >
              View Membership Options
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>}>
      <OrdersContent />
    </Suspense>
  );
} 