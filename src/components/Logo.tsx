/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import logoImg from './logo.jpg';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export default function Logo({ className = '', iconOnly = false, light = false }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`} id="domya-logo">
      <div className="bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-white/20 shadow-lg shadow-black/15 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white">
        <img 
          src={logoImg} 
          alt="Domya Agency Logo" 
          className="h-8 sm:h-10 w-auto object-contain"
        />
      </div>
    </div>
  );
}
