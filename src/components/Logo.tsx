/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export default function Logo({ className = '', iconOnly = false, light = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`} id="domya-logo">
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow"
        >
          <rect
            x="12"
            y="12"
            width="76"
            height="76"
            rx="16"
            fill={light ? "rgba(255,255,255,0.08)" : "rgba(26,43,91,0.04)"}
            stroke={light ? "rgba(255,255,255,0.1)" : "rgba(26,43,91,0.08)"}
            strokeWidth="2"
          />
          <path
            d="M32 25H58C72 25 80 34 80 50C80 66 72 75 58 75H32V25Z"
            stroke="#FF8C00"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M45 40H54V60H45"
            stroke={light ? "#FFFFFF" : "#1A2B5B"}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M58 35L68 50L58 65"
            stroke="#FF8C00"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col select-none text-right">
          <span 
            className={`font-inter font-black text-xl tracking-wide leading-none ${
              light ? 'text-white' : 'text-[#1A2B5B]'
            }`}
          >
            Domya <span className="text-[#FF8C00]">Agency</span>
          </span>
          <span 
            className={`text-[8px] font-sans tracking-[0.16em] uppercase font-bold leading-none mt-1.5 ${
              light ? 'text-orange-200/80' : 'text-gray-500'
            }`}
          >
            World in your hands
          </span>
        </div>
      )}
    </div>
  );
}
