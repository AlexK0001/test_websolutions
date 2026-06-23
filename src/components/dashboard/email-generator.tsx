"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { generateEmailSchema, type GenerateEmailInput } from "@/lib/validations";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultCard } from "./result-card";
import { Loader2, Sparkles, Zap } from "lucide-react";
import type { GenerateEmailOutput } from "@/services/ai/types";
import Link from "next/link";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
];

const lengths = [
  { value: "short", label: "Short", desc: "~100 words" },
  { value: "medium", label: "Medium", desc: "~200 words" },
  { value: "long", label: "Long", desc: "~350 words" },
];

export function EmailGenerator() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<GenerateEmailOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<GenerateEmailInput>({
    resolver: zodResolver(generateEmailSchema),
    defaultValues: { tone: "professional", length: "medium" },
  });

  const generate = async (data: GenerateEmailInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          toast({
            title: "Daily limit reached",
            description: "Upgrade to Premium for unlimited emails.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(json.error || "Generation failed");
      }
      setResult(json);
      toast({ title: "Email generated!", variant: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    const values = getValues();
    generate(values);
  };

  const handleClear = () => setResult(null);

  const FREE_LIMIT = 10;
  const remaining =
    user?.plan === "free"
      ? Math.max(0, FREE_LIMIT - (user.emailsGeneratedToday || 0))
      : null;

  return (
    <div className="space-y-6">
      {/* Limit banner */}
      {user?.plan === "free" && remaining !== null && remaining <= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 flex items-center justify-between gap-3"
        >
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <Zap className="inline w-4 h-4 mr-1" />
            {remaining === 0
              ? "You've reached your daily limit."
              : `${remaining} email${remaining === 1 ? "" : "s"} remaining today.`}
          </p>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/pricing">Upgrade</Link>
          </Button>
        </motion.div>
      )}

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Generate Email
          </CardTitle>
          <CardDescription>
            Describe your email topic and customize the style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(generate)} className="space-y-5">
            {/* Topic */}
            <div className="space-y-1.5">
              <Label htmlFor="topic">
                Email Topic{" "}
                <span className="text-muted-foreground font-normal">(required)</span>
              </Label>
              <Textarea
                id="topic"
                placeholder="e.g. Follow up with a client about a project proposal submitted last week..."
                rows={4}
                {...register("topic")}
                className={errors.topic ? "border-destructive" : ""}
              />
              {errors.topic && (
                <p className="text-xs text-destructive">{errors.topic.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tone */}
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Controller
                  name="tone"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Length */}
              <div className="space-y-1.5">
                <Label>Length</Label>
                <Controller
                  name="length"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}{" "}
                            <span className="text-muted-foreground text-xs">
                              {l.desc}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading || (user?.plan === "free" && remaining === 0)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Skeleton loader */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-border/60 bg-card p-6 space-y-3"
        >
          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-3 bg-muted rounded animate-pulse w-4/6" />
          <div className="h-3 bg-muted rounded animate-pulse w-full mt-4" />
          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
        </motion.div>
      )}

      {/* Result */}
      {result && !isLoading && (
        <ResultCard
          result={result}
          onRegenerate={handleRegenerate}
          onClear={handleClear}
          isRegenerating={isLoading}
        />
      )}
    </div>
  );
}