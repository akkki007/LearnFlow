"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student"); // Default role is 'student'
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }



      // ✅ Store token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ✅ Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "student") {
        router.push("/student-dashboard");
      } else if (data.role === "teacher") {
        router.push("/teacher-dashboard");
      }

      // ✅ Display success toast
      toast.success("Login successful! Redirecting...");

    } catch (error) {
      console.error("Login failed:", error.message);

      // ✅ Display error toast
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Role Toggle */}
      <div className="grid gap-2">
        <Label htmlFor="role">Login as:</Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      {/* Social Login */}
      <div className="relative text-center text-sm">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <Button variant="outline" className="w-full">
        Login with Google
      </Button>

      {/* Registration Link */}
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-emerald-600 font-medium hover:text-emerald-800 hover:underline">
          Register
        </Link>
      </div>
    </form>
  );
}