"use client";
import { useState, useEffect } from "react";
import {
  useSignInWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);

  // Check sessionStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserSession(sessionStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    if (user && userSession) {
      router.push("/dashboard");
    }
  }, [user, router, userSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });

      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", "true");
        setUserSession("true");
      }

      if (res && res.user) {
        router.push("/dashboard");
      } else if (!res) {
        console.log("Invalid email or password");
      }

      // Clear form only on successful login
      if (res && res.user) {
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-12 rounded-lg flex items-center justify-center mb-6">
              <img src="./ehike.png" alt="logo" className="w-full" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                placeholder="Enter your email"
                disabled={isLoading || loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Enter your password"
                  disabled={isLoading || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading || loading}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122l-4.242 4.242M21 3l-6.878 6.878"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  disabled={isLoading || loading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember for 30 days
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-500 disabled:opacity-50"
                disabled={isLoading || loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading || loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Google Sign In Button */}
            <button
              type="button"
              disabled={isLoading || loading}
              className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-green-600 hover:text-green-500 font-medium cursor-pointer">
                  Sign up for free
                </span>
              </Link>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-center mt-4 text-sm">
              {error.message}
            </p>
          )}
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden rounded-4xl m-4 lg:flex flex-1 bg-gradient-to-br from-green-800 to-green-900 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Let&apos;s not make your customers wait
          </h2>

          {/* Mock payment card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWNzazMxcjhiZmJ6eGg0bnQ5cTduM3BjbXF0ODBnZjNnNnhtb2cxMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IThjAlJnD9WNO/giphy.gif"
              alt=""
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
