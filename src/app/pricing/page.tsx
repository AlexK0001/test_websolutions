"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Check,
  Zap,
  Crown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out MailCraft AI",
    icon: Zap,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted",
    badge: null,
    features: [
      "10 emails per day",
      "All 5 tone options",
      "Short, medium & long lengths",
      "Copy to clipboard",
      "Email history (session)",
      "Basic support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: "/register",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$12",
    period: "per month",
    description: "For professionals who write emails daily",
    icon: Crown,
    iconColor: "text-white",
    iconBg: "bg-gradient-to-br from-violet-600 to-indigo-600",
    badge: "Most Popular",
    features: [
      "Unlimited emails per day",
      "Priority AI generation",
      "All 5 tone options",
      "All length options",
      "Copy to clipboard",
      "Regenerate anytime",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Upgrade to Premium",
    ctaVariant: "gradient" as const,
    href: "/register",
    popular: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-500/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="mb-6 gap-2 px-4 py-1.5 border-violet-500/30 text-violet-600 dark:text-violet-400"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Simple, transparent pricing
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Choose Your
                <span className="gradient-text"> Plan</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Start free, upgrade when you need more. No hidden fees, cancel
                anytime.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge variant="premium" className="px-4 py-1 shadow-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={`h-full transition-all duration-300 hover:shadow-xl ${
                      plan.popular
                        ? "border-violet-500/50 shadow-violet-500/10 shadow-lg ring-1 ring-violet-500/20"
                        : "border-border/60"
                    }`}
                  >
                    <CardHeader className="pb-4 pt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center`}
                        >
                          <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm">
                          / {plan.period}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <Button
                        variant={plan.ctaVariant}
                        size="lg"
                        className="w-full"
                        asChild
                      >
                        <Link
                          href={
                            user
                              ? plan.id === "premium"
                                ? "/dashboard"
                                : "/dashboard"
                              : plan.href
                          }
                        >
                          {plan.id === "premium" && user?.plan === "premium" ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Current Plan
                            </>
                          ) : (
                            <>
                              {plan.cta}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Link>
                      </Button>

                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-sm"
                          >
                            <Check
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                plan.popular
                                  ? "text-violet-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span
                              className={
                                plan.popular ? "" : "text-muted-foreground"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* FAQ note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-16 space-y-2"
            >
              <p className="text-muted-foreground text-sm">
                All plans include access to Gemini AI generation engine.
              </p>
              <p className="text-muted-foreground text-sm">
                Have questions?{" "}
                <Link
                  href="/#faq"
                  className="text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Check our FAQ
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}