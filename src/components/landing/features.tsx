"use client";

import { motion } from "framer-motion";
import {
  Receipt,
  HeartPulse,
  BotMessageSquare,
  Target,
  GraduationCap,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Receipt,
    title: "Expense Tracking",
    description:
      "Log and categorize every expense effortlessly. Get real-time insights into your spending patterns.",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    icon: HeartPulse,
    title: "Financial Health Score",
    description:
      "A comprehensive score based on your savings rate, emergency fund, investments, and risk coverage.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BotMessageSquare,
    title: "AI Advisor",
    description:
      "Get personalized financial advice powered by AI. Ask anything from budgeting to investment strategies.",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    icon: Target,
    title: "Goal Planning",
    description:
      "Set financial goals, track progress, and get projections on when you'll reach each milestone.",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    icon: GraduationCap,
    title: "Financial Education",
    description:
      "Learn about stocks, mutual funds, taxes, and budgeting with curated articles and guides.",
    color: "text-pink-600",
    bg: "bg-pink-500/10",
  },
  {
    icon: FileText,
    title: "Monthly Reports",
    description:
      "Detailed monthly financial reports with AI-generated insights. Export to PDF or CSV anytime.",
    color: "text-cyan-600",
    bg: "bg-cyan-500/10",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3 inline-flex rounded-full border border-border bg-background px-4 py-1 text-sm font-medium text-muted-foreground">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to manage your finances
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From daily expense tracking to long-term investment planning — one
              platform, zero complexity.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${feature.bg} transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
