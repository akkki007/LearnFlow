"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2, GraduationCap, BookOpen } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    subjects: z.array(z.string()).optional(), // For teachers
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "student") {
        if (!data.fullname) return false;
        if (!data.enrollmentNo) return false;
        if (!data.division) return false;
      }
      return true;
    },
    {
      message: "Full name, Enrollment No, and Division are required for students",
      path: ["fullname"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "teacher") {
        if (!data.firstName) return false;
        if (!data.lastName) return false;
        if (!data.phoneNumber) return false;
        if (!data.subjects || data.subjects.length === 0) return false;
      }
      return true;
    },
    {
      message: "All fields are required for teachers",
      path: ["firstName"],
    }
  );

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
      subjects: [],
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
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Image and branding */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute mt-16 inset-0 z-0">
          <img
            src="/logo.png"
            alt="Campus"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center max-w-md mx-auto">
          <div className="mb-6 inline-block p-3 bg-blue-100 rounded-full">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 tracking-tighter">Learnflow</h1>
          <p className="text-blue-700 mb-8 text-lg">
            Join our community of learners and educators to unlock your potential.
          </p>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <BookOpen className="h-6 w-6 text-blue-500 mb-2 mx-20" />
                <h3 className="font-semibold text-blue-800">50+ Courses</h3>
                <p className="text-sm text-blue-600">Diverse learning paths</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mb-2 mx-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="font-semibold text-blue-800">Expert Faculty</h3>
                <p className="text-sm text-blue-600">Learn from the best</p>
              </div>
            </div>
          </div>
          <img
  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  alt="Students studying together"
  className="rounded-xl shadow-lg hidden lg:block max-w-sm mx-auto"
/>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold text-blue-900">Create your account</CardTitle>
            <CardDescription className="text-center text-blue-600">Join our academic community today</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          className="bg-white border-blue-200 focus:border-blue-400"
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
                      <FormLabel className="text-blue-800 font-medium">Role</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
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
                          <FormLabel className="text-blue-800 font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="bg-white border-blue-200 focus:border-blue-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="enrollmentNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800 font-medium">Enrollment No</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123456"
                                className="bg-white border-blue-200 focus:border-blue-400"
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
                            <FormLabel className="text-blue-800 font-medium">Division</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="A"
                                className="bg-white border-blue-200 focus:border-blue-400"
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
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800 font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                className="bg-white border-blue-200 focus:border-blue-400"
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
                            <FormLabel className="text-blue-800 font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="bg-white border-blue-200 focus:border-blue-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800 font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123-456-7890"
                                className="bg-white border-blue-200 focus:border-blue-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subjects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800 font-medium">Subjects</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Mathematics, Physics"
                                className="bg-white border-blue-200 focus:border-blue-400"
                                {...field}
                                onChange={(e) => {
                                  const subjectsArray = e.target.value.split(",").map((subject) => subject.trim());
                                  field.onChange(subjectsArray);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white border-blue-200 focus:border-blue-400 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-blue-600 hover:text-blue-800"
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
                      <FormLabel className="text-blue-800 font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white border-blue-200 focus:border-blue-400 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-blue-600 hover:text-blue-800"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 transition-all duration-200 shadow-md hover:shadow-lg"
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
          <CardFooter className="flex justify-center border-t border-blue-100 px-8 py-4">
            <p className="text-sm text-blue-700">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;