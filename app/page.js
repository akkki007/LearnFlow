"use client";
import Bento from "@/components/Bento";
import Colleges from "@/components/Colleges";
import Cta from "@/components/Cta";
import FAQ from "@/components/FAQ";
import { FooterWithSocialLinks } from "@/components/Footer";
import Header from "@/components/Header";

import { HeroSection } from "@/components/HeroSection";

export default function Home() {

  return (
    <div className="bg-white -mt-10">
      <Header />;
      <HeroSection />
      <Cta />
      <Bento />
      <Colleges />
      <FAQ />
      <FooterWithSocialLinks />
    </div>
  );
}
