
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] py-20 lg:py-28 text-[#2C3E50]" id="hero-section">
      {/* Soft light decorative blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 aurora-blob"></div>
      <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/5 aurora-blob-2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap gap-2.5 justify-start">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003D7A]/10 border border-[#003D7A]/20 text-[#003D7A] text-xs sm:text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span>شريك النمو الرقمي للأطباء في مصر والوطن العربي 🌟</span>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-tight text-[#003D7A] text-right"
              dir="rtl"
              style={{ lineHeight: 1.3, letterSpacing: '0.5px' }}
            >
              حضورك الرقمي يبني الثقة <br />
              <span className="text-[#FF6B35] drop-shadow-sm">قبل أن يزورك المريض! 🩺</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#2C3E50] text-base sm:text-lg font-sans leading-relaxed max-w-2xl text-right font-medium"
              dir="rtl"
              style={{ lineHeight: 1.6 }}
            >
              في العصر الرقمي، كفاءتك الطبية وحدها لا تكفي إذا لم تكن مرئية. نساعد كبار الأطباء والاستشاريين على بناء هوية رقمية موثوقة وإنتاج محتوى مرئي احترافي يجذب المرضى الفعليين لعيادتك.
              <br /><br />
              دعنا نضع خبرتك الطبية في الصدارة، ونصنع براند شخصي يليق بمستواك العلمي ويضاعف حجوزاتك خلال 30 يوماً فقط.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row-reverse gap-4 pt-4 justify-start"
            >
              <button
                onClick={onStartDiagnosis}
                className="px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 group text-lg cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                id="btn-ai-diagnosis"
                style={{ borderRadius: '8px' }}
              >
                <span>افحص قوة حضورك الرقمي الآن (مجاناً) 🩺</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-8 py-4 bg-white hover:bg-[#F0F4F8] text-[#FF6B35] font-bold rounded-xl border-2 border-[#FF6B35] transition duration-300 flex items-center justify-center gap-2 text-lg cursor-pointer"
                id="btn-book-consultation-hero"
                style={{ borderRadius: '8px' }}
              >
                <span>تحدث مع مستشار نمو طبي 📞</span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-2 pt-2 text-right"
              dir="rtl"
            >
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#10B981] text-sm font-bold">
                <span className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>مجاني 100% - بدون التزام</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>النتائج في دقيقة واحدة</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>أكثر من 50 طبيب انضموا هذا الشهر</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Clinical Prescription Sheet Card (Light Theme) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-sm bg-white border border-[#E5E7EB] text-[#2C3E50] rounded-3xl shadow-xl p-6 relative overflow-hidden"
              id="prescription-hero-card"
            >
              {/* Medical clipboard clip effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-100 rounded-b-xl border-b border-slate-200 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-slate-300 rounded-full"></div>
              </div>

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Logo iconOnly className="w-80 h-80" />
              </div>

              <div className="pt-4 border-b border-slate-100 pb-4 flex justify-between items-center" dir="rtl">
                <div className="text-right">
                  <span className="text-xs font-bold text-[#FF6B35] tracking-wider">عيادة النجاح الرقمي</span>
                  <h3 className="text-lg font-bold text-[#003D7A]">د. تشخيص الحضور</h3>
                </div>
                <Stethoscope className="w-10 h-10 text-[#FF6B35]" />
              </div>

              {/* Patient File layout */}
              <div className="py-5 space-y-4 text-right" dir="rtl">
                <div className="bg-[#F0F4F8] p-3 rounded-xl border-r-4 border-[#FF6B35] border border-slate-200/50">
                  <span className="text-[10px] font-bold text-[#FF6B35] block uppercase font-mono">الحالة (Case Profile)</span>
                  <p className="text-xs font-semibold text-[#2C3E50] mt-1 leading-relaxed">
                    طبيب ماهر جداً في تخصصه ومحبوب، ولكن عيادته غير مرئية على محركات البحث والسوشيال ميديا.
                  </p>
                </div>

                <div className="bg-[#F0F4F8] p-3 rounded-xl border-r-4 border-[#003D7A] border border-slate-200/50">
                  <span className="text-[10px] font-bold text-[#003D7A] block uppercase font-mono">الملاحظة (Diagnosis)</span>
                  <p className="text-xs font-semibold text-[#2C3E50] mt-1 leading-relaxed">
                    المرضى الآن يفحصون الملف الرقمي للطبيب وقصص نجاحه وصور عيادته بالفيديو قبل اتخاذ قرار الحجز.
                  </p>
                </div>

                <div className="bg-orange-50 p-3 rounded-xl border-r-4 border-[#FF6B35] border border-orange-200/50">
                  <span className="text-[10px] font-bold text-[#FF6B35] block uppercase font-mono">الروشتة العلاجية (Rx)</span>
                  <ul className="text-xs font-bold text-[#2C3E50] mt-1 space-y-1.5">
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                      <span>إنتاج محتوى Reels عالي الجودة بالعيادة</span>
                    </li>
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                      <span>كتابة نصوص طبية تبسط المعلومة بالعامية</span>
                    </li>
                    <li className="flex items-center gap-1.5 justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                      <span>إعلانات مستهدفة جغرافياً لجذب الحجوزات</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 text-center" dir="rtl">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-[#FF6B35]" />
                  <span>توقيع وكالة دوميا - يونيو 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
