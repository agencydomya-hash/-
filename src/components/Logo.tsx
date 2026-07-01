import React from 'react';
import logoImg from './logo.png';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
  lang?: 'ar' | 'en';
}

export default function Logo({ className = '', iconOnly = false, light = false, lang = 'ar' }: LogoProps) {
  const isEn = lang === 'en';
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
        <div className={`flex flex-col ${isEn ? 'text-left' : 'text-right'}`}>
          <span className={`text-lg sm:text-xl font-bold tracking-normal font-sans select-none leading-tight ${
            light ? 'text-white' : 'text-[#003D7A] dark:text-white'
          }`}>
            {!isEn && "دوميا "}
            <span className="text-[#FF6B35] font-black">DOMYA</span>
          </span>
          <span className={`text-[9px] font-sans tracking-widest font-bold block uppercase leading-none mt-0.5 ${
            light ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {isEn ? "Physicians Growth" : "تطوير حضور الأطباء"}
          </span>
        </div>
      )}
    </div>
  );
}
