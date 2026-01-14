"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if already loaded this session
    const hasLoaded = sessionStorage.getItem('hasLoadedOnce');
    
    if (hasLoaded) {
      // Skip loading screen on subsequent page loads
      setIsLoading(false);
      return;
    }

    // Simulate loading progress tied to actual page load
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    // Faster fade out - reduced from 1500ms to 800ms
    const fadeTimer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasLoadedOnce', 'true');
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        progress >= 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #F5F3F0 0%, #E5D8C5 100%)",
      }}
    >
      <div className="text-center">
        {/* Logo with smooth fade-in */}
        <div 
          className="mb-8 transition-all duration-700"
          style={{
            opacity: Math.min(progress / 25, 1),
            transform: `translateY(${Math.max(15 - progress / 4, 0)}px)`,
          }}
        >
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/stacked_logo-1760785640378.jpg"
            alt="Group Escape Houses"
            width={200}
            height={133}
            className="mx-auto"
            priority
          />
        </div>

        {/* Modern progress bar */}
        <div className="w-56 mx-auto">
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, var(--color-accent-sage) 0%, var(--color-accent-gold) 100%)",
              }}
            />
          </div>
          
          {/* Loading text */}
          <p 
            className="mt-3 text-xs font-medium tracking-wider"
            style={{ 
              color: "var(--color-neutral-dark)",
              opacity: Math.min(progress / 35, 0.6),
            }}
          >
            Loading your escape...
          </p>
        </div>
      </div>
    </div>
  );
}