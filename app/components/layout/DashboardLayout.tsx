import { ReactNode, memo } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "../ui/Sidebar";
import { TopBar } from "../ui/TopBar";
import { BaseLayout } from "./BaseLayout";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import type { LayoutProps } from "../../types/layout";

interface DashboardLayoutProps extends LayoutProps {
  title: string;
}

export const DashboardLayout = memo(
  ({ children, title, className = "" }: DashboardLayoutProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const sidebar = useSidebar(false); // Start closed on mobile, open on desktop

    if (isLoading) {
      return (
        <BaseLayout>
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"
            />
          </div>
        </BaseLayout>
      );
    }

    if (!isAuthenticated) {
      return null; // Redirect handled in useAuth
    }

    return (
      <BaseLayout className={className}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Always rendered, visibility controlled by CSS */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <Sidebar
              isOpen={true} // Always open on desktop
              onClose={sidebar.close}
              onToggle={sidebar.toggle}
            />
          </div>

          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <Sidebar
              isOpen={sidebar.isOpen}
              onClose={sidebar.close}
              onToggle={sidebar.toggle}
            />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <TopBar title={title} onMenuClick={sidebar.open} />

            <motion.main
              className="flex-1 overflow-y-auto p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.main>
          </div>
        </div>
      </BaseLayout>
    );
  }
);

DashboardLayout.displayName = "DashboardLayout";
