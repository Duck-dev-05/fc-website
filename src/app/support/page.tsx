"use client";
import { useState } from "react";
import { EnvelopeIcon, PhoneIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Support & Contact</h1>
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <EnvelopeIcon className="h-8 w-8 text-blue-500 mb-2" />
            <div className="font-semibold">Email</div>
            <div className="text-gray-600 text-sm">support@fcescuela.com</div>
          </div>
          <div className="flex flex-col items-center">
            <PhoneIcon className="h-8 w-8 text-blue-500 mb-2" />
            <div className="font-semibold">Phone</div>
            <div className="text-gray-600 text-sm">+1 555-123-4567</div>
          </div>
          <div className="flex flex-col items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500 mb-2" />
            <div className="font-semibold">Live Chat</div>
            <div className="text-gray-600 text-sm">Mon-Fri 9am-5pm</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="How can we help you?"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-all disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
          {success && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mt-4">
              <CheckCircleIcon className="h-5 w-5" />
              Your message has been sent! We'll get back to you soon.
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 