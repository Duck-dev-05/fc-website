'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { CalendarIcon, MapPinIcon, TicketIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Ticket {
  id: string;
  match: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  status: string;
  matchId: string;
  availableSeats: number | null;
}

function TicketsContent() {
  const router = useRouter()
  const { data: session, status: authStatus } = useSession()
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match')
  
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 1,
    category: 'standard',
  })

  useEffect(() => {
    const fetchTickets = async () => {
      if (!session) return; // Don't fetch if not logged in
      
      try {
        const response = await fetch('/api/tickets')
        const data = await response.json()
        setTickets(data)
        
        if (matchId) {
          const selected = data.find((t: Ticket) => t.matchId === matchId)
          if (selected) setSelectedTicket(selected)
        }
      } catch (err) {
        setError('Failed to load tickets')
        console.error('Error fetching tickets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [matchId, session])

  useEffect(() => {
    if (authStatus === 'unauthenticated' && !session) {
      router.replace('/login');
    }
  }, [authStatus, session, router]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading available matches...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-lg max-w-lg mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2">Error Loading Matches</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setFormData({ ...formData, quantity: 1 })
    router.push(`/tickets?match=${ticket.matchId}`)
  }

  const calculatePrice = () => {
    const basePrice = selectedTicket?.price || 0
    const multiplier = {
      standard: 1,
      premium: 1.5,
      vip: 2
    }[formData.category] || 1
    return basePrice * formData.quantity * multiplier
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error('Please sign in to purchase tickets')
      return
    }

    if (!selectedTicket) {
      toast.error('Please select a match')
      return
    }

    try {
      setProcessing(true)

      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedTicket.matchId,
          quantity: formData.quantity,
          category: formData.category,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Load Stripe
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId
      })

      if (error) {
        throw new Error(error.message || 'Payment failed')
      }

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process payment')
      console.error('Error processing payment:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Match Tickets</h1>
        <p className="mt-2 text-gray-600">Select a match and purchase your tickets securely.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Ticket List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Available Matches</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => handleTicketSelect(ticket)}
                  className={`w-full p-6 text-left transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    selectedTicket?.id === ticket.id ? 'bg-blue-50 hover:bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.match}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          <span>{ticket.date} at {ticket.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          <span>{ticket.venue}</span>
                        </div>
                        {ticket.availableSeats !== null && (
                          <div className="flex items-center text-gray-600">
                            <UserGroupIcon className="h-5 w-5 mr-2" />
                            <span>{ticket.availableSeats} seats available</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        From ${ticket.price}
                      </div>
                      <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.status === "Available" 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {ticket.status}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Purchase Tickets</h2>
              </div>
              <div className="p-6">
                {!selectedTicket ? (
                  <div className="text-center py-8">
                    <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No match selected</h3>
                    <p className="mt-2 text-gray-600">Select a match from the list to purchase tickets.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{selectedTicket.match}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        {selectedTicket.date} at {selectedTicket.time}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Ticket Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg sm:text-sm"
                      >
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Number of Tickets
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        max={selectedTicket.availableSeats || 10}
                        value={formData.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg sm:text-sm"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Price per ticket:</span>
                        <span>${selectedTicket.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <span>Category multiplier:</span>
                        <span>×{formData.category === 'standard' ? '1' : formData.category === 'premium' ? '1.5' : '2'}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                        <span>Total Price:</span>
                        <span>${calculatePrice()}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedTicket?.status === "Sold Out" || processing}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : selectedTicket?.status === "Sold Out" ? (
                        "Sold Out"
                      ) : (
                        "Purchase Tickets"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading available matches...</p>
        </div>
      </div>
    }>
      <TicketsContent />
    </Suspense>
  );
} 