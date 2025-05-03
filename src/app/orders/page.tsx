"use client";
import { useEffect, useState } from "react";
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

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchOrders();
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
  const currentOrders = safeOrders.filter(order => {
    if (order.type === 'ticket') {
      const matchDate = new Date(order.details.match?.date || '');
      return matchDate > now;
    } else {
      return order.details.status === 'active';
    }
  });
  const pastOrders = safeOrders.filter(order => {
    if (order.type === 'ticket') {
      const matchDate = new Date(order.details.match?.date || '');
      return matchDate <= now;
    } else {
      return order.details.status !== 'active';
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Orders</h1>
          <p className="text-xl text-gray-600">View your current and past orders</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {currentOrders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Orders</h2>
            <div className="grid gap-6">
              {currentOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  {order.type === 'ticket' ? (
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
                  ) : (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <UserGroupIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {order.details.planId === 'premium' ? 'Premium' : 'VIP'} Membership
                        </h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Started on {order.date.toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            Status: {order.details.status}
                          </div>
                          {order.details.endDate && (
                            <div className="flex items-center text-sm text-gray-500">
                              Expires: {new Date(order.details.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {pastOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Orders</h2>
            <div className="grid gap-6">
              {pastOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  {order.type === 'ticket' ? (
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
                  ) : (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <UserGroupIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {order.details.planId === 'premium' ? 'Premium' : 'VIP'} Membership
                        </h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Started on {order.date.toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            Status: {order.details.status}
                          </div>
                          {order.details.endDate && (
                            <div className="flex items-center text-sm text-gray-500">
                              Expired on: {new Date(order.details.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
      </div>
    </div>
  );
} 