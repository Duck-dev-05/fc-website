"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  let errorMessage = error;
  if (errorParam === 'OAuthAccountNotLinked') {
    errorMessage = 'An account already exists with this email, but it was registered using a different sign-in method. Please use the original method to log in.';
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/");
    } else {
      setError(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 flex flex-col items-center">
        <Image src="/images/logo.jpg" alt="FC ESCUELA" width={64} height={64} className="rounded-lg mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Sign In</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Sign in to your account to continue</p>
        <form onSubmit={handleSubmit} className="w-full space-y-4 mb-2">
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 border-gray-300 transition placeholder-gray-400"
              placeholder="Email"
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 border-gray-300 transition placeholder-gray-400 pr-10"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5" /> : <AiOutlineEye className="h-5 w-5" />}
            </button>
          </div>
          {errorMessage && <div className="text-red-600 text-sm text-center">{errorMessage}</div>}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition mb-4 shadow-sm"
          onClick={() => signIn("google", { prompt: "select_account", callbackUrl: "/" })}
        >
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-4 shadow-sm"
          onClick={() => signIn("facebook", { callbackUrl: "/" })}
        >
          <FaFacebook className="h-5 w-5" />
          Sign in with Facebook
        </button>
        <div className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account? <a href="/auth/register" className="text-blue-600 hover:underline font-medium">Register</a>
        </div>
      </div>
    </div>
  );
} 