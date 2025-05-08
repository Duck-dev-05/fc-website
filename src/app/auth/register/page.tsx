"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful! You can now sign in.");
      } else {
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo.jpg" alt="FC ESCUELA" width={64} height={64} className="rounded-lg mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-center text-gray-900">Create an Account</h2>
          <p className="text-gray-500 text-sm">Join FC ESCUELA to buy tickets and more!</p>
        </div>
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
            <div className="text-green-700 font-semibold mb-2">{success}</div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => router.push('/auth/signin')}
            >
              Go to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 border-gray-300 transition placeholder-gray-400"
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
                className="mt-1 block w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 border-gray-300 transition placeholder-gray-400"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 border-gray-300 transition placeholder-gray-400"
                placeholder="Password"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/auth/signin" className="text-blue-600 hover:underline font-medium">Sign in</a>
        </div>
      </div>
    </div>
  );
}
