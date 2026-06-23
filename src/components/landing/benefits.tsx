"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Save 30+ minutes per day on email writing",
  "Never stare at a blank page again",
  "Consistent professional tone every time",
  "Adapts to any industry or context",
  "Works for cold outreach, replies, and follow-ups",
  "No writing experience needed",
  "Instant results — no waiting",
  "Secure and private by design",
];

export function Benefits() {
  return (
    <section id="benefits" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Teams Love
              <br />
              <span className="gradient-text">MailCraft AI</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Stop wasting time on repetitive email writing. MailCraft AI
              handles the heavy lifting so you can focus on what matters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual demo card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
            <div className="relative glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-muted-foreground">
                  MailCraft AI — Dashboard
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Topic</div>
                  <div className="bg-background/80 rounded-lg px-3 py-2 text-sm border border-border">
                    Follow up with client about project proposal
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tone</div>
                    <div className="bg-background/80 rounded-lg px-3 py-2 text-sm border border-border">
                      Professional
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Length</div>
                    <div className="bg-background/80 rounded-lg px-3 py-2 text-sm border border-border">
                      Medium
                    </div>
                  </div>
                </div>
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    Generated Email
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground text-xs">Subject:</strong> Following Up on Our Project Proposal
                    <br /><br />
                    Dear [Client Name], I hope this message finds you well. I wanted to follow up regarding the project proposal...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}