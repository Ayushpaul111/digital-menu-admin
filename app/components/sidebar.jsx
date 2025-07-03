"use client";
import { useState } from "react";
import { Menu, X, Home, User, Settings, LogOut } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const SidebarLink = ({ icon, label, href }) => {
    const isActive = pathname === href;
    return (
      <button
        onClick={() => router.push(href)}
        className={`w-full flex items-center gap-3 px-4 py-2 ${
          isActive ? "bg-purple-100 text-purple-700" : "text-gray-700"
        } hover:bg-purple-100 rounded transition`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div
      className={`fixed top-0 z-30 inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-purple-700">MyDashboard</h2>
        <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
          <X />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        <SidebarLink icon={<Home size={18} />} label="Home" href="/dashboard" />
        <SidebarLink
          icon={<User size={18} />}
          label="Clients"
          href="/dashboard/clients"
        />
        <SidebarLink
          icon={<Settings size={18} />}
          label="Settings"
          href="/dashboard/settings"
        />
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
  );
}
