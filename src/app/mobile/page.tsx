"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Smartphone,
  Download,
  ArrowRight,
  Check,
  Zap,
  Sparkles,
  BarChart3,
  TrendingUp,
  Globe,
  Shield,
  Play,
  Store,
  Square,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";
import Logo from "@/components/Logo";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create charts on the go in seconds",
    color: "bg-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart suggestions and automatic chart generation",
    color: "bg-blue-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and stays on your device",
    color: "bg-blue-500",
  },
  {
    icon: Globe,
    title: "Offline Support",
    description: "Work without internet connection",
    color: "bg-blue-600",
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-slate-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/mobile" className="text-blue-600 font-medium">
              Mobile
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <GradientButton>Get Started</GradientButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Floating Transparent Shapes - Optimized */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute pointer-events-none will-change-transform"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              left: `${25 + i * 50}%`,
              top: `${25 + i * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div className="w-full h-full rounded-full opacity-5 bg-blue-400 blur-xl" />
          </motion.div>
        ))}

        {/* Floating Chart Icons - Optimized */}
        {[
          { icon: BarChart3, delay: 0, x: "12%", y: "30%" },
          { icon: Sparkles, delay: 1, x: "85%", y: "60%" },
        ].map((item, i) => (
          <motion.div
            key={`icon-${i}`}
            className="absolute pointer-events-none will-change-transform"
            style={{
              left: item.x,
              top: item.y,
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-blue-200/20 flex items-center justify-center">
              <item.icon className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6"
              >
                <Smartphone className="w-4 h-4" />
                Now Available on Mobile
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-blue-600">
                  Create Charts
                </span>
                <br />
                <span className="text-slate-900">Anywhere, Anytime</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl">
                Take the power of AI chart generation with you. Create stunning visualizations on your phone or tablet with our beautiful mobile app.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Store className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Square className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </motion.a>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
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
                  <div className="relative bg-slate-900 rounded-[3rem] p-4 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      {/* Phone Screen */}
                      <div className="bg-blue-600 p-8 min-h-[600px] flex flex-col items-center justify-center">
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
                          <BarChart3 className="w-16 h-16 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Chartizy</h3>
                        <p className="text-blue-100 text-center mb-8">AI-Powered Charts</p>
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
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Love, On Mobile
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-blue-100 hover:border-blue-300 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Beautiful Interface
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                <div className="relative bg-slate-900 rounded-3xl p-3 shadow-2xl">
                  <div className={`${screenshot.gradient} rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden`}>
                    <div className="relative z-10 w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4">
                      <Smartphone className="w-12 h-12 text-white" />
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
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose Mobile?
            </h2>
            <p className="text-xl text-slate-600">
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
                className="flex items-start gap-6 p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-blue-100"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Download Chartizy Mobile and start creating amazing charts today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
              >
                <Store className="w-6 h-6" />
                Download for iOS
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
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

