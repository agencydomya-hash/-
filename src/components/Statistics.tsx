import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { translations } from '../translations';

interface StatisticsProps {
  lang?: 'ar' | 'en';
}

export default function Statistics({ lang = 'ar' }: StatisticsProps) {
  const t = translations[lang];
  const isEn = lang === 'en';

  const stats = [
    { value: t.stat1Number, label: t.stat1Label },
    { value: t.stat2Number, label: t.stat2Label },
    { value: t.stat3Number, label: t.stat3Label },
    { value: t.stat4Number, label: t.stat4Label }
  ];

  return (
    <section className="py-16 bg-transparent text-[#2C3E50] dark:text-slate-200 relative z-10 transition-colors" id="statistics-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12" dir={isEn ? "ltr" : "rtl"}>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Real Results for Real Doctors 💯" : "نتائج حقيقية من أطباء حقيقيين 💯"}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:pb-0 sm:overflow-x-visible max-w-6xl mx-auto" dir={isEn ? "ltr" : "rtl"}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 shrink-0 snap-start w-[70vw] sm:w-auto"
            >
              <div className="text-4xl sm:text-5xl font-black text-[#FF6B35] font-mono mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-bold text-[#2C3E50] dark:text-slate-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof subtext */}
        <div className="text-center mt-8" dir={isEn ? "ltr" : "rtl"}>
          <div className="inline-flex items-center gap-2 text-[#10B981] font-bold text-sm bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-900/35">
            <span>⚡</span>
            <span>
              {isEn 
                ? "The last 3 doctors who joined this week saw results in 30 days" 
                : "آخر 3 أطباء انضموا هذا الأسبوع شهدوا نتائج في أول 30 يوم"
              }
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
