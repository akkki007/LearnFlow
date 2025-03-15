"use client";

import * as React from "react";
import {
  BookOpen,
  Percent,
  GalleryVerticalEnd,
  School,
  Settings2,
  FileUser,
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

import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export function AppSidebar(props) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debugging

    try {
      const decoded = jwt.decode(token);
      console.log("Decoded Token:", decoded); // Debugging

      if (!decoded || !decoded.email || !decoded.role) {
        console.error("Invalid token structure");
        localStorage.removeItem("token");
        router.push("/unauthorized");
        return;
      }

      // Check token expiry
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decoded.exp && decoded.exp < currentTime) {
        console.error("Token expired");
        localStorage.removeItem("token");
        router.push("/unauthorized");
        return;
      }

      // Validate role
      if (decoded.role !== "teacher") {
        console.error("Unauthorized role:", decoded.role);
        router.push("/login");
        return;
      }

      // Set user details
      const name = decoded.email.split("@")[0];
      const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

      setUser({
        name,
        email: decoded.email,
        avatar,
      });
    } catch (error) {
      console.error("Invalid token:", error.message);
      localStorage.removeItem("token"); // Clear invalid token
      router.push("/unauthorized");
    }
  }, [router]);

  const data = {
    teams: [
      {
        name: "Government Polytechnic Pune",
        logo: GalleryVerticalEnd,
        plan: "Educational Institute",
      },
    ],
    navMain: [
      {
        title: "Attendance",
        url: "/attendance", // Link to the Attendance page
        icon: School,
      },
      {
        title: "Marks",
        url: "/marks", // Link to the Marks page
        icon: Percent,
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
    ],
  };

  if (!user) {
    return <div className="text-center text-red-500">Unauthorized Access</div>;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}