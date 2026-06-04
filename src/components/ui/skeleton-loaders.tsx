"use client";

import { motion } from "framer-motion";

const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "200%",
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};

const Shimmer = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="h-full w-full bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent opacity-30"
    />
  </div>
);

export function SkeletonCard() {
  return (
    <div className="relative h-24 overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#262626]">
      <Shimmer />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="relative h-[72px] overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#262626]">
      <Shimmer />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-[#1A1A1A] border border-[#262626]">
      <Shimmer />
    </div>
  );
}
