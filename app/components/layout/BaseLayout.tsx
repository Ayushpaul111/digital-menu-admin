import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

export const BaseLayout = ({ children, className = "" }: BaseLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
