"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Header = dynamic(() => import("../../components/Header"), { ssr: false });

const Footer = dynamic(
  () =>
    import("../../components/Footer").then((mod) => mod.FooterWithSocialLinks),
  { ssr: false }
);

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Suspense fallback={<div className="h-20 border-b border-border" />}>
        <Header className="h-20" />
      </Suspense>

      <main className="flex-1 container mx-auto px-4 mt-40 mb-16">
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              About LearnFlow
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-border/50">
              <p className="text-lg leading-relaxed text-black-300">
                LearnFlow is an innovative learning platform designed to
                streamline the educational experience for students and educators
                alike.
              </p>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed pl-5 border-l-2 border-primary/30">
                To create a seamless, intuitive platform that enhances learning
                through technology while maintaining simplicity and focus.
              </p>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 text-black flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                Key Features
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-primary mt-1">•</span>
                  <span>Attendance tracking</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-primary mt-1">•</span>
                  <span>Grade management</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-primary mt-1">•</span>
                  <span>Practical assignments</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="text-primary mt-1">•</span>
                  <span>Admin dashboard</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="py-6 border-t border-border" />}>
        <Footer className="mt-auto" />
      </Suspense>
    </div>
  );
}
