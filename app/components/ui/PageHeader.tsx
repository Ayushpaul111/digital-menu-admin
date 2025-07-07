import { memo, ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = memo(
  ({ title, subtitle, actions }: PageHeaderProps) => {
    return (
      <motion.div
        className="mb-8 flex justify-between items-end"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              className="text-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {actions}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

PageHeader.displayName = "PageHeader";
