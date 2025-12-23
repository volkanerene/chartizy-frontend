"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Store, Square, ScanLine, Smartphone, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";
import Logo from "@/components/Logo";
import { BlobBackground } from "@/components/BlobBackground";

const features = [
  {
    title: "Lightning Fast",
    description: "Create charts on the go in seconds",
  },
  {
    title: "AI-Powered",
    description: "Smart suggestions and automatic chart generation",
  },
  {
    title: "Secure & Private",
    description: "Your data is encrypted and stays on your device",
  },
  {
    title: "Offline Support",
    description: "Work without internet connection",
  },
];

const screenshots = [
  {
    title: "Dashboard",
    description: "View all your charts in one place",
    gradient: "bg-blue-600",
  },
  {
    title: "Create Chart",
    description: "Generate charts with AI in seconds",
    gradient: "bg-blue-500",
  },
  {
    title: "Templates",
    description: "Choose from 150+ beautiful templates",
    gradient: "bg-blue-600",
  },
  {
    title: "Results",
    description: "View and share your amazing charts",
    gradient: "bg-blue-500",
  },
];

export default function MobilePage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden relative">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <BlobBackground />
      </motion.div>

      {/* Cursor Glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(22, 93, 252, 0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" variant="default" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
              How It Works
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
              Pricing
            </Link>
            <Link href="/mobile" className="text-[#165DFC] font-bold">
              Mobile
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <motion.button
                className="px-6 py-2 rounded-full font-semibold text-gray-700 hover:text-[#165DFC] transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 px-8">

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-xl text-[#165DFC] text-sm font-medium mb-6 border border-white/20"
              >
                Now Available on Mobile
              </motion.div>
              <h1 className="text-7xl md:text-8xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
                  Create Charts
                </span>
                <br />
                <span className="text-gray-900">Anywhere, Anytime</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 max-w-xl">
                Take the power of AI chart generation with you. Create stunning visualizations on your phone or tablet with our beautiful mobile app.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <Store className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <Square className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </motion.a>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5" />
                  <span>Scan QR code to download</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Phone Mockup */}
              <div className="relative mx-auto max-w-sm">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      {/* Phone Screen */}
                      <div className="bg-gradient-to-br from-[#165DFC] to-[#8EC6FF] p-8 min-h-[600px] flex flex-col items-center justify-center">
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6"
                        >
                        </motion.div>
                        <h3 className="text-2xl font-black text-white mb-2">Chartizy</h3>
                        <p className="text-white/90 text-center mb-8">AI-Powered Charts</p>
                        <div className="space-y-3 w-full max-w-xs">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className="h-16 rounded-2xl bg-white/20 backdrop-blur-xl"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              Everything You Love, On Mobile
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              All the power of Chartizy, optimized for your mobile device
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl hover:border-[#165DFC] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="relative py-20 px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              Beautiful Interface
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Experience Chartizy's intuitive design on your mobile device
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {screenshots.map((screenshot, i) => (
              <motion.div
                key={screenshot.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative group"
              >
                <div className="relative bg-gray-900 rounded-3xl p-3 shadow-2xl">
                  <div className={`${screenshot.gradient} rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden`}>
                    <div className="relative z-10 w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4">
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">{screenshot.title}</h3>
                    <p className="text-white/80 text-center text-sm relative z-10">{screenshot.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              Why Choose Mobile?
            </h2>
            <p className="text-xl text-gray-500">
              Create charts wherever inspiration strikes
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: TrendingUp,
                title: "Work on the Go",
                description: "Create charts during meetings, on your commute, or anywhere you are.",
              },
              {
                icon: Zap,
                title: "Instant Sync",
                description: "All your charts sync automatically across all your devices.",
              },
              {
                icon: Sparkles,
                title: "Touch-Optimized",
                description: "Beautiful interface designed specifically for touch interactions.",
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex items-start gap-6 p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] shadow-2xl"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Download Chartizy Mobile and start creating amazing charts today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#165DFC] hover:bg-gray-50 transition-colors font-bold"
              >
                <Store className="w-6 h-6" />
                Download for iOS
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#165DFC] hover:bg-gray-50 transition-colors font-bold"
              >
                <Square className="w-6 h-6" />
                Download for Android
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

