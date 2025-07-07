import { memo, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { useToast } from "../../contexts/ToastContext";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export const TopBar = memo(({ title, onMenuClick }: TopBarProps) => {
  const [user] = useAuthState(auth);

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    return email.split("@")[0];
  };
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 p-4 flex items-center justify-between">
      <motion.button
        className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
        onClick={onMenuClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu size={20} />
      </motion.button>

      <div className="flex items-center md:w-full justify-between">
        <motion.h1
          className="hidden md:block font-semibold text-gray-800 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
            {user?.email ? getInitials(user.email) : "U"}
          </div>

          {/* User Info - Hidden on small screens */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900">
              {user?.email ? getUserDisplayName(user.email) : "User"}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

TopBar.displayName = "TopBar";
