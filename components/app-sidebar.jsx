"use client";

import * as React from "react";
import {
  BookOpen,
  Percent,
  GalleryVerticalEnd,
  School,
  Settings2,
  FileUser
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
    if (!token) {
      router.push("/unauthorized");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      if (decoded.role !== "teacher") {
        router.push("/unauthorized");
        return;
      }

      // Extract name from email
      const name = decoded.email.split("@")[0];
      const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

      setUser({
        name,
        email: decoded.email,
        avatar,
      });
    } catch (error) {
      console.error("Invalid token:", error.message);
      router.push("/unauthorized");
    }
  }, [router]);

  const data = {
    teams: [
      {
        name: "Government Polytechnic Pune",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
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
