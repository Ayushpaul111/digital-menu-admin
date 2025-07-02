"use client";
import { useState, useEffect } from "react";
import { Menu, X, Home, User, Settings, LogOut } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

function Dashboard() {
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
    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router, userSession]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-purple-700">MyDashboard</h2>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarLink icon={<Home size={18} />} label="Home" />
          <SidebarLink icon={<User size={18} />} label="Profile" />
          <SidebarLink icon={<Settings size={18} />} label="Settings" />

          <button
            onClick={() => {
              signOut(auth);
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("user");
              }
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded transition mt-4"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow p-4 flex items-center justify-between md:justify-end">
          <button className="md:hidden text-gray-700" onClick={toggleSidebar}>
            <Menu />
          </button>
          <h1 className="hidden md:block font-medium text-gray-800 text-lg">
            Welcome Back!
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Users" value="1,240" />
            <Card title="Revenue" value="$32,500" />
            <Card title="Sessions" value="4,918" />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-purple-100 rounded transition">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-semibold text-purple-700 mt-1">{value}</h3>
    </div>
  );
}

export default Dashboard;
