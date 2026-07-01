import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Award, Stethoscope, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { translations } from '../translations';

interface HeroProps {
  onStartDiagnosis: () => void;
  onBookConsultation: () => void;
  lang?: 'ar' | 'en';
  darkMode?: boolean;
}

export default function Hero({ onStartDiagnosis, onBookConsultation, lang = 'ar', darkMode = false }: HeroProps) {
  const t = translations[lang];
  const isEn = lang === 'en';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] dark:from-slate-950 dark:to-indigo-950 py-20 lg:py-28 text-[#2C3E50] dark:text-slate-200 transition-colors" id="hero-section">
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 tech-grid opacity-100 pointer-events-none"></div>

      {/* Floating Interactive Background Elements */}
      <div className="absolute top-12 left-[10%] w-6 h-6 text-[#FF6B35]/20 animate-float-slow hidden md:block">
        <Stethoscope className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 left-[15%] w-8 h-8 text-[#003D7A]/15 dark:text-white/10 animate-float-fast hidden md:block">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute top-1/3 right-[12%] w-7 h-7 text-[#FF6B35]/15 animate-float-fast hidden md:block">
        <Award className="w-full h-full" />
      </div>

      {/* Soft light decorative blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 aurora-blob dark:opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/5 aurora-blob-2 dark:opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" dir={isEn ? "ltr" : "rtl"}>
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className={`flex flex-wrap gap-2.5 ${isEn ? 'justify-start' : 'justify-start'}`}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003D7A]/10 dark:bg-slate-800/80 border border-[#003D7A]/20 dark:border-slate-700 text-[#003D7A] dark:text-orange-400 text-xs sm:text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span>{t.heroBadge}</span>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-tight text-[#003D7A] dark:text-white ${isEn ? 'text-left' : 'text-right'}`}
              style={{ lineHeight: 1.3, letterSpacing: '0.5px' }}
            >
              {t.heroTitle1} <br />
              <span className="text-[#FF6B35] drop-shadow-sm">{t.heroTitle2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-[#2C3E50] dark:text-slate-355 text-base sm:text-lg font-sans leading-relaxed max-w-2xl font-medium whitespace-pre-line ${isEn ? 'text-left' : 'text-right'}`}
              style={{ lineHeight: 1.6 }}
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`flex flex-col sm:flex-row gap-4 pt-4 ${isEn ? 'sm:flex-row' : 'sm:flex-row-reverse'} justify-start`}
            >
              <button
                onClick={onStartDiagnosis}
                className="px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 group text-lg cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shine-effect"
                id="btn-ai-diagnosis"
                style={{ borderRadius: '8px' }}
              >
                <span>{t.heroCtaCheckup}</span>
                {isEn ? (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                )}
              </button>

              <button
                onClick={onBookConsultation}
                className="px-8 py-4 bg-white dark:bg-slate-900 hover:bg-[#F0F4F8] dark:hover:bg-slate-800 text-[#FF6B35] font-bold rounded-xl border-2 border-[#FF6B35] transition duration-300 flex items-center justify-center gap-2 text-lg cursor-pointer"
                id="btn-book-consultation-hero"
                style={{ borderRadius: '8px' }}
              >
                <span>{t.heroCtaConsult}</span>
              </button>
            </motion.div>

            {/* Quick mobile jump links */}
            <div className="flex lg:hidden flex-wrap items-center gap-2.5 pt-2 text-xs font-semibold text-[#003D7A] dark:text-slate-300 justify-start">
              <span>{isEn ? "Quick Skip:" : "انتقال سريع إلى:"}</span>
              <button 
                onClick={onStartDiagnosis}
                className="px-2.5 py-1 bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[#FF6B35] dark:text-orange-400 font-bold transition cursor-pointer text-[11px]"
              >
                {isEn ? "AI Diagnosis 🩺" : "أداة التشخيص 🩺"}
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('reels-section');
                  if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
                }}
                className="px-2.5 py-1 bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[#003D7A] dark:text-white transition cursor-pointer text-[11px]"
              >
                {isEn ? "Videos 🎥" : "فيديوهات الأطباء 🎥"}
              </button>
              <button 
                onClick={onBookConsultation}
                className="px-2.5 py-1 bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[#003D7A] dark:text-white transition cursor-pointer text-[11px]"
              >
                {isEn ? "Book Consultation 📲" : "حجز جلسة 📲"}
              </button>
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`flex flex-col gap-2 pt-2 ${isEn ? 'text-left' : 'text-right'}`}
            >
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#10B981] text-sm font-bold">
                <span className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{t.heroBadge1}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{t.heroBadge2}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{t.heroBadge3}</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Clinical Prescription Sheet Card (Light/Dark Theme) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-sm glass-light dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/80 text-[#2C3E50] dark:text-slate-200 rounded-3xl shadow-2xl p-6 relative overflow-hidden transition-colors"
              id="prescription-hero-card"
            >
              {/* Medical clipboard clip effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-100 dark:bg-slate-800 rounded-b-xl border-b border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              </div>

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.015] pointer-events-none select-none">
                <Logo iconOnly className="w-80 h-80" lang={lang} />
              </div>

              <div className="pt-4 border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center" dir={isEn ? "ltr" : "rtl"}>
                <div className={isEn ? "text-left" : "text-right"}>
                  <span className="text-xs font-bold text-[#FF6B35] tracking-wider">{t.heroCardSubtitle}</span>
                  <h3 className="text-lg font-bold text-[#003D7A] dark:text-white">{t.heroCardTitle}</h3>
                </div>
                <Stethoscope className="w-10 h-10 text-[#FF6B35]" />
              </div>

              {/* Patient File layout */}
              <div className={`py-5 space-y-4 ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? "ltr" : "rtl"}>
                <div className="bg-[#F0F4F8] dark:bg-slate-800 p-3 rounded-xl border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#FF6B35] border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] font-bold text-[#FF6B35] block uppercase font-mono">{t.heroCardCase}</span>
                  <p className="text-xs font-semibold text-[#2C3E50] dark:text-slate-300 mt-1 leading-relaxed">
                    {t.heroCardCaseDesc}
                  </p>
                </div>

                <div className="bg-[#F0F4F8] dark:bg-slate-800 p-3 rounded-xl border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#003D7A] dark:border-slate-500 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] font-bold text-[#003D7A] dark:text-slate-400 block uppercase font-mono">{t.heroCardDiag}</span>
                  <p className="text-xs font-semibold text-[#2C3E50] dark:text-slate-300 mt-1 leading-relaxed">
                    {t.heroCardDiagDesc}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-xl border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#FF6B35] border border-orange-200/50 dark:border-orange-900/30">
                  <span className="text-[10px] font-bold text-[#FF6B35] block uppercase font-mono">{t.heroCardRx}</span>
                  <ul className="text-xs font-bold text-[#2C3E50] dark:text-slate-300 mt-1 space-y-1.5">
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                      <span>{t.heroCardRxItem1}</span>
                    </li>
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                      <span>{t.heroCardRxItem2}</span>
                    </li>
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                      <span>{t.heroCardRxItem3}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-center" dir={isEn ? "ltr" : "rtl"}>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-[#FF6B35]" />
                  <span>{t.heroCardSign}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
