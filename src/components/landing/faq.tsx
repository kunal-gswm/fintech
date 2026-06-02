"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is AI Finance free to use?",
    answer:
      "AI Finance offers a generous free tier that includes expense tracking, basic analytics, and goal planning. Premium features like the AI assistant, advanced reports, and financial health score are available with our Pro plan.",
  },
  {
    question: "How does the AI assistant work?",
    answer:
      "Our AI assistant is trained on financial best practices and your anonymized spending data. It can analyze your spending patterns, suggest budget optimizations, answer investment questions, and help you plan for financial goals — all in natural language.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. Your data never leaves Indian servers and is never sold to third parties. We are SOC 2 Type II certified and RBI compliant.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. You can export your expense data, reports, and analytics in both CSV and PDF formats at any time. We believe in data portability — your data is yours.",
  },
  {
    question: "How is the Financial Health Score calculated?",
    answer:
      "Your score is based on four key metrics: savings rate (how much of your income you save), emergency fund coverage (months of expenses covered), investment diversification, and risk coverage (insurance). Each metric is weighted and combined into a 0-100 score.",
  },
  {
    question: "Does AI Finance connect to my bank account?",
    answer:
      "Currently, AI Finance works with manual expense entry and CSV imports. We're building bank integrations via Account Aggregator framework and will launch them in Q2 2026.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-3 inline-flex rounded-full border border-border bg-background px-4 py-1 text-sm font-medium text-muted-foreground">
            FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about AI Finance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-12"
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
