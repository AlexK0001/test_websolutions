"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Zap,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name || "" },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      updateUser(json);
      toast({ title: "Profile updated!", variant: "success" });
      setIsEditing(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({ name: user?.name || "" });
    setIsEditing(false);
  };

  const isPremium = user?.plan === "premium";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Avatar + Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold truncate">{user?.name}</h2>
                  <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
                </div>
                <Badge variant={isPremium ? "premium" : "outline"}>
                  {isPremium ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" /> Premium
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-1" /> Free
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-violet-500" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your display name</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="gradient"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Name</div>
                      <div className="text-sm font-medium">{user?.name}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </div>
                      <div className="text-sm font-medium truncate">{user?.email}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-500" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Member since
                  </div>
                  <span className="text-sm font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    Emails today
                  </div>
                  <span className="text-sm font-medium">
                    {user?.emailsGeneratedToday || 0}
                    {!isPremium && (
                      <span className="text-muted-foreground"> / 10</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Crown className="w-4 h-4" />
                    Current plan
                  </div>
                  <Badge variant={isPremium ? "premium" : "outline"} className="capitalize">
                    {user?.plan}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade card */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
              <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-violet-500" />
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Unlimited emails, priority generation, and more.
                  </p>
                </div>
                <Button variant="gradient" asChild>
                  <Link href="/pricing">
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}