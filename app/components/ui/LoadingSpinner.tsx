import { memo } from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = memo(
  ({ size = "md", className = "" }: LoadingSpinnerProps) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    return (
      <motion.div
        className={`border-2 border-purple-600 border-t-transparent rounded-full ${sizeClasses[size]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
