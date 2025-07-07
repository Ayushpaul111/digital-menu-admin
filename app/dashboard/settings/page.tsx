"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeader } from "../../components/ui/PageHeader";

const SettingsCard = memo(
  ({ children, title }: { children: React.ReactNode; title: string }) => (
    <motion.div
      className="bg-white shadow-sm rounded-xl p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
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
        <SettingsCard title="Support & Contact">
          <p className="text-gray-600 mb-4">
            Reach out to us for any help or support.
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 font-medium">Call Us</p>
              <a
                href="tel:+919064995568"
                className="text-purple-600 hover:underline text-base"
              >
                +91 9064995568
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-700 font-medium">WhatsApp</p>
              <a
                href={`https://wa.me/9064995568?text=${encodeURIComponent(
                  `Support needed for admin`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-700 font-medium">Email</p>
              <a
                href="ayushpaul1111@gmail.com"
                className="text-purple-600 hover:underline text-base"
              >
                ayushpaul1111@gmail.com
              </a>
            </div>
          </div>
        </SettingsCard>
      </motion.div>
    </DashboardLayout>
  );
}
