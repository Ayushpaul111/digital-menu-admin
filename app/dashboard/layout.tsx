"use client";
import { ReactNode } from "react";

interface DashboardRootLayoutProps {
  children: ReactNode;
}

export default function DashboardRootLayout({
  children,
}: DashboardRootLayoutProps) {
  // This creates a persistent layout boundary
  // The sidebar and topbar won't re-render when navigating between dashboard pages
  return children;
}

// utils/animation.ts
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};
