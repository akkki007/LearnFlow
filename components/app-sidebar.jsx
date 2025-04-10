"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  BookOpen,
  Percent,
  School,
  Settings2,
  FileUser,
  BookOpenIcon,
  Home,
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Keep all the original navigation items
  const navigationItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
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
      items:[
        { title: "Add", url: "/pradd" },
      ]
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: CalendarDays,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
     
    },
    
  ];

  useEffect(() => {
    const validateTokenAndSetUser = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        
        const decoded = jwtDecode(token);
        if (!decoded?.email) throw new Error("Invalid token");
        
        setUser({
          name: decoded.email.split("@")[0],
          email: decoded.email,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(decoded.email.split("@")[0])}`,
        });
        setLoading(false);
      } catch (err) {
        console.error("Authentication error:", err.message);
        localStorage.removeItem("token");
        setLoading(false);
        router.push("/login");
      }
    };

    validateTokenAndSetUser();
  }, [router]);

  if (loading) {
    return (
      <div className="w-64 h-full border-r p-4 space-y-4">
        {[...Array(navigationItems.length)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 h-full border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">AcademyHub</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.title}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => router.push(item.url)}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
            
            {/* Render sub-items if they exist */}
            {item.items && item.items.map((subItem) => (
              <Button
                key={subItem.title}
                variant="ghost"
                className="w-full justify-start gap-3 pl-12"
                onClick={() => router.push(subItem.url)}
              >
                {subItem.title}
              </Button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-8 w-8 rounded-full" 
            />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}