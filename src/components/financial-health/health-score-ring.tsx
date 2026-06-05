"use client";

import { motion } from "framer-motion";

interface HealthScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
}

export function HealthScoreRing({
  score,
  maxScore = 100,
  size = 200,
}: HealthScoreRingProps) {
  const percentage = (score / maxScore) * 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getColor = () => {
    if (percentage >= 80) return "#10B981";
    if (percentage >= 60) return "#2563EB";
    if (percentage >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glowing Aura Backdrop */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 blur-2xl" 
          style={{ backgroundColor: getColor() }} 
        />
        <svg
          className="relative -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset:
                circumference - (percentage / 100) * circumference,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-flex rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
          style={{
            backgroundColor: `${getColor()}15`,
            color: getColor(),
          }}
        >
          {getLabel()}
        </motion.div>
      </div>
    </div>
  );
}
