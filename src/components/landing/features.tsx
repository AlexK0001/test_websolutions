"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Sliders, Copy, RefreshCw, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Generate complete, ready-to-send emails in under 3 seconds with Gemini AI.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Sliders,
    title: "Tone Control",
    description:
      "Choose from Professional, Friendly, Formal, Casual, or Persuasive tones.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description:
      "Copy your generated email to clipboard instantly and paste anywhere.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: RefreshCw,
    title: "Regenerate Anytime",
    description:
      "Not happy with the result? Regenerate with one click for a fresh version.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with JWT authentication and encrypted storage.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Globe,
    title: "Any Topic",
    description:
      "Business proposals, follow-ups, complaints, thank-you notes — any topic works.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="gradient-text"> Write Better</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            MailCraft AI combines powerful AI with a simple interface to make
            email writing effortless.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants}>
              <Card className="h-full hover:shadow-md transition-shadow duration-300 border-border/60">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}