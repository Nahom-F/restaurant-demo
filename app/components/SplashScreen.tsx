"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// eight horizontal slivers, softly feathered. They assemble bottom-to-top —
// the last piece to appear is the top of the glyph — each rising up into
// place from just below its final position.
const SLICE_COUNT = 8;
const FEATHER = 4; // percent

function maskFor(index: number) {
  const step = 100 / SLICE_COUNT;
  const start = index * step;
  const end = start + step;
  const fadeInStart = Math.max(0, start - FEATHER);
  const fadeInEnd = Math.min(100, start + FEATHER);
  const fadeOutStart = Math.max(0, end - FEATHER);
  const fadeOutEnd = Math.min(100, end + FEATHER);
  return `linear-gradient(to bottom,
    transparent 0%, transparent ${fadeInStart}%,
    black ${fadeInEnd}%, black ${fadeOutStart}%,
    transparent ${fadeOutEnd}%, transparent 100%)`;
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [inFlags, setInFlags] = useState<boolean[]>(Array(SLICE_COUNT).fill(false));
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const stagger = 340;
    const startDelay = 250;
    // bottom slice (highest index) appears first, working upward
    const timers = Array.from({ length: SLICE_COUNT }).map((_, i) => {
      const order = SLICE_COUNT - 1 - i; // 0 = bottom slice goes first
      return setTimeout(() => {
        setInFlags((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, startDelay + order * stagger);
    });
    const totalReveal = startDelay + SLICE_COUNT * stagger;
    const startFadeOut = setTimeout(() => setFadingOut(true), totalReveal + 1400);
    const finish = setTimeout(onComplete, totalReveal + 2100);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(startFadeOut);
      clearTimeout(finish);
    };
  }, [onComplete]);

  const anyIn = inFlags.some(Boolean);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-700 ease-out ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* warm dark-gold ambient glow behind the mark */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms] ease-out"
        style={{
          opacity: anyIn ? 1 : 0,
          background:
            "radial-gradient(ellipse 520px 580px at center, rgba(90,64,24,0.55) 0%, rgba(50,34,12,0.35) 35%, rgba(20,13,5,0.15) 60%, rgba(0,0,0,0) 85%)",
        }}
      />

      <div className="relative" style={{ width: 380, height: 448 }}>
        {Array.from({ length: SLICE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              maskImage: maskFor(i),
              WebkitMaskImage: maskFor(i),
              transition: "opacity 900ms ease-out, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
              transform: inFlags[i] ? "translateY(0)" : "translateY(30px)",
              opacity: inFlags[i] ? 1 : 0,
              filter: inFlags[i]
                ? "drop-shadow(0 0 24px rgba(224,180,110,0.35))"
                : "none",
            }}
          >
            <Image src="/images/splash/glyph.png" alt="AHADU" fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
