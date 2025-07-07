"use client";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeader } from "../../components/ui/PageHeader";

const SettingsCard = memo(
  ({ children, title }: { children: React.ReactNode, title: string }) => (
    <motion.div
      className="bg-white shadow-sm rounded-xl p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        shadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 },
      }}
    >
      <h3 className="text-xl font-semibold text-purple-700 mb-4">{title}</h3>
      {children}
    </motion.div>
  )
);

SettingsCard.displayName = "SettingsCard";

export default function Settings() {
  const [theme, setTheme] = useState("light");

  return (
    <DashboardLayout title="Settings">
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and application settings."
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SettingsCard title="Account Settings">
          <p className="text-gray-600 mb-4">
            Configure your account preferences here.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Theme
              </label>
              <motion.select
                className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </motion.select>
            </div>

            <motion.button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </div>
        </SettingsCard>
      </motion.div>
    </DashboardLayout>
  );
}
