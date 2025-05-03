'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'success' | 'failure' | 'processing'>('processing')

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent')
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret')
    const redirect_status = searchParams.get('redirect_status')

    let timeoutId: NodeJS.Timeout;

    if (redirect_status === 'succeeded') {
      setStatus('success')
      toast.success('Your tickets have been purchased successfully!', {
        duration: 4000,
        position: 'top-center',
        icon: '🎟️',
      })
      setTimeout(() => router.push('/orders'), 1500)
    } else if (redirect_status === 'failed') {
      setStatus('failure')
      toast.error('Payment failed. Please try again.', {
        duration: 4000,
        position: 'top-center',
      })
    } else {
      // If still processing after 15 seconds, redirect to /orders
      timeoutId = setTimeout(() => {
        toast('Payment confirmation is taking longer than expected. Please check your orders.', {
          duration: 5000,
          position: 'top-center',
          icon: '⏳',
        })
        router.push('/orders')
      }, 15000)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [searchParams])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto p-8">
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-gray-600">
              Your tickets have been purchased successfully. You will receive a confirmation email shortly.
            </p>
            <div className="mt-8">
              <button
                onClick={() => router.push('/tickets')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View More Tickets
              </button>
            </div>
          </div>
        ) : status === 'failure' ? (
          <div className="text-center">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="mt-2 text-gray-600">
              Something went wrong with your payment. Please try again.
            </p>
            <div className="mt-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your payment...<br />You will be redirected to your orders shortly.<br />If not, click the button below.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/orders')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 