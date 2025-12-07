"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/login">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-violet-500/10 dark:shadow-violet-900/20 border-2 border-white/50 dark:border-slate-700/50 p-8 md:p-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                By accessing and using Graphzy ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                2. Description of Service
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Graphzy is an AI-powered chart and data visualization platform that allows users to create, customize, and export various types of charts and graphs. The Service includes:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
                <li>AI-powered chart generation from text descriptions</li>
                <li>Multiple chart templates and types</li>
                <li>Data visualization tools</li>
                <li>Chart export functionality (PNG, SVG, JSON)</li>
                <li>Free and Pro subscription tiers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                3. User Accounts
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                4. Subscription Plans
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Graphzy offers two subscription tiers:
              </p>
              <div className="bg-violet-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Free Plan</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Limited number of charts per month, basic templates, standard export formats.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Pro Plan</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Unlimited charts, premium templates, advanced export formats, priority support.
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Subscription fees are billed monthly. You may cancel your subscription at any time, and cancellation will take effect at the end of the current billing period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                5. Acceptable Use
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems to access the Service without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The Service and its original content, features, and functionality are owned by Graphzy and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of any data you upload, but grant Graphzy a license to use, store, and process such data to provide the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Graphzy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                8. Termination
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                10. Contact Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Email: support@graphzy.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

