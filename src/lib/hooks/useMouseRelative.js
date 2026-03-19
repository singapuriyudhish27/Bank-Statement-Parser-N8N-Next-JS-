"use client";

import { useState, useCallback, useRef } from "react";

export function useMouseRelative() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setCoords({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCoords({ x: 0, y: 0 });
  }, []);

  return { ref, coords, handleMouseMove, handleMouseLeave };
}
