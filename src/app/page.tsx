"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";
import Logo from "@/components/Logo";
import { BlobBackground } from "@/components/BlobBackground";

const features = [
  {
    title: "AI-Powered Generation",
    description: "Let AI analyze your data and create stunning visualizations automatically",
  },
  {
    title: "Lightning Fast",
    description: "Generate professional charts in seconds, not hours",
  },
  {
    title: "Secure & Private",
    description: "Your data stays safe with enterprise-grade security",
  },
  {
    title: "Multiple Formats",
    description: "Export to PNG, JSON, or embed directly in your projects",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your Data",
    description: "Tell us what you want to visualize. Our AI understands natural language.",
  },
  {
    number: "02",
    title: "Choose Template",
    description: "Select from 150+ beautiful templates or let AI suggest the best one.",
  },
  {
    number: "03",
    title: "Generate & Customize",
    description: "Watch AI create your chart instantly. Customize colors, fonts, and more.",
  },
  {
    number: "04",
    title: "Export & Share",
    description: "Download in any format or share directly with your team.",
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
            <Link href="#features" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
              How It Works
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
              Pricing
            </Link>
            <Link href="/mobile" className="text-gray-700 hover:text-[#165DFC] transition-colors font-semibold">
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

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-xl text-[#165DFC] text-sm font-medium mb-6 border border-white/20"
            >
              AI-Powered Chart Generation
            </motion.div>
            <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              Create Stunning Charts
              <br />
              <span className="bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">In Seconds</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
              Transform your data into beautiful, professional visualizations with the power of AI.
              No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <motion.button
                  className="px-8 py-4 rounded-full font-bold bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white shadow-xl text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Creating Free
                </motion.button>
              </Link>
              <motion.button
                className="px-8 py-4 rounded-full font-bold bg-white/50 backdrop-blur-xl text-gray-700 border border-white/20 text-lg"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Watch Demo
              </motion.button>
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
              { label: "Active Users", value: "10K+" },
              { label: "Charts Created", value: "50K+" },
              { label: "Templates", value: "150+" },
              { label: "Satisfaction", value: "4.9/5" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-3xl font-black bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
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

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
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
                <div className="relative p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] flex items-center justify-center text-white font-bold text-lg shadow-xl">
                    {step.number}
                  </div>
                  <div className="mt-4 mb-4">
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
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
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] flex items-center justify-center text-2xl text-white">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
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
              Ready to Create Amazing Charts?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users creating beautiful data visualizations with AI
            </p>
            <Link href="/login">
              <motion.button
                className="px-8 py-4 rounded-full font-bold bg-white text-[#165DFC] shadow-xl text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo size="sm" className="brightness-0 invert" />
              </div>
              <p className="text-gray-400">
                AI-powered chart generation for everyone
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/mobile" className="hover:text-white transition-colors">Mobile App</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Chartizy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
