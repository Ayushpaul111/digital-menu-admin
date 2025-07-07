"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles,
} from "lucide-react";
import { ToastData } from "../../contexts/ToastContext";

interface ToastProps {
  toast: ToastData;
  onRemove: () => void;
}

export const Toast = ({ toast, onRemove }: ToastProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (toast.duration! / 100);
        if (newProgress <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration]);

  const getToastConfig = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: CheckCircle,
          iconColor: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          progressColor: "bg-green-500",
          titleColor: "text-green-800",
          messageColor: "text-green-600",
        };
      case "error":
        return {
          icon: XCircle,
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          progressColor: "bg-red-500",
          titleColor: "text-red-800",
          messageColor: "text-red-600",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          progressColor: "bg-yellow-500",
          titleColor: "text-yellow-800",
          messageColor: "text-yellow-600",
        };
      case "info":
        return {
          icon: Info,
          iconColor: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          progressColor: "bg-blue-500",
          titleColor: "text-blue-800",
          messageColor: "text-blue-600",
        };
      default:
        return {
          icon: Info,
          iconColor: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          progressColor: "bg-gray-500",
          titleColor: "text-gray-800",
          messageColor: "text-gray-600",
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: -50,
        scale: 0.95,
        x: 400,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.95,
        x: 400,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={`
        relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm
        ${config.bgColor} ${config.borderColor}
      `}
    >
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
          <motion.div
            className={`h-full ${config.progressColor}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 300,
            }}
            className="flex-shrink-0"
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.p
              className={`text-sm font-semibold ${config.titleColor}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {toast.title}
            </motion.p>

            {toast.message && (
              <motion.p
                className={`text-sm mt-1 ${config.messageColor}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {toast.message}
              </motion.p>
            )}

            {/* Action Button */}
            {toast.action && (
              <motion.button
                onClick={toast.action.onClick}
                className={`
                  text-sm font-medium mt-2 px-3 py-1 rounded-md
                  ${config.titleColor} hover:bg-white/50 transition-colors
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {toast.action.label}
              </motion.button>
            )}
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onRemove}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white/50 transition-colors"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Success Sparkle Effect */}
      {toast.type === "success" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Sparkles className="absolute top-2 right-8 w-4 h-4 text-green-400" />
          <motion.div
            className="absolute top-6 right-12 w-2 h-2 bg-green-300 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.div
            className="absolute top-4 right-16 w-1 h-1 bg-green-400 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
