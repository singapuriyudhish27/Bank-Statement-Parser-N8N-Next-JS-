"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMouseRelative } from "@/lib/hooks/useMouseRelative";

export function Hero3D({ children }) {
  const { ref, coords, handleMouseMove, handleMouseLeave } = useMouseRelative();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateY: coords.x * 12,
        rotateX: -coords.y * 12,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 40 }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(80px)" }}>{children}</div>
    </motion.div>
  );
}
