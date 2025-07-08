import { memo, useEffect } from "react";
import { X, Home, Settings, LogOut, CookingPot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { SidebarLink } from "./SidebarLink";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { useToggle } from "../../hooks/useToggle";
import type { SidebarItem } from "../../../types/layout";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const sidebarItems: SidebarItem[] = [
  { id: "home", label: "Home", href: "/dashboard", icon: Home },
  { id: "menu", label: "Menu", href: "/dashboard/Menu", icon: CookingPot },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const Sidebar = memo(({ isOpen, onClose, onToggle }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, toggleLogoutConfirm] = useToggle(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      onClose();
    }
  }, [pathname, onClose]);

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

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/50 z-20 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - FIXED: Always visible on desktop */}
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "tween", duration: 0.3 }}
        className={`
          fixed top-0 z-30 inset-y-0 left-0 w-64 bg-white shadow-xl
          md:relative md:translate-x-0 md:shadow-none md:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[16.7px] border-b border-gray-200">
          <motion.h2
            className="text-xl font-semibold text-purple-700"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <a href="/dashboard">
              <img
                src="https://www.ehike.in/assets/logo-BSbxCYFZ.png"
                alt="Ehike logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </a>
          </motion.h2>

          <motion.button
            className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 border-r border-gray-200">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SidebarLink
                {...item}
                isActive={pathname === item.href}
                onClick={() => router.push(item.href)}
              />
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: sidebarItems.length * 0.1 }}
          >
            <motion.button
              onClick={toggleLogoutConfirm}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </motion.button>
          </motion.div>
        </nav>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={toggleLogoutConfirm}
        onConfirm={handleSignOut}
      />
    </>
  );
});

Sidebar.displayName = "Sidebar";
