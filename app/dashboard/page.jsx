"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import TopBar from "../components/TopBar";

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-semibold text-purple-700 mt-1">{value}</h3>
    </div>
  );
}

export default function Dashboard() {
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
        <TopBar title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />
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
