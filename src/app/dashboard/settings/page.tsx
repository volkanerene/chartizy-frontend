"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Trash2,
  Save,
  AlertTriangle,
  Moon,
  Sun,
  Palette,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { profileApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const router = useRouter();
  const { user, token } = useStore();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [firstName, setFirstName] = useState((user as any)?.first_name || "");
  const [lastName, setLastName] = useState((user as any)?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch user data on mount to get first_name and last_name
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && user) {
        try {
          const { authApi } = await import("@/lib/api");
          const userData = await authApi.me(token);
          if (userData) {
            setFirstName((userData as any)?.first_name || "");
            setLastName((userData as any)?.last_name || "");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, [token, user]);

  const handleSave = async () => {
    if (!token) {
      alert("You must be logged in to update your profile");
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await profileApi.updateProfile(
        {
          first_name: firstName || undefined,
          last_name: lastName || undefined,
        },
        token
      );
      
      if (result.success) {
        // Update local store
        if (user) {
          useStore.setState({
            user: {
              ...user,
              first_name: result.first_name,
              last_name: result.last_name,
            },
          });
        }
        alert("Profile updated successfully!");
        // Reload page to show updated data
        window.location.reload();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement API call to delete account
    alert("Account deletion will be implemented soon");
    setShowDeleteDialog(false);
  };


  return (
    <motion.div
      className="min-h-screen px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-500 text-xl">
            Manage your account preferences
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Profile */}
          <motion.div
            className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-6 py-3 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#165DFC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-6 py-3 bg-white/70 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#165DFC]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-6 py-3 bg-gray-100 rounded-2xl border border-gray-200 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Appearance</h2>
            <div className="flex gap-4">
              {["light", "dark"].map((t) => (
                <motion.button
                  key={t}
                  onClick={() => {
                    if (t !== theme) toggleTheme();
                  }}
                  className={`flex-1 px-8 py-4 rounded-2xl font-semibold capitalize ${
                    theme === t
                      ? "bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white"
                      : "bg-white/70 text-gray-700 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t} Mode
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            className="bg-red-50/50 backdrop-blur-xl rounded-3xl p-8 border border-red-200/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Danger Zone
            </h2>
            <p className="text-gray-600 mb-6">
              Once you delete your account, there is no going back.
            </p>
            <motion.button
              className="px-8 py-4 bg-red-500 text-white rounded-full font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </motion.button>
          </motion.div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#165DFC] to-[#8EC6FF] text-white rounded-full font-bold shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>

          {/* Sign Out Button */}
          <motion.button
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="w-full px-8 py-4 bg-white/70 rounded-full font-bold border border-gray-200 text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Sign Out
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

