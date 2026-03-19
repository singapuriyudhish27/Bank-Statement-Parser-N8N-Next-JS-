"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMouseRelative } from "@/lib/hooks/useMouseRelative";

export function InteractiveCard({ children, className = "" }) {
  const { ref, coords, handleMouseMove, handleMouseLeave } = useMouseRelative();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateY: coords.x * 20,
        rotateX: -coords.y * 20,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`glass ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(50px)" }}>{children}</div>
    </motion.div>
  );
}
