/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, Stethoscope, Sparkles } from 'lucide-react';
import Logo from './Logo';

interface HeroProps {
  onStartDiagnosis: () => void;
  onBookConsultation: () => void;
}

export default function Hero({ onStartDiagnosis, onBookConsultation }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-transparent py-20 lg:py-28 text-white" id="hero-section">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/5 aurora-blob"></div>
      <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/5 aurora-blob-2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>شريك النمو الرقمي للأطباء في مصر والوطن العربي 🌟</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-tight text-white"
            >
              حضورك الرقمي يدخل <br />
              <span className="text-[#FF5100] drop-shadow-sm">العيادة قبلك!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg font-sans leading-relaxed max-w-2xl"
            >
              المرضى لا يبحثون فقط عن طبيب، بل يبحثون عن مصدر ثقة وأمان. في وكالة 
              <span className="text-[#FF5100] font-bold"> دومايا</span>، ندمج عالم الطب بالتسويق الإبداعي لنبني لك هويتك الرقمية المتكاملة من داخل عيادتك.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row-reverse gap-4 pt-4"
            >
              <button
                onClick={onStartDiagnosis}
                className="px-8 py-4 bg-[#FF5100] hover:bg-orange-650 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 group text-lg cursor-pointer"
                id="btn-ai-diagnosis"
              >
                <span>ابدأ التشخيص الرقمي الفوري</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition duration-300 flex items-center justify-center gap-2 text-lg cursor-pointer"
                id="btn-book-consultation-hero"
              >
                <span>حجز استشارة هاتفية</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 text-center"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">+10</div>
                <div className="text-xs sm:text-sm text-slate-450 mt-1">سنوات خبرة تسويقية</div>
              </div>
              <div className="border-x border-white/10">
                <div className="text-2xl sm:text-3xl font-bold text-[#FF5100] font-mono">+50</div>
                <div className="text-xs sm:text-sm text-slate-450 mt-1">طبيب وعيادة متميزة</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">100%</div>
                <div className="text-xs sm:text-sm text-slate-450 mt-1">محتوى علمي دقيق وجذاب</div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Clinical Prescription Sheet Card (Glassmorphic) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-sm glass text-white rounded-3xl shadow-2xl p-6 relative overflow-hidden"
              id="prescription-hero-card"
            >
              {/* Medical clipboard clip effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-white/10 rounded-b-xl border-b border-white/10 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-white/20 rounded-full"></div>
              </div>

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none">
                <Logo iconOnly className="w-80 h-80" />
              </div>

              <div className="pt-4 border-b border-white/10 pb-4 flex justify-between items-center" dir="rtl">
                <div className="text-right">
                  <span className="text-xs font-bold text-[#FF5100] tracking-wider">عيادة النجاح الرقمي</span>
                  <h3 className="text-lg font-bold text-white">د. تشخيص الحضور</h3>
                </div>
                <Stethoscope className="w-10 h-10 text-[#FF5100]" />
              </div>

              {/* Patient File layout */}
              <div className="py-5 space-y-4 text-right" dir="rtl">
                <div className="bg-white/5 p-3 rounded-xl border-r-4 border-orange-400 border border-white/5">
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">الحالة (Case Profile)</span>
                  <p className="text-xs font-medium text-slate-300 mt-1 leading-relaxed">
                    طبيب ماهر جداً في تخصصه ومحبوب، ولكن عيادته غير مرئية على محركات البحث والسوشيال ميديا.
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border-r-4 border-[#FF5100] border border-white/5">
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">الملاحظة (Diagnosis)</span>
                  <p className="text-xs font-medium text-slate-300 mt-1 leading-relaxed">
                    المرضى الآن يفحصون الملف الرقمي للطبيب وقصص نجاحه وصور عيادته بالفيديو قبل اتخاذ قرار الحجز.
                  </p>
                </div>

                <div className="bg-orange-500/10 p-3 rounded-xl border-r-4 border-orange-500 border border-orange-500/25">
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">الروشتة العلاجية (Rx)</span>
                  <ul className="text-xs font-bold text-slate-200 mt-1 space-y-1.5">
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100]"></span>
                      <span>إنتاج محتوى Reels عالي الجودة بالعيادة</span>
                    </li>
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100]"></span>
                      <span>كتابة نصوص طبية تبسط المعلومة بالعامية</span>
                    </li>
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5100]"></span>
                      <span>إعلانات مستهدفة جغرافياً لجذب الحجوزات</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-center" dir="rtl">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-[#FF5100]" />
                  <span>توقيع وكالة دومايا - يونيو 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
