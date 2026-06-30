/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import logoImg from './logo.png';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export default function Logo({ className = '', iconOnly = false, light = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-300 ${className}`} id="domya-logo">
      <div className="flex items-center justify-center p-1 rounded-xl transition-transform duration-300 hover:scale-105">
        <img 
          src={logoImg} 
          alt="Domya Agency Logo" 
          className="h-10 sm:h-12 w-auto object-contain"
        />
      </div>
      {!iconOnly && (
        <span className={`text-xl sm:text-2xl font-black tracking-wider font-inter select-none ${
          light ? 'text-white' : 'text-blue-800'
        }`}>
          DOMYA
        </span>
      )}
    </div>
  );
}
