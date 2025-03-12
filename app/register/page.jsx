"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    role: z.enum(["student", "teacher"]),
    fullname: z.string().optional(), // For students
    enrollmentNo: z.string().optional(), // For students
    division: z.string().optional(), // For students
    firstName: z.string().optional(), // For teachers
    lastName: z.string().optional(), // For teachers
    phoneNumber: z.string().optional(), // For teachers
    subject: z.string().optional(), // For teachers
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "student") {
      if (!data.fullname) return false;
      if (!data.enrollmentNo) return false;
      if (!data.division) return false;
    }
    return true;
  }, {
    message: "Full name, Enrollment No, and Division are required for students",
    path: ["fullname"],
  })
  .refine((data) => {
    if (data.role === "teacher") {
      if (!data.firstName) return false;
      if (!data.lastName) return false;
      if (!data.phoneNumber) return false;
      if (!data.subject) return false;
    }
    return true;
  }, {
    message: "All fields are required for teachers",
    path: ["firstName"],
  });

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
      fullname: "",
      enrollmentNo: "",
      division: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      subject: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success(data.message);
      router.push("/login");
    } catch (error) {
      toast.error(error.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-start bg-white">
      <Card className="w-[50%] max-w-md mx-32 my-12 bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold text-emerald-800">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-emerald-600">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-800">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        className="text-emerald-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-800">Role</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-emerald-900">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-emerald-900">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {form.watch("role") === "student" && (
                <>
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-800">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="text-emerald-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enrollmentNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-800">
                            Enrollment No
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123456"
                              className="text-emerald-900"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-800">
                            Division
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="A"
                              className="text-emerald-900"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {form.watch("role") === "teacher" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-800">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            className="text-emerald-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-800">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="text-emerald-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-800">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123-456-7890"
                            className="text-emerald-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-800">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mathematics"
                            className="text-emerald-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-800">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10 text-emerald-900"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-emerald-600 hover:text-emerald-800"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-800">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10 text-emerald-900"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-emerald-600 hover:text-emerald-800"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-emerald-100 px-8 py-4">
          <p className="text-sm text-emerald-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 font-medium hover:text-emerald-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <div className="w-[60%] h-[60vw] mx-32">
        <img
          src="/rightbg.jpg"
          alt="Image"
          className="inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default RegisterPage;