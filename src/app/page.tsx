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
import Logo from "@/components/Logo";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Let AI analyze your data and create stunning visualizations automatically",
    color: "bg-blue-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional charts in seconds, not hours",
    color: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data stays safe with enterprise-grade security",
    color: "bg-blue-600",
  },
  {
    icon: Globe,
    title: "Multiple Formats",
    description: "Export to PNG, JSON, or embed directly in your projects",
    color: "bg-blue-500",
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
    comment: "Chartizy has completely transformed how I create data visualizations. The AI suggestions are spot-on!",
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-blue-100 dark:border-slate-700"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
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
              className="rounded-full bg-white dark:bg-transparent text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="bg-white dark:bg-transparent text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Sign In</Button>
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
            key={`hero-shape-${i}`}
            className="absolute pointer-events-none will-change-transform"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              left: `${20 + i * 60}%`,
              top: `${20 + i * 30}%`,
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

        {/* Floating Icons - Optimized */}
        {[
          { icon: BarChart3, delay: 0, x: "10%", y: "25%" },
          { icon: Sparkles, delay: 1, x: "85%", y: "65%" },
        ].map((item, i) => (
          <motion.div
            key={`hero-icon-${i}`}
            className="absolute pointer-events-none z-10 will-change-transform"
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              Create Stunning Charts
              <br />
              <span className="text-slate-900 dark:text-slate-100">In Seconds</span>
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

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6 overflow-hidden">
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
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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
      <section id="how-it-works" className="relative py-20 px-6 bg-white dark:bg-slate-800 overflow-hidden">
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
                <div className="relative p-6 rounded-2xl bg-blue-50 dark:bg-slate-700/50 border-2 border-blue-100 dark:border-slate-600">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
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
              See what our users are saying about Chartizy
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
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
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
      <section className="py-20 px-6 bg-blue-600">
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
              <div className="flex items-center gap-2 mb-4 text-white">
                <div className="flex gap-1">
                  <div className="w-2 h-12 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-16 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-10 bg-blue-300 rounded-full"></div>
                  <div className="w-2 h-14 bg-blue-200 rounded-full"></div>
                </div>
                <h1 className="text-2xl tracking-tight text-white">Chartizy</h1>
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
            <p>&copy; 2024 Chartizy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
