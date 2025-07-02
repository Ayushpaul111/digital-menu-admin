"use client";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans">
      {/* Inline CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-in-out forwards;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/10 transition-all duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 transition-all duration-300">
                NothingVibe
              </h1>
            </div>
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Contact
              </a>
            </div>
            {/* Login/Signup Buttons - Desktop */}
            <div className="hidden md:flex space-x-4">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-gray-300 rounded-full hover:bg-gray-700 hover:border-white hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Sign Up
              </a>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden  animate-fade-in">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/80 backdrop-blur-md transition-all duration-300 ease-in-out">
              <div className="flex flex-col items-center space-y-4 py-4">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-gray-300 rounded-full hover:bg-gray-700 hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out">
        <div className="text-center max-w-4xl animate-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Welcome to the Future
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience a seamless and minimalist platform designed to simplify
            your life with cutting-edge technology.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 text-base sm:text-lg font-medium text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/60"
      >
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 hover:shadow-lg hover:shadow-white/10 hover:scale-105 transition-all duration-300 ease-in-out">
              <h4 className="text-xl sm:text-2xl font-semibold mb-4">
                Minimal Design
              </h4>
              <p className="text-gray-300 text-sm sm:text-base">
                Sleek, intuitive interfaces that prioritize user experience with
                a clean aesthetic.
              </p>
            </div>
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 hover:shadow-lg hover:shadow-white/10 hover:scale-105 transition-all duration-300 ease-in-out">
              <h4 className="text-xl sm:text-2xl font-semibold mb-4">
                Fast Performance
              </h4>
              <p className="text-gray-300 text-sm sm:text-base">
                Optimized for speed, ensuring you get things done without
                delays.
              </p>
            </div>
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 hover:shadow-lg hover:shadow-white/10 hover:scale-105 transition-all duration-300 ease-in-out">
              <h4 className="text-xl sm:text-2xl font-semibold mb-4">
                Secure Platform
              </h4>
              <p className="text-gray-300 text-sm sm:text-base">
                Built with top-tier security to keep your data safe and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-black/60">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © {new Date().getFullYear()} NothingVibe. All rights reserved.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="#privacy"
              className="text-gray-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
