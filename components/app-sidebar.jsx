"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Using jwt-decode instead of jwt
import {
  BookOpen,
  Percent,
  GalleryVerticalEnd,
  School,
  Settings2,
  FileUser,
  BookOpenIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const navigationItems = [
  {
    title: "Attendance",
    url: "/attendance",
    icon: School,
  },
  {
    title: "Marks",
    url: "/marks",
    icon: Percent,
  },
  {
    title: "Practicals",
    url: "/practicals",
    icon: BookOpenIcon,
  },
  {
    title: "Performance",
    url: "#",
    icon: FileUser,
    items: [
      { title: "Introduction", url: "#" },
      { title: "Get Started", url: "#" },
      { title: "Tutorials", url: "#" },
      { title: "Changelog", url: "#" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      { title: "General", url: "#" },
      { title: "Team", url: "#" },
      { title: "Billing", url: "#" },
      { title: "Limits", url: "#" },
    ],
  },
];

const teamData = [
  {
    name: "Government Polytechnic Pune",
    logo: GalleryVerticalEnd,
    plan: "Educational Institute",
  },
];

export function AppSidebar(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const validateTokenAndSetUser = () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No token found");
        }

        const decoded = jwtDecode(token);
        
        if (!decoded?.email || !decoded?.role) {
          throw new Error("Invalid token structure");
        }

        // Check token expiry
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          throw new Error("Token expired");
        }

        // Validate role
        if (decoded.role !== "teacher") {
          throw new Error("Unauthorized role");
        }

        // Set user details
        const name = decoded.email.split("@")[0];
        const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

        setUser({
          name,
          email: decoded.email,
          avatar,
        });
        setLoading(false);
      } catch (err) {
        console.error("Authentication error:", err.message);
        localStorage.removeItem("token");
        setError(err.message);
        setLoading(false);
        router.push("/unauthorized");
      }
    };

    validateTokenAndSetUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-md" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-md mt-auto" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-500 font-medium mb-2">
          Unauthorized Access
        </div>
        <p className="text-sm text-muted-foreground">
          {error || "Please login with teacher credentials"}
        </p>
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}