"use client";

import { motion } from "framer-motion";

export function BlobBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, #165DFC 0%, #8EC6FF 100%)",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: -200, y: -200 }}
      />
      <motion.div
        className="absolute right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, #8EC6FF 0%, #165DFC 100%)",
        }}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: 200, y: 100 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle, #165DFC 0%, #8EC6FF 100%)",
        }}
        animate={{
          x: [0, 50, -70, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: 0, y: 200 }}
      />
    </div>
  );
}
