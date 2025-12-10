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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";
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
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

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
            <Link href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/mobile" className="text-slate-600 hover:text-blue-600 transition-colors">
              Mobile
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="bg-white text-slate-900 hover:bg-slate-100">Sign In</Button>
            </Link>
            <Link href="/login">
              <GradientButton>Get Started</GradientButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Charts - Different Icons */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12 p-12 opacity-8">
          {[
            { icon: BarChart3, size: "w-16 h-16" },
            { icon: TrendingUp, size: "w-20 h-20" },
            { icon: Sparkles, size: "w-14 h-14" },
            { icon: Zap, size: "w-18 h-18" },
            { icon: Globe, size: "w-16 h-16" },
            { icon: Award, size: "w-20 h-20" },
            { icon: BarChart3, size: "w-14 h-14" },
            { icon: TrendingUp, size: "w-18 h-18" },
            { icon: Sparkles, size: "w-16 h-16" },
            { icon: Zap, size: "w-20 h-20" },
            { icon: Globe, size: "w-14 h-14" },
            { icon: Award, size: "w-18 h-18" },
            { icon: BarChart3, size: "w-20 h-20" },
            { icon: TrendingUp, size: "w-16 h-16" },
            { icon: Sparkles, size: "w-18 h-18" },
          ].map((item, i) => (
            <motion.div
              key={`chart-${i}`}
              className="group cursor-pointer"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className={`${item.size} text-blue-400`} />
            </motion.div>
          ))}
        </div>

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Chart Generation
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-600">
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
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-blue-100"
              >
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-6 bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                <div className="relative p-6 rounded-2xl bg-blue-50 border-2 border-blue-100">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <div className="mt-4 mb-4">
                    <step.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
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
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-blue-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
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
              <div className="mb-4">
                <Logo size="sm" className="brightness-0 invert" />
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
