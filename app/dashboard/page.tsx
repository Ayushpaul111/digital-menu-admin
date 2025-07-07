"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { PageHeader } from "../components/ui/PageHeader";

const StatCard = memo(
  ({
    title,
    value,
    index,
  }: {
    title: string,
    value: string,
    index: number,
  }) => (
    <motion.div
      className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <motion.h3
        className="text-2xl font-bold text-purple-700 mt-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {value}
      </motion.h3>
    </motion.div>
  )
);

StatCard.displayName = "StatCard";

const statsData = [
  { title: "Orders", value: "1,240" },
  { title: "Revenue", value: "$32,500" },
  { title: "Sessions", value: "4,918" },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your business today."
      />

      <motion.div
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            index={index}
          />
        ))}
      </motion.div>
    </DashboardLayout>
  );
}
