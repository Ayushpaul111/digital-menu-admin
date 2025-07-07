import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserSession(sessionStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    if (!loading && !user && !userSession) {
      router.push("/login");
    }
  }, [user, userSession, loading, router]);

  return {
    user,
    userSession,
    isLoading: loading,
    isAuthenticated: !!(user || userSession),
  };
};
