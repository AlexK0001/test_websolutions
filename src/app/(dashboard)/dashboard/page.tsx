"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { EmailGenerator } from "@/components/dashboard/email-generator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Mail, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const FREE_LIMIT = 10;
  const used = user?.emailsGeneratedToday || 0;
  const isPremium = user?.plan === "premium";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back,{" "}
              <span className="gradient-text">
                {user?.name.split(" ")[0]}
              </span>{" "}
              👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate your perfect email below
            </p>
          </div>
          <Badge variant={isPremium ? "premium" : "outline"} className="text-sm px-3 py-1">
            {isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5 mr-1" />
                Premium
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 mr-1" />
                Free Plan
              </>
            )}
          </Badge>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{used}</div>
              <div className="text-xs text-muted-foreground">Emails today</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {isPremium ? "∞" : `${Math.max(0, FREE_LIMIT - used)}`}
              </div>
              <div className="text-xs text-muted-foreground">Remaining today</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <div className="text-sm font-bold capitalize">{user?.plan}</div>
              <div className="text-xs text-muted-foreground">Current plan</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade banner for free users */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4 flex items-center justify-between gap-3"
        >
          <div>
            <p className="font-medium text-sm">Unlock Unlimited Emails</p>
            <p className="text-xs text-muted-foreground">
              Upgrade to Premium for unlimited daily generations
            </p>
          </div>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/pricing">
              Upgrade
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <EmailGenerator />
      </motion.div>
    </div>
  );
}