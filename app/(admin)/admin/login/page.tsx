"use client";

import React from "react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { saveSession, ADMIN_COOKIE } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save admin session
    saveSession({
      role: "admin",
      userId: formData.username,
      name: "Administrator",
      token: "admin-token-" + Date.now(),
    });

    // Set cookie for middleware
    document.cookie = `${ADMIN_COOKIE}=true; path=/; max-age=${60 * 60 * 24 * 7}`;

    setIsLoading(false);
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-success/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-success/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 border border-success/20 mb-4">
            <Fingerprint className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Sistem Absensi
          </h1>
          <p className="text-muted-foreground mt-1">
            Masuk ke akun administrator Anda
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Login Administrator</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-success/50 focus:ring-success/20"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10 h-11 bg-secondary/50 border-border/50 focus:border-success/50 focus:ring-success/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-secondary/50 text-success focus:ring-success/20"
                  />
                  <span className="text-muted-foreground">Ingat saya</span>
                </label>
                <button
                  type="button"
                  className="text-success hover:text-success/80 transition-colors"
                >
                  Lupa password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-success hover:bg-success/90 text-success-foreground font-medium transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          NuansPresens - Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}
