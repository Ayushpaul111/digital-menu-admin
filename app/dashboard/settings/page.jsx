"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import TopBar from "../../components/TopBar";

export default function Settings() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserSession(sessionStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router, userSession]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <TopBar title="Settings" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Account Settings
            </h3>
            <p className="text-gray-600">
              Configure your account preferences here.
            </p>
            <div className="mt-4">
              <label className="block text-gray-600">Theme</label>
              <select className="mt-1 p-2 border rounded w-full max-w-xs">
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
