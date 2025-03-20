"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import Bento from "@/components/Bento";
import Colleges from "@/components/Colleges";
import Cta from "@/components/Cta";
import FAQ from "@/components/FAQ";
import { FooterWithSocialLinks } from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useRouter } from "next/navigation";
import BackgroundPaths from "@/components/BackgroundPaths";

export default function Home() {

  const router = useRouter();
  //  useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     const userRole = localStorage.getItem("role");
  
  //     if (token && userRole) {
  //       if (userRole === "admin") {
  //         router.push("/admin");
  //       } else if (userRole === "student") {
  //         router.push("/student");
  //       } else if (userRole === "teacher") {
  //         router.push("/teacher");
  //       }
  //     }
  //   }, [router]);

  return (
    <div className="bg-white">
      <Header />;
      <BackgroundPaths />
      <Cta />
      <Bento />
      <Colleges />
      <FAQ />
      <FooterWithSocialLinks />
    </div>
  );
}
