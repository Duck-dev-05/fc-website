"use client";
// This login form does NOT auto-login. Login only happens on form submit, even if fields are pre-filled.
// DEV NOTE: Test accounts for development only (do not display in UI):
// Member:    member@fcescuela.com / test123
// Regular:   user@fcescuela.com / test123
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { UserIcon, UserGroupIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Signed in successfully");
        router.push(result?.url || callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const useMemberAccount = () => {
    setFormData({
      email: "member@fcescuela.com",
      password: "test123"
    });
  };

  const useNonMemberAccount = () => {
    setFormData({
      email: "user@fcescuela.com",
      password: "test123"
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            <Image
              src="/images/logo.jpg"
              alt="ESCUELA FC"
              width={120}
              height={120}
              className="mx-auto mb-6 rounded-lg"
              priority
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to purchase tickets and access exclusive content
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 mb-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.69 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.27 37.27 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.29c-1.01-2.99-1.01-6.19 0-9.18l-7.98-6.2C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 1.69 11.09l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.05 15.53-5.59l-7.19-5.6c-2.01 1.35-4.59 2.14-8.34 2.14-6.43 0-11.87-3.63-13.33-8.79l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => signIn('facebook', { callbackUrl })}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 6.006 4.438 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.797c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.953.926-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.562 22.954 24 18.006 24 12z"/></svg>
              Sign in with Facebook
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Dev account buttons removed */}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block flex-1 bg-cover bg-center" style={{ backgroundImage: "url(/stadium.jpg)" }}>
        <div className="h-full w-full bg-blue-600 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-xl text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">FC ESCUELA</h1>
            <p className="text-xl">Join us in supporting the future of football</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}