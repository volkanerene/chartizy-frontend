"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Crown, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/GradientButton";
import { BarChart3 } from "lucide-react";
import Logo from "@/components/Logo";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    icon: Sparkles,
    features: [
      "5 charts per month",
      "Basic templates",
      "PNG export",
      "Community support",
      "Standard quality",
    ],
    limitations: [
      "Limited templates",
      "No premium features",
    ],
    color: "from-slate-400 to-slate-600",
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals and teams",
    icon: Crown,
    features: [
      "Unlimited charts",
      "150+ premium templates",
      "All export formats (PNG, JSON, SVG)",
      "Priority support",
      "High-quality exports",
      "Advanced customization",
      "API access",
      "White-label options",
    ],
    limitations: [],
    color: "from-blue-500 to-blue-600",
    buttonText: "Upgrade to Pro",
    popular: true,
  },
];

const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! The Free plan is available forever. You can also try Pro features with a 14-day free trial.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.",
  },
  {
    question: "Can I use Graphzy for commercial purposes?",
    answer: "Yes! Pro users can use charts for commercial purposes. Free users are limited to personal use.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "Free users will be prompted to upgrade. Pro users have unlimited charts, so no worries!",
  },
];

export default function PricingPage() {
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
            <Link href="/pricing" className="text-blue-600 font-medium">
              Pricing
            </Link>
            <Link href="/mobile" className="text-slate-600 hover:text-blue-600 transition-colors">
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-600">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 mb-12">
              Choose the plan that's right for you. Upgrade or downgrade at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative p-8 rounded-3xl border-2 transition-all ${
                  plan.popular
                    ? "bg-blue-50 border-blue-300 shadow-2xl shadow-blue-500/20"
                    : "bg-white/70 backdrop-blur-xl border-blue-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${plan.color === "from-blue-500 to-blue-600" ? "bg-blue-600" : "bg-blue-500"} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-500">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 + j * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </motion.li>
                    ))}
                    {plan.limitations.map((limitation, j) => (
                      <motion.li
                        key={limitation}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 + (plan.features.length + j) * 0.05 }}
                        className="flex items-start gap-3 opacity-60"
                      >
                        <span className="w-5 h-5 flex-shrink-0" />
                        <span className="text-slate-500 line-through">{limitation}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <Link href={plan.name === "Free" ? "/login" : "/login"}>
                  {plan.popular ? (
                    <GradientButton className="w-full text-lg py-6">
                      {plan.buttonText}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </GradientButton>
                  ) : (
                    <Button variant="outline" className="w-full text-lg py-6 border-2">
                      {plan.buttonText}
                    </Button>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-blue-100"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users creating amazing charts with AI
            </p>
            <Link href="/login">
              <GradientButton size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </GradientButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

