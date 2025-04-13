"use client"
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Calendar,
  Code2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import './page.css'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {

  const [user, setUser] = useState({});
  const router = useRouter();
  const [practicals, setPracticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchPracticals = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = jwtDecode(token).id;
        const res = await fetch(`/api/dashboard/prac?studentId=${userId}`);
        const data = await res.json();
        
        setPracticals(data);
      } catch (error) {
        console.error("Error fetching practicals:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPracticals();
  }, []);

  const filteredPracticals = practicals.filter(practical => {
    if (activeTab === "all") return true;
    return practical.status === activeTab;
  });
  const deadlinePracticals = practicals.filter(practical =>
    ["pending", "approved"].includes(practical.status)
  );
  


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
  
    if (token) {
      const decoded = jwtDecode(token);
      const email = decoded.email; // Extract email from the decoded token
      const namePart = email.split('@')[0]; // Extract name by splitting the email at '@'
      const name = namePart.replace(/[0-9]/g, ''); // Remove numbers from name
      setUser({ email, name }); // Set the user state with email and name
    }
  
    if (token && userRole) {
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "student") {
        router.push("/student");
      } else if (userRole === "teacher") {
        router.push("/teacher");
      }
    }
  }, [router]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "Issue":
        return <Badge className="bg-red-500">Needs Fix</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col poppins-regular">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-primary hover:bg-muted">
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link
                href="/student"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary hover:bg-primary/20"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/code-practice"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <Code2 className="h-5 w-5" />
                Code Practice
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <BookOpen className="h-5 w-5" />
                Courses
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <Calendar className="h-5 w-5" />
                Schedule
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <MessageSquare className="h-5 w-5" />
                Messages
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Learnflow</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline-flex">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r bg-muted/40 md:flex">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/student" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/code-practice"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <Code2 className="h-4 w-4" />
              Code Practice
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Courses
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Link>
            <Link
              href="http://localhost:8080/signup"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-white bg-red-500 hover:bg-muted hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">+1 from last semester</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 due this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Coding Challenges</CardTitle>
                <Code2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">12 completed this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8</div>
                <p className="text-xs text-muted-foreground">+0.2 from last semester</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Data Structures & Algorithms</span>
                      </div>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">Web Development</span>
                      </div>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2 bg-muted [&>div]:bg-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Machine Learning</span>
                      </div>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2 bg-muted [&>div]:bg-green-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm font-medium">Database Systems</span>
                      </div>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2 bg-muted [&>div]:bg-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Don&apos;t miss these important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </>
                  ) : (
                    <>
                    {deadlinePracticals.map((practical) => (
  <div key={practical._id} className="flex items-center gap-4">
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
      practical.status === "pending" ? "bg-yellow-500/10" : "bg-green-500/10"
    }`}>
      <Calendar className={`h-5 w-5 ${
        practical.status === "pending" ? "text-yellow-500" : "text-green-500"
      }`} />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium leading-none">
        {practical.title} (Practical {practical.practicalNo})
      </p>
      <p className="text-sm text-muted-foreground">
        {practical.subject} - {practical.status.charAt(0).toUpperCase() + practical.status.slice(1)}
      </p>
    </div>
  </div>
))}

                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Deadlines
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Practicals</CardTitle>
          <CardDescription>Track your practical submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredPracticals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No practicals found
                    </div>
                  ) : (
                    filteredPracticals.map((practical) => (
                      <Card key={practical._id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                Practical {practical.practicalNo}: {practical.title}
                              </CardTitle>
                              <CardDescription>
                                {practical.subject}
                              </CardDescription>
                            </div>
                            {getStatusBadge(practical.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm line-clamp-2">
                            {practical.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <Link href={`/code-practice`}>
                              {practical.status === "Not Started" 
                                ? "Start Practical" 
                                : "View Details"}
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
        </main>
      </div>
    </div>
  );
}