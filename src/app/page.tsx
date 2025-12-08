"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Star,
  Play,
  Download,
  Smartphone,
  Globe,
  TrendingUp,
  Users,
  Award,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";
import { useTheme } from "@/contexts/ThemeContext";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Let AI analyze your data and create stunning visualizations automatically",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional charts in seconds, not hours",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data stays safe with enterprise-grade security",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Multiple Formats",
    description: "Export to PNG, JSON, or embed directly in your projects",
    color: "from-sky-500 to-cyan-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your Data",
    description: "Tell us what you want to visualize. Our AI understands natural language.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Choose Template",
    description: "Select from 150+ beautiful templates or let AI suggest the best one.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Generate & Customize",
    description: "Watch AI create your chart instantly. Customize colors, fonts, and more.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Export & Share",
    description: "Download in any format or share directly with your team.",
    icon: Download,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Data Analyst",
    company: "TechCorp",
    image: "👩‍💼",
    rating: 5,
    comment: "Graphzy has completely transformed how I create data visualizations. The AI suggestions are spot-on!",
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Director",
    company: "StartupXYZ",
    image: "👨‍💼",
    rating: 5,
    comment: "I can create professional charts in minutes instead of hours. This is a game-changer!",
  },
  {
    name: "Emily Johnson",
    role: "Product Manager",
    company: "InnovateLab",
    image: "👩‍💻",
    rating: 5,
    comment: "The templates are beautiful and the AI understands exactly what I need. Highly recommended!",
  },
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const { theme, toggleTheme } = useTheme();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-blue-100 dark:border-slate-700"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">Graphzy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Pricing
            </Link>
            <Link href="/mobile" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Mobile
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-white dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="text-white dark:text-slate-300">Sign In</Button>
            </Link>
            <Link href="/login">
              <GradientButton>Get Started</GradientButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 blur-3xl" />
        </motion.div>

        {/* Floating Transparent Shapes - Optimized */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`hero-shape-${i}`}
            className="absolute pointer-events-none will-change-transform"
            style={{
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              left: `${(i * 16.66) % 100}%`,
              top: `${15 + (i * 20) % 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          >
            <div
              className={`w-full h-full rounded-full opacity-10 blur-xl ${
                i % 3 === 0
                  ? "bg-gradient-to-br from-blue-400 to-indigo-500"
                  : i % 3 === 1
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                  : "bg-gradient-to-br from-sky-400 to-cyan-500"
              }`}
            />
          </motion.div>
        ))}

        {/* Floating Icons - Optimized */}
        {[
          { icon: BarChart3, delay: 0, x: "8%", y: "20%" },
          { icon: Sparkles, delay: 0.8, x: "88%", y: "30%" },
          { icon: TrendingUp, delay: 1.2, x: "12%", y: "75%" },
          { icon: Zap, delay: 0.4, x: "85%", y: "70%" },
        ].map((item, i) => (
          <motion.div
            key={`hero-icon-${i}`}
            className="absolute pointer-events-none z-10 will-change-transform"
            style={{
              left: item.x,
              top: item.y,
            }}
            animate={{
              y: [0, -30, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <item.icon className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Chart Generation
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Create Stunning Charts
              <br />
              <span className="text-slate-900">In Seconds</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Transform your data into beautiful, professional visualizations with the power of AI.
              No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <GradientButton size="lg" className="text-lg px-8 py-6">
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GradientButton>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { label: "Active Users", value: "10K+", icon: Users },
              { label: "Charts Created", value: "50K+", icon: BarChart3 },
              { label: "Templates", value: "150+", icon: Award },
              { label: "Satisfaction", value: "4.9/5", icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-blue-100 dark:border-slate-700"
              >
                <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-slate-400"
            >
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6 overflow-hidden">
        {/* Background Floating Elements - Optimized */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`feature-bg-${i}`}
            className="absolute pointer-events-none will-change-transform"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${(i * 33) % 100}%`,
              top: `${20 + (i * 25) % 50}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 25, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
            }}
          >
            <div
              className={`w-full h-full rounded-full opacity-5 blur-2xl ${
                i % 3 === 0
                  ? "bg-gradient-to-br from-blue-400 to-indigo-500"
                  : i % 3 === 1
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                  : "bg-gradient-to-br from-sky-400 to-cyan-500"
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
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features to create, customize, and share your data visualizations
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
                className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-6 bg-white/50 dark:bg-slate-800/50 overflow-hidden">
        {/* Floating Background Shapes - Optimized */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`steps-bg-${i}`}
            className="absolute pointer-events-none will-change-transform"
            style={{
              width: `${180 + i * 40}px`,
              height: `${180 + i * 40}px`,
              right: `${(i * 33) % 100}%`,
              top: `${25 + (i * 30) % 50}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 20, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 7 + i * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.3,
            }}
          >
            <div
              className={`w-full h-full rounded-full opacity-4 blur-2xl ${
                i % 2 === 0
                  ? "bg-gradient-to-br from-blue-400 to-indigo-500"
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Create professional charts in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 dark:from-blue-700 to-transparent" />
                )}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-800/50 border-2 border-blue-100 dark:border-slate-600">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <div className="mt-4 mb-4">
                    <step.icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our users are saying about Graphzy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-blue-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Amazing Charts?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users creating beautiful data visualizations with AI
            </p>
            <Link href="/login">
              <GradientButton size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </GradientButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">Graphzy</span>
              </div>
              <p className="text-slate-400">
                AI-powered chart generation for everyone
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/mobile" className="hover:text-white transition-colors">Mobile App</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Graphzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
