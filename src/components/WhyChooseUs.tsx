/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, TrendingUp, Target } from 'lucide-react';

export default function WhyChooseUs() {
  const cards = [
    {
      title: "فريق طبي متخصص",
      desc: "صيادلة وخبراء تسويق طبي يفهمون لغة الطب والمريض العربي بدقة.",
      icon: Stethoscope,
      highlight: false
    },
    {
      title: "نتائج حقيقية مقاسة",
      desc: "150%+ زيادة في الحجوزات، 85%+ نمو في المبيعات، نتائج فعلية من عيادات حقيقية.",
      icon: TrendingUp,
      highlight: true
    },
    {
      title: "استراتيجية مخصصة لتخصصك",
      desc: "كل تخصص طبي له احتياجات مختلفة، نبني لك خطة مخصصة 100% لتصوير ومونتاج فيديوهاتك.",
      icon: Target,
      highlight: false
    }
  ];

  return (
    <section className="py-24 bg-transparent text-white relative z-10" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3" dir="rtl">
          <span className="text-[#FF5100] font-bold uppercase tracking-wider text-sm block">لماذا نحن؟</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-white">
            لماذا يختار الأطباء وكالة دومايا؟ 🌟
          </h2>
          <p className="text-slate-350 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            لأننا لا نقدم تسويقاً عاماً؛ بل نصمم حضوراً رقمياً يراعي وقار هيبة الطبيب ويسهل وصول المرضى لعيادتك بالمعلومة الدقيقة والإنتاج السينمائي الفخم.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" dir="rtl">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${
                  card.highlight
                    ? 'bg-[#FF5100] text-white shadow-xl shadow-orange-500/10 hover:bg-orange-600 scale-103'
                    : 'glass hover:border-white/20'
                }`}
              >
                {/* Glowing effect inside highlighted card */}
                {card.highlight && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                )}

                <div className="space-y-4 text-right">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    card.highlight
                      ? 'bg-white/15 border-white/25 text-white'
                      : 'bg-white/5 border-white/10 text-orange-400'
                  }`}>
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold">{card.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    card.highlight ? 'text-orange-50' : 'text-slate-300'
                  }`}>
                    {card.desc}
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
