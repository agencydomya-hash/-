/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQs() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      q: "هل تصوير الفيديوهات الطبية بيتم داخل عيادتي؟",
      a: "نعم، فريق الإنتاج والتصوير الكامل بوكالة دومايا بينزل لعيادتك أو مركزك الطبي ومعه أحدث كاميرات السينما (4K) والعدسات الاحترافية وإضاءة استوديو متكاملة وعزل كامل للصوت، لضمان أعلى جودة دون تشتيت لمرضاك."
    },
    {
      q: "مين اللي بيكتب ويحضر الاسكريبت الطبي للفيديوهات؟",
      a: "لدينا فريق طبي وصيادلة متخصصين في صناعة المحتوى الطبي. بيقوموا بتحضير وصياغة الأفكار الطبية بلغة عامية مصرية أو سعودية مبسطة وقريبة للمريض ومحفزة في أول 3 ثواني، وبنراجعها معاك علمياً بالكامل قبل يوم التصوير."
    },
    {
      q: "إزاي بتضمنوا تحويل المشاهدات لحجوزات كشف حقيقية؟",
      a: "التسويق عندنا مش مجرد مشاهدات وتفاعل؛ بنبني لكل طبيب (قمع تسويقي - Funnel) يربط إعلانات الفيديو الجغرافية بنماذج حجز سريعة وأتمتة ManyChat للرد الآلي الفوري بالعيادة، مما يحول المتابع لزيارة حجز حقيقية."
    },
    {
      q: "كم من الوقت بتستغرقه جلسة التصوير وكام فيديو بنصوره؟",
      a: "جلسة التصوير في عيادتك بتستغرق حوالي من 3 لـ 4 ساعات فقط. وبنصور فيها محتوى Reels كافي للنشر اليومي المتكامل لمدة شهر كامل (من 12 لـ 15 فيديو) لضمان الاستمرارية التامة."
    },
    {
      q: "هل بيتم مراجعة الفيديوهات والمحتوى قبل النشر؟",
      a: "بالتأكيد، بعد انتهاء المونتاج، بنرفع كافة الفيديوهات على فولدر خاص بالأستوديو لمراجعتها مع مدير حسابك الطبي، وبنعمل التعديلات المطلوبة بلمساتك قبل النشر النهائي على حساباتك."
    }
  ];

  return (
    <section className="py-24 bg-transparent text-white relative z-10" id="faqs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-[#FF5100] rounded-full text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>الأسئلة الشائعة للأطباء</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-white">
            إجابات لاستفساراتك حول بروتوكول التسويق 💡
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-xs sm:text-sm">
            اكتشف طريقة تنظيم جلسات التصوير، كتابة المحتوى، وإعلانات زيادة حجوزات العيادة مع دومايا.
          </p>
        </div>

        {/* Accordion container */}
        <div className="space-y-4" dir="rtl">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="glass rounded-2xl overflow-hidden border border-white/[0.06] transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-right font-bold text-xs sm:text-sm md:text-base text-white hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#FF5100]" /> : <ChevronDown className="w-5 h-5 text-slate-450" />}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold border-t border-white/[0.04]">
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
