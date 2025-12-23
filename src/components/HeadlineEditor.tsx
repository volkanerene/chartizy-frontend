"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeadlineEditorProps {
  headline: string;
  headlineNumber: string;
  onSave: (headline: string, headlineNumber: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function HeadlineEditor({ headline, headlineNumber, onSave, onClose, isOpen }: HeadlineEditorProps) {
  const [localHeadline, setLocalHeadline] = useState(headline);
  const [localNumber, setLocalNumber] = useState(headlineNumber);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Headline</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="headline">Headline Text</Label>
            <Input
              id="headline"
              value={localHeadline}
              onChange={(e) => setLocalHeadline(e.target.value)}
              placeholder="Enter headline"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="number">Number</Label>
            <Input
              id="number"
              value={localNumber}
              onChange={(e) => setLocalNumber(e.target.value)}
              placeholder="Enter number"
              className="mt-2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-blue-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(localHeadline, localNumber);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </>
  );
}
