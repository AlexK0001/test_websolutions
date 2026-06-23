"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, RefreshCw, Trash2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GenerateEmailOutput } from "@/services/ai/types";

interface ResultCardProps {
  result: GenerateEmailOutput;
  onRegenerate: () => void;
  onClear: () => void;
  isRegenerating: boolean;
}

export function ResultCard({
  result,
  onRegenerate,
  onClear,
  isRegenerating,
}: ResultCardProps) {
  const { toast } = useToast();
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copy = async (text: string, type: "subject" | "body" | "all") => {
    await navigator.clipboard.writeText(text);
    if (type === "subject") {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === "body") {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
    toast({ title: "Copied to clipboard!", variant: "success" });
  };

  const fullEmail = `Subject: ${result.subject}\n\n${result.body}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-violet-500" />
              Generated Email
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="success">Ready to send</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(fullEmail, "all")}
              >
                {copiedAll ? (
                  <Check className="w-4 h-4 mr-1 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                Copy All
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Subject */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Subject
              </span>
              <button
                onClick={() => copy(result.subject, "subject")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedSubject ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-sm font-medium">{result.subject}</p>
          </div>

          {/* Body */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Body
              </span>
              <button
                onClick={() => copy(result.body, "body")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedBody ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {result.body}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}