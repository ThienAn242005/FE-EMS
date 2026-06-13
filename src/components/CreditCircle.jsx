import React from "react";

export default function CreditCircle({ earned = 0, total = 150 }) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min((earned / total) * 100, 100);
  const progress = (percent / 100) * circumference;

  return (
    <div
      className="
        flex flex-col items-center p-6 rounded-2xl shadow-lg border
        bg-white hover:shadow-blue-300 transition-all duration-300
        hover:scale-[1.05] cursor-pointer hover:bg-blue-50
      "
      style={{ width: "220px" }}
    >
      <svg width="180" height="180" className="mb-3">
        {/* Outer Glow Circle */}
        <circle
          cx="90"
          cy="90"
          r={radius + 5}
          stroke="rgba(37, 99, 235, 0.2)"
          strokeWidth="6"
          fill="transparent"
        />

        {/* Background circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="12"
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="url(#grad)"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          className="transition-all duration-[1200ms] ease-out"
        />

        {/* Gradient for progress */}
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="text-center">
        <p className="text-4xl font-extrabold text-blue-700 tracking-wide">
          {earned}
        </p>
        <p className="text-sm text-slate-600 font-medium">Credits Earned</p>
        <p className="text-xs text-slate-500 mt-1">
          {percent.toFixed(1)}% completed
        </p>
      </div>
    </div>
  );
}
