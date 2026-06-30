
import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Statistics() {
  const stats = [
    { value: "50+", label: "طبيب وعيادة متميزة" },
    { value: "150%+", label: "متوسط زيادة الحجوزات" },
    { value: "85%+", label: "نمو في المبيعات" },
    { value: "10+", label: "سنوات خبرة تسويقية" }
  ];

  return (
    <section className="py-16 bg-transparent text-[#2C3E50] relative z-10" id="statistics-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12" dir="rtl">
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A]">
            نتائج حقيقية من أطباء حقيقيين 💯
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto" dir="rtl">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-4xl sm:text-5xl font-black text-[#FF6B35] font-mono mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-bold text-[#2C3E50]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof subtext */}
        <div className="text-center mt-8" dir="rtl">
          <div className="inline-flex items-center gap-2 text-[#10B981] font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <span>⚡</span>
            <span>آخر 3 أطباء انضموا هذا الأسبوع شهدوا نتائج في أول 30 يوم</span>
          </div>
        </div>

      </div>
    </section>
  );
}
