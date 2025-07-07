import type { SidebarItem } from "../../../types/layout";

interface SidebarLinkProps extends SidebarItem {
  isActive: boolean;
  onClick: () => void;
}

export const SidebarLink = memo(
  ({ icon: Icon, label, isActive, onClick }: SidebarLinkProps) => {
    return (
      <motion.button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-purple-100 text-purple-700"
            : "text-gray-600 hover:bg-purple-50"
        }`}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon size={18} />
        <span>{label}</span>
      </motion.button>
    );
  }
);

SidebarLink.displayName = "SidebarLink";

// components/ui/TopBar.tsx
import { memo } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export const TopBar = memo(({ title, onMenuClick }: TopBarProps) => {
  return (
    <motion.header
      className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 p-4 flex items-center justify-between md:justify-end"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
        onClick={onMenuClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu size={20} />
      </motion.button>

      <motion.h1
        className="hidden md:block font-semibold text-gray-800 text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h1>
    </motion.header>
  );
});

TopBar.displayName = "TopBar";
