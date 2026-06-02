"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    content:
      "AI Finance completely changed how I manage my money. The health score feature gives me clarity I never had before. I went from zero savings discipline to a 45% savings rate in 6 months.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rahul Mehta",
    role: "Product Manager at Flipkart",
    content:
      "The AI assistant is incredible — it's like having a personal financial advisor available 24/7. It caught subscription leaks I didn't even know about.",
    rating: 5,
    initials: "RM",
  },
  {
    name: "Ananya Krishnan",
    role: "Doctor, Apollo Hospitals",
    content:
      "As a busy professional, I needed something that just works. The expense tracking is seamless, and the learning hub helped me start my investment journey with confidence.",
    rating: 5,
    initials: "AK",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex rounded-full border border-border bg-muted/50 px-4 py-1 text-sm font-medium text-muted-foreground">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by 50,000+ users
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our users are saying about their experience.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
