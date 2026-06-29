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
  // Official logo image from domya.net website
  const logoUrl = "https://domya.net/wp-content/uploads/2022/03/cropped-logo-domya.png";

  return (
    <div className={`flex items-center gap-3 ${className}`} id="domya-logo">
      <img 
        src={logoUrl} 
        alt="Domya Agency Logo" 
        className="h-9 sm:h-11 w-auto object-contain transition duration-300"
        style={{
          filter: light ? 'brightness(0) invert(1)' : 'none'
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
