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

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create charts on the go in seconds",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart suggestions and automatic chart generation",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and stays on your device",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Offline Support",
    description: "Work without internet connection",
    color: "from-pink-500 to-rose-500",
  },
];

const screenshots = [
  {
    title: "Dashboard",
    description: "View all your charts in one place",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Create Chart",
    description: "Generate charts with AI in seconds",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Templates",
    description: "Choose from 150+ beautiful templates",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Results",
    description: "View and share your amazing charts",
    gradient: "from-pink-500 to-rose-600",
  },
];

export default function MobilePage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-violet-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">Graphzy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-slate-600 hover:text-violet-600 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-slate-600 hover:text-violet-600 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-violet-600 transition-colors">
              Pricing
            </Link>
            <Link href="/mobile" className="text-violet-600 font-medium">
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
        {/* Background Gradient */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl" />
        </motion.div>

        {/* Floating Transparent Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: `${100 + i * 30}px`,
              height: `${100 + i * 30}px`,
              left: `${(i * 12.5) % 100}%`,
              top: `${20 + (i * 15) % 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div
              className={`w-full h-full rounded-full opacity-20 blur-xl ${
                i % 3 === 0
                  ? "bg-gradient-to-br from-violet-400 to-purple-500"
                  : i % 3 === 1
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                  : "bg-gradient-to-br from-pink-400 to-rose-500"
              }`}
            />
          </motion.div>
        ))}

        {/* Floating Chart Icons */}
        {[
          { icon: BarChart3, delay: 0, x: "10%", y: "15%" },
          { icon: TrendingUp, delay: 1, x: "85%", y: "25%" },
          { icon: Sparkles, delay: 2, x: "15%", y: "70%" },
          { icon: Zap, delay: 1.5, x: "80%", y: "75%" },
        ].map((item, i) => (
          <motion.div
            key={`icon-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: item.x,
              top: item.y,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <item.icon className="w-8 h-8 text-violet-400" />
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6"
              >
                <Smartphone className="w-4 h-4" />
                Now Available on Mobile
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
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
                      <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-8 min-h-[600px] flex flex-col items-center justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6"
                        >
                          <BarChart3 className="w-16 h-16 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Graphzy</h3>
                        <p className="text-violet-100 text-center mb-8">AI-Powered Charts</p>
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
                {/* Floating Transparent Elements */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full backdrop-blur-xl border border-white/20"
                    style={{
                      width: `${60 + i * 20}px`,
                      height: `${60 + i * 20}px`,
                      top: `${15 + i * 15}%`,
                      left: i % 2 === 0 ? "-15%" : "115%",
                      background: `linear-gradient(135deg, ${
                        i % 3 === 0
                          ? "rgba(139, 92, 246, 0.2)"
                          : i % 3 === 1
                          ? "rgba(6, 182, 212, 0.2)"
                          : "rgba(236, 72, 153, 0.2)"
                      }, transparent)`,
                    }}
                    animate={{
                      y: [0, -50, 0],
                      x: [0, i % 2 === 0 ? 30 : -30, 0],
                      rotate: [0, 180, 360],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 5 + i * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Floating Background Elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`feature-bg-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: `${200 + i * 40}px`,
              height: `${200 + i * 40}px`,
              right: `${(i * 25) % 100}%`,
              top: `${20 + (i * 30) % 60}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          >
            <div
              className={`w-full h-full rounded-full opacity-5 blur-3xl ${
                i % 2 === 0
                  ? "bg-gradient-to-br from-violet-400 to-purple-500"
                  : "bg-gradient-to-br from-cyan-400 to-blue-500"
              }`}
            />
          </motion.div>
        ))}
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
              All the power of Graphzy, optimized for your mobile device
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
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-violet-100 hover:border-violet-300 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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
      <section className="relative py-20 px-6 bg-white/50 overflow-hidden">
        {/* Background Floating Elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`bg-shape-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              left: `${(i * 20) % 100}%`,
              top: `${10 + (i * 20) % 80}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 40, 0],
              rotate: [0, 360],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          >
            <div
              className={`w-full h-full rounded-full opacity-10 blur-2xl ${
                i % 3 === 0
                  ? "bg-gradient-to-br from-violet-400 to-purple-500"
                  : i % 3 === 1
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                  : "bg-gradient-to-br from-pink-400 to-rose-500"
              }`}
            />
          </motion.div>
        ))}

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
              Experience Graphzy's intuitive design on your mobile device
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
                {/* Floating decoration */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-violet-400/30 to-purple-500/30 backdrop-blur-xl border border-white/20 pointer-events-none"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
                <div className="relative bg-slate-900 rounded-3xl p-3 shadow-2xl">
                  <div className={`bg-gradient-to-br ${screenshot.gradient} rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden`}>
                    {/* Transparent overlay pattern */}
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(6)].map((_, j) => (
                        <motion.div
                          key={j}
                          className="absolute w-16 h-16 rounded-full bg-white"
                          style={{
                            left: `${(j * 20) % 100}%`,
                            top: `${(j * 15) % 100}%`,
                          }}
                          animate={{
                            scale: [0.5, 1, 0.5],
                            opacity: [0.1, 0.3, 0.1],
                          }}
                          transition={{
                            duration: 3 + j,
                            repeat: Infinity,
                            delay: j * 0.2,
                          }}
                        />
                      ))}
                    </div>
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
                className="flex items-start gap-6 p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-violet-100"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
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
      <section className="py-20 px-6 bg-gradient-to-br from-violet-600 to-purple-600">
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
            <p className="text-xl text-violet-100 mb-8">
              Download Graphzy Mobile and start creating amazing charts today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-violet-600 hover:bg-violet-50 transition-colors font-semibold"
              >
                <Store className="w-6 h-6" />
                Download for iOS
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-violet-600 hover:bg-violet-50 transition-colors font-semibold"
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

