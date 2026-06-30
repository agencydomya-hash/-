/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Search, MessageSquare, Heart } from 'lucide-react';

export default function Journey() {
  const steps = [
    {
      step: "01",
      title: "محرك التحسين والترتيب",
      desc: "نرفع ظهور عيادتك على خرائط جوجل والمنصات الرقمية بتهيئة SEO محلية متخصصة لجذب الباحثين عن خدماتك.",
      icon: Search,
    },
    {
      step: "02",
      title: "الاستماع والتفاعل مع المرضى",
      desc: "نبني علاقة ثقة حقيقية مع المرضى بتصميم وإعداد محتوى Reels تثقيفي هادف يبسط المعلومة الطبية.",
      icon: MessageSquare,
    },
    {
      step: "03",
      title: "رضا المريض العالي",
      desc: "نضمن للمريض تجربة حجز رقمية ومتابعة فائقة الاحترافية والسهولة تبني لديه ولاءً مستمراً لعيادتك.",
      icon: Heart,
    }
  ];

  return (
    <section className="py-24 bg-transparent text-white relative z-10" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-3" dir="rtl">
          <span className="text-[#FF5100] font-bold uppercase tracking-wider text-sm block">رحلة المريض الرقمية</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-white">
            رحلتنا نحو تميز التسويق الطبي الرقمي 🏥
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            نهندس مساراً سلساً يبدأ من رؤية الطبيب وينتهي بولاء المريض وارتفاع الحجوزات الفعلية.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto relative" dir="rtl">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-orange-500/10 via-[#FF5100]/40 to-orange-500/10 -translate-y-12 z-0" />

          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass rounded-3xl p-8 relative z-10 flex flex-col justify-between hover:border-orange-500/20 transition-all duration-300 group"
              >
                {/* Step indicator */}
                <div className="absolute top-4 left-6 text-4xl font-serif font-black text-white/5 group-hover:text-orange-500/10 transition-colors select-none font-mono">
                  {step.step}
                </div>

                <div className="space-y-4 text-right">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF5100] flex items-center justify-center transition-transform group-hover:scale-105">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
