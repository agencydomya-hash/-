import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const getFaqs = (isEn: boolean): FAQItem[] => [
  {
    q: isEn ? "Is the medical video shoot done inside my clinic?" : "هل تصوير الفيديوهات الطبية بيتم داخل عيادتي؟",
    a: isEn 
      ? "Yes, the complete DOMYA production team travels to your clinic equipped with 4K cinema cameras, professional studio lighting, and audio isolation gear to guarantee top visual quality without disrupting your schedule."
      : "نعم، فريق الإنتاج والتصوير الكامل بوكالة دوميا بينزل لعيادتك أو مركزك الطبي ومعه أحدث كاميرات السينما (4K) والعدسات الاحترافية وإضاءة استوديو متكاملة وعزل كامل للصوت، لضمان أعلى جودة دون تشتيت لمرضاك."
  },
  {
    q: isEn ? "Who writes and prepares the video scripts?" : "مين اللي بيكتب ويحضر الاسكريبت الطبي للفيديوهات؟",
    a: isEn
      ? "We have a dedicated medical content writing team comprising clinical pharmacists and healthcare copywriters. They script concepts in simplified, engaging language with 3-second hooks, fully reviewed by you before filming."
      : "لدينا فريق طبي وصيادلة متخصصين في صناعة المحتوى الطبي. بيقوموا بتحضير وصياغة الأفكار الطبية بلغة عامية مصرية أو سعودية مبسطة وقريبة للمريض ومحفزة في أول 3 ثواني، وبنراجعها معاك علمياً بالكامل قبل يوم التصوير."
  },
  {
    q: isEn ? "How do you guarantee views turn into actual clinic bookings?" : "إزاي بتضمنوا تحويل المشاهدات لحجوزات كشف حقيقية؟",
    a: isEn
      ? "We build patient acquisition funnels linking video ads to instant lead capture forms and automated chat responses (ManyChat) to instantly route interested patients to direct bookings."
      : "التسويق عندنا مش مجرد مشاهدات وتفاعل؛ بنبني لكل طبيب (قمع تسويقي - Funnel) يربط إعلانات الفيديو الجغرافية بنماذج حجز سريعة وأتمتة ManyChat للرد الآلي الفوري بالعيادة، مما يحول المتابع لزيارة حجز حقيقية."
  },
  {
    q: isEn ? "How long does a shoot last and how many videos do we produce?" : "كم من الوقت بتستغرقه جلسة التصوير وكام فيديو بنصوره؟",
    a: isEn
      ? "A typical in-clinic shoot session lasts around 3 to 4 hours. We film enough raw content for a full month of publishing (12 to 15 high-quality Reels videos) to ensure consistency."
      : "جلسة التصوير في عيادتك بتستغرق حوالي من 3 لـ 4 ساعات فقط. وبنصور فيها محتوى Reels كافي للنشر اليومي المتكامل لمدة شهر كامل (من 12 لـ 15 فيديو) لضمان الاستمرارية التامة."
  },
  {
    q: isEn ? "Are videos and scripts reviewed before final publishing?" : "هل بيتم مراجعة الفيديوهات والمحتوى قبل النشر؟",
    a: isEn
      ? "Absolutely. Once initial editing completes, we upload draft videos to a private portal for you to review and request any revisions before scheduling posts."
      : "بالتأكيد، بعد انتهاء المونتاج، بنرفع كافة الفيديوهات على فولدر خاص بالأستوديو لمراجعتها مع مدير حسابك الطبي، وبنعمل التعديلات المطلوبة بلمساتك قبل النشر النهائي على حساباتك."
  }
];

interface FAQsProps {
  lang?: 'ar' | 'en';
}

export default function FAQs({ lang = 'ar' }: FAQsProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const isEn = lang === 'en';
  const faqs = getFaqs(isEn);

  return (
    <section className="py-24 bg-transparent text-[#2C3E50] dark:text-slate-200 relative z-10 transition-colors" id="faqs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3" dir={isEn ? "ltr" : "rtl"}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] rounded-full text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>{isEn ? "Physicians FAQs" : "الأسئلة الشائعة للأطباء"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Answers to Your Clinic Marketing Questions 💡" : "إجابات لاستفساراتك حول بروتوكول التسويق 💡"}
          </h2>
          <p className="text-[#2C3E50] dark:text-slate-355 max-w-xl mx-auto text-xs sm:text-sm font-semibold">
            {isEn 
              ? "Discover shoot schedules, scripting, and growth campaigns built by DOMYA."
              : "اكتشف طريقة تنظيم جلسات التصوير، كتابة المحتوى، وإعلانات زيادة حجوزات العيادة مع دوميا."
            }
          </p>
        </div>

        {/* Accordion container */}
        <div className="space-y-4" dir={isEn ? "ltr" : "rtl"}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={`w-full flex items-center justify-between p-5 ${isEn ? 'text-left' : 'text-right'} font-bold text-xs sm:text-sm md:text-base text-[#003D7A] dark:text-white hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-colors cursor-pointer`}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#FF6B35]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-[#2C3E50] dark:text-slate-300 leading-relaxed font-semibold border-t border-[#E5E7EB] dark:border-slate-800 bg-[#F0F4F8]/30 dark:bg-slate-950/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
