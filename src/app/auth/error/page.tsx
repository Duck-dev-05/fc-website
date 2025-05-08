"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthErrorPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  // Friendly error messages
  const errorMessages: Record<string, string> = {
    OAuthSignin: "There was a problem signing in with the social provider. Please try again or use another method.",
    OAuthCallback: "There was a problem during the OAuth callback. Please try again.",
    OAuthCreateAccount: "Could not create an account with your social login. Please try again.",
    EmailCreateAccount: "Could not create an account with your email. Please try again.",
    Callback: "There was a problem during sign in. Please try again.",
    OAuthAccountNotLinked: "This email is already associated with another sign-in method. Please use the correct provider.",
    EmailSignin: "There was a problem sending the email. Please try again.",
    CredentialsSignin: "Invalid email or password. Please try again.",
    default: "An unknown error occurred. Please try again."
  };

  const message = error ? (errorMessages[error] || errorMessages.default) : errorMessages.default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
        <p className="mb-2 text-gray-700">{message}</p>
        {error && (
          <div className="mt-2 text-xs text-gray-400">Error code: <span className="font-mono">{error}</span></div>
        )}
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorPageInner />
    </Suspense>
  );
} 