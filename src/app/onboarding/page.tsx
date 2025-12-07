"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, User, Briefcase, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import { profileApi, paymentApi } from "@/lib/api";
import { PricingModal } from "@/components/PricingModal";

const jobOptions = [
  "Data Analyst",
  "Business Analyst",
  "Marketing Manager",
  "Product Manager",
  "Software Engineer",
  "Designer",
  "Researcher",
  "Student",
  "Entrepreneur",
  "Consultant",
  "Sales Manager",
  "Operations Manager",
  "Financial Analyst",
  "Content Creator",
  "Other",
];

const useCaseOptions = [
  "Business Reports",
  "Marketing Analytics",
  "Product Metrics",
  "Financial Dashboards",
  "Research Data",
  "Social Media Analytics",
  "Sales Performance",
  "Customer Insights",
  "Project Management",
  "Educational Purposes",
  "Personal Projects",
  "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, token, setUser } = useStore();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [job, setJob] = useState("");
  const [useCase, setUseCase] = useState("");
  const [customJob, setCustomJob] = useState("");
  const [customUseCase, setCustomUseCase] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleNext = async () => {
    if (step === 1) {
      if (!firstName || !lastName) {
        alert("Please enter your first and last name");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!job) {
        alert("Please select your job");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!useCase) {
        alert("Please select how you'll use Graphzy");
        return;
      }
      // Save profile
      if (token && user) {
        setIsSaving(true);
        try {
          const finalJob = job === "Other" ? customJob : job;
          const finalUseCase = useCase === "Other" ? customUseCase : useCase;
          
          const result = await profileApi.updateProfile(
            {
              first_name: firstName,
              last_name: lastName,
            },
            token
          );
          
          // Update user state with new profile data
          if (result.success) {
            setUser({
              ...user,
              first_name: result.first_name || firstName,
              last_name: result.last_name || lastName,
            });
          }
          
          // Store job and use case in user metadata (you might want to add these fields to the database)
          // For now, we'll just save the profile and show pricing
          
          setShowPricing(true);
        } catch (error) {
          console.error("Failed to save profile:", error);
          // Update user state anyway so onboarding doesn't loop
          setUser({
            ...user,
            first_name: firstName,
            last_name: lastName,
          });
          // Continue anyway
          setShowPricing(true);
        } finally {
          setIsSaving(false);
        }
      } else {
        setShowPricing(true);
      }
    }
  };

  const handleSkipPricing = () => {
    setShowPricing(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-violet-100/50 dark:border-slate-700/50 p-8"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-violet-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Welcome to Graphzy!
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Let's get to know you better
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  What's your job?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Help us personalize your experience
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {jobOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setJob(option)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      job === option
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400"
                        : "border-violet-100 dark:border-slate-700 hover:border-violet-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {job === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <Input
                    placeholder="Please specify"
                    value={customJob}
                    onChange={(e) => setCustomJob(e.target.value)}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  How will you use Graphzy?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Select your primary use case
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {useCaseOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setUseCase(option)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      useCase === option
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400"
                        : "border-violet-100 dark:border-slate-700 hover:border-violet-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {useCase === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <Input
                    placeholder="Please specify"
                    value={customUseCase}
                    onChange={(e) => setCustomUseCase(e.target.value)}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500"
          >
            {isSaving ? (
              "Saving..."
            ) : step === 3 ? (
              "Complete"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={handleSkipPricing}
        onUpgrade={async () => {
          // Handle upgrade with PayTR (works in Turkey, both web and mobile)
          if (!token) {
            alert("Please log in to upgrade");
            return;
          }
          
          try {
            // Create PayTR payment session
            const result = await paymentApi.createPayTRSession(
              299.99, // 299.99 TL/month (approximately $9.99)
              `${window.location.origin}/dashboard?upgraded=true&payment=success`,
              `${window.location.origin}/dashboard?upgraded=false&payment=failed`,
              token
            );
            
            if (result.success && result.redirect_url) {
              // Store order_id for tracking
              sessionStorage.setItem("paytr_order_id", result.order_id);
              // Redirect to PayTR payment page
              window.location.href = result.redirect_url;
            } else {
              throw new Error("Failed to create PayTR session");
            }
          } catch (error) {
            console.error("Upgrade error:", error);
            alert("Failed to start upgrade process. Please try again later.");
            handleSkipPricing();
          }
        }}
      />
    </div>
  );
}

