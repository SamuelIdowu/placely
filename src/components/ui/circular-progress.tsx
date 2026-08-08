"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  progressColor?: string;
  trackColor?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  showValue = true,
  progressColor = "text-brand-indigo",
  trackColor = "text-muted",
  className,
  ...props
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number;
    const duration = 1200; // 1.2s animation
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setAnimatedValue(ease * value);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    // Slight delay before animation starts
    const timer = setTimeout(() => {
      animationFrame = window.requestAnimationFrame(step);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  const safeValue = Math.min(100, Math.max(0, animatedValue));
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(safeValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={trackColor}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {Math.round(safeValue)}%
          </span>
        </div>
      )}
    </div>
  );
}
