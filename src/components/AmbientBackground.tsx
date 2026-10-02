import { useEffect, useState } from 'react';

/**
 * High-end Ambient Background system for My Gardener.
 * Provides organic ambient light orbs, soft botanical gradients,
 * subtle tactile grain, and drifting organic particles that bring
 * every page to life with depth and elegance.
 */
export default function AmbientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="ambient-bg-root" aria-hidden="true">
      {/* 1. Dynamic Ambient Light Orbs */}
      <div className="ambient-orb ambient-orb--top-left" />
      <div className="ambient-orb ambient-orb--top-right" />
      <div className="ambient-orb ambient-orb--center" />
      <div className="ambient-orb ambient-orb--bottom-right" />

      {/* 2. Delicate Botanical Leaf Watermarks */}
      <div className="ambient-leaf ambient-leaf--1">
        <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M60 10C60 10 100 50 100 100C100 150 60 170 60 170C60 170 20 150 20 100C20 50 60 10 60 10Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <path d="M60 20V160" stroke="currentColor" strokeWidth="1" />
          <path d="M60 60C75 50 88 55 92 65" stroke="currentColor" strokeWidth="0.8" />
          <path d="M60 85C75 75 88 80 92 90" stroke="currentColor" strokeWidth="0.8" />
          <path d="M60 110C75 100 88 105 92 115" stroke="currentColor" strokeWidth="0.8" />
          <path d="M60 60C45 50 32 55 28 65" stroke="currentColor" strokeWidth="0.8" />
          <path d="M60 85C45 75 32 80 28 90" stroke="currentColor" strokeWidth="0.8" />
          <path d="M60 110C45 100 32 105 28 115" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="ambient-leaf ambient-leaf--2">
        <svg viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M70 15C85 45 120 80 115 130C110 175 70 185 70 185C70 185 30 175 25 130C20 80 55 45 70 15Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.8"
          />
          <path d="M70 25C70 25 72 100 70 175" stroke="currentColor" strokeWidth="0.9" />
          <path d="M70 70Q95 65 105 80" stroke="currentColor" strokeWidth="0.8" />
          <path d="M70 100Q95 95 102 112" stroke="currentColor" strokeWidth="0.8" />
          <path d="M70 130Q90 125 98 140" stroke="currentColor" strokeWidth="0.8" />
          <path d="M70 70Q45 65 35 80" stroke="currentColor" strokeWidth="0.8" />
          <path d="M70 100Q45 95 38 112" stroke="currentColor" strokeWidth="0.8" />
          <path d="M70 130Q50 125 42 140" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>

      {/* 3. Tactile Organic Grain / Editorial Film Texture */}
      <div className="ambient-grain" />
    </div>
  );
}
