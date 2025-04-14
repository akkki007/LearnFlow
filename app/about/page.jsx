"use client";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, User, Zap, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion";

const Header = dynamic(() => import("../../components/Header"), { ssr: false });

const Footer = dynamic(() => import("../../components/Footer").then((mod) => mod.FooterWithSocialLinks), { ssr: false });

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
};

export default function About() {
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Refs for scroll animations
  const missionRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (missionInView) {
      controls.start("visible");
    }
  }, [controls, missionInView]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground poppins-regular overflow-hidden">
      <Suspense fallback={<div className="h-20 border-b border-border" />}>
        <Header className="h-20" />
      </Suspense>

      <main className="flex-1 container mx-auto px-4 mt-40 mb-16">
        <motion.section className="max-w-3xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 poppins-extrabold">
              About LearnFlow
            </h1>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          <div className="space-y-8">
            <motion.div
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-border/50"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{
                boxShadow: "0 0 20px rgba(120, 120, 255, 0.15)",
                borderColor: "rgba(120, 120, 255, 0.3)",
                transition: { duration: 0.3 },
              }}
            >
              <p className="text-lg leading-relaxed text-primary poppins-regular">
                LearnFlow is an innovative learning platform designed to streamline the educational experience for
                students and educators alike.
              </p>
            </motion.div>

            <motion.div
              className="mt-12"
              ref={missionRef}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <motion.h2
                className="text-3xl font-bold mb-6 text-primary flex items-center gap-2 poppins-semibold"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
              >
                <motion.span
                  className="w-3 h-3 rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
                />
                Our Mission
              </motion.h2>
              <motion.p
                className="text-lg leading-relaxed pl-5 border-l-2 border-primary/30 poppins-light"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
                }}
              >
                To create a seamless, intuitive platform that enhances learning through technology while maintaining
                simplicity and focus.
              </motion.p>
            </motion.div>

            <motion.section
              className="container mx-auto px-4 py-16 md:py-24 bg-gray-50 rounded-xl"
              ref={missionRef}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -30 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
                    }}
                  >
                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                    <p className="text-lg text-gray-700 mb-6">
                      At LearnFlow, we're on a mission to revolutionize coding education through intelligent, adaptive
                      learning experiences. We believe that everyone should have access to powerful tools that make
                      learning to code intuitive and engaging.
                    </p>
                    <p className="text-lg text-gray-700">
                      Our AI-powered platform combines smart code execution with comprehensive academic management,
                      creating a seamless environment for students, teachers, and administrators.
                    </p>
                  </motion.div>
                  <motion.div
                    className="relative rounded-xl overflow-hidden shadow-xl"
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, x: 30 },
                      visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } },
                    }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vh0pkAjDc2nQr1Nh8JoLwe4LeyqJR6.png"
                      alt="LearnFlow Platform"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="container mx-auto px-4 py-16 md:py-24"
              ref={featuresRef}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2 className="text-3xl font-bold mb-12 text-center" variants={fadeIn}>
                  What Makes Us Different
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={featureCardVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Code className="h-6 w-6 text-green-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">Smart Code Execution</h3>
                    <p className="text-gray-700">
                      Write, run, and debug code seamlessly with real-time suggestions and intelligent error handling.
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={featureCardVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="h-6 w-6 text-blue-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">Academic Control</h3>
                    <p className="text-gray-700">
                      Manage courses, track progress, and administer user roles all in one integrated platform.
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={featureCardVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">Comprehensive Learning</h3>
                    <p className="text-gray-700">
                      Access a rich library of courses, tutorials, and interactive coding challenges for all skill
                      levels.
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={featureCardVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Zap className="h-6 w-6 text-yellow-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">AI-Powered Assistance</h3>
                    <p className="text-gray-700">
                      Get intelligent code suggestions, personalized learning paths, and adaptive feedback.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.section>

        <motion.section
          className="bg-gray-900 text-white py-16 rounded-xl mt-16"
          ref={ctaRef}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-3xl font-bold mb-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              Ready to Transform Your Coding Journey?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
              }}
            >
              Join thousands of students and educators already using LearnFlow to enhance their coding skills and
              teaching capabilities.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } },
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-green-500 hover:bg-green-600 flex items-center gap-2">
                  Try Demo
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Floating animation elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 40, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 20,
              ease: "easeInOut",
            }}
            style={{ top: "10%", left: "5%" }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-secondary/5 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 25,
              ease: "easeInOut",
            }}
            style={{ bottom: "10%", right: "5%" }}
          />
        </div>
      </main>

      <Suspense fallback={<div className="py-6 border-t border-border" />}>
        <Footer className="mt-auto" />
      </Suspense>
    </div>
  );
}