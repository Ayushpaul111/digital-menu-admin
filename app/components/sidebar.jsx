"use client";
import { X, Home, Settings, LogOut, CookingPot } from "lucide-react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("user");
      }
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const SidebarLink = ({ icon, label, href }) => {
    const isActive = pathname === href;
    return (
      <button
        onClick={() => router.push(href)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${
          isActive
            ? "bg-purple-100 text-purple-700"
            : "text-gray-600 hover:bg-purple-50"
        } rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Navigate to ${label}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500/20 bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 z-30 inset-y-0 left-0 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 md:shadow-none`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-purple-700">
            <img
              src="https://www.ehike.in/assets/logo-BSbxCYFZ.png"
              alt="Ehike logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </h2>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <SidebarLink
            icon={<Home size={18} />}
            label="Home"
            href="/dashboard"
          />
          <SidebarLink
            icon={<CookingPot size={18} />}
            label="Menu"
            href="/dashboard/Menu"
          />
          <SidebarLink
            icon={<Settings size={18} />}
            label="Settings"
            href="/dashboard/settings"
          />
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/20">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Sign Out
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to sign out?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Cancel sign out"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Confirm sign out"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
