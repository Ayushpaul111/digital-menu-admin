"use client";
import { useState, useEffect } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading2, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [authUser] = useAuthState(auth);

  // Check for user session on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = sessionStorage.getItem("user");
      setUserSession(session);
    }
  }, []);

  useEffect(() => {
    if (authUser && userSession) {
      router.push("/dashboard");
    }
  }, [authUser, router, userSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });

      // Check if the operation was successful
      if (res && res.user) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user", "true");
        }
        alert("Account created successfully!");
        router.push("/dashboard");
        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else if (error) {
        // Handle Firebase errors
        console.error("Firebase signup error:", error);
        alert(`Error: ${error.message}`);
      } else {
        // Handle case where res is undefined but no error is caught
        alert("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(`Error: ${err.message || "An unexpected error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                disabled={loading || loading2}
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
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password (min 6 characters)"
                disabled={loading || loading2}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Confirm your password"
                disabled={loading || loading2}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                disabled={loading || loading2}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-500"
                  disabled={loading || loading2}
                >
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-500"
                  disabled={loading || loading2}
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || loading2}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || loading2 ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login">
                <button className="text-purple-600 hover:text-purple-500 font-medium">
                  Log In
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default signup;
