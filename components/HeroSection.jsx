"use client"
import { Button } from "@/components/ui/button";
import { InteractiveGrid } from "./InteractiveGrid";
import { ShineBorder } from "./ShineBorder";
import { Play } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion"; // Import Framer Motion

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-white">
      <InteractiveGrid containerClassName="absolute inset-0" className="opacity-30" points={40} />

      <ShineBorder
        className="relative z-10 max-w-6xl mx-auto px-6"
        borderClassName="border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="text-center mb-16">
          {/* Fade animation for the heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-4xl md:text-6xl mt-7 font-bold mb-6 tracking-tight"
          >
            Empower Learning with Smart Code Execution & Academic Control
          </motion.h1>

          {/* Slide animation for the paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto"
          >
            Seamlessly write, run, and debug code while managing courses, dashboards, and user roles — all in one AI-powered academic platform. Perfect for students, teachers, and admins to stay connected and in control.
          </motion.p>

          {/* Bounce animation for the buttons */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 1.5, type: "spring", bounce: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
              <Play className="w-4 h-4" />
              Demo
            </Button>
            <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
              Download
            </Button>
          </motion.div>
        </div>

        {/* Zoom animation for the image container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        >
          <ShineBorder className="relative mx-auto" borderClassName="border border-white/10 rounded-xl overflow-hidden">
            <div className="relative border border-blue-400 rounded-xl">
              <Image
                src="/view.png"
                alt="Background Gradient"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </ShineBorder>
        </motion.div>
      </ShineBorder>
    </section>
  );
}