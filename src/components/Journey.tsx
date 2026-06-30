
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
    <section className="py-24 bg-transparent text-[#2C3E50] relative z-10" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-3" dir="rtl">
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A]">
            رحلتك نحو عيادة رقمية ناجحة 🚀
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto relative" dir="rtl">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-8 relative z-10 flex flex-col justify-between hover:shadow-md transition-all duration-300 group h-full"
                >
                  {/* Step indicator */}
                  <div className="absolute top-4 left-6 text-4xl font-serif font-black text-slate-100 group-hover:text-orange-500/10 transition-colors select-none font-mono">
                    {step.step}
                  </div>

                  <div className="space-y-4 text-right">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF6B35] flex items-center justify-center transition-transform group-hover:scale-105">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-[#003D7A] group-hover:text-[#FF6B35] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-semibold">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow Connector between steps */}
                {idx < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -left-8 translate-x-1/2 -translate-y-6 z-20 text-[#FF6B35] font-black text-3xl">
                    ←
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA block */}
        <div className="text-center mt-16 space-y-6" dir="rtl">
          <p className="text-base sm:text-lg font-bold text-[#2C3E50] max-w-xl mx-auto leading-relaxed">
            هذه هي الرحلة التي يسلكها كل طبيب ناجح. <br />
            تريد أن تبدأ رحلتك اليوم؟ اكتشف أين أنت الآن من خلال التشخيص الفوري ↓
          </p>
          <button
            onClick={() => {
              const diagSection = document.getElementById("diagnosis-section");
              if (diagSection) diagSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/20 text-base cursor-pointer"
            style={{ borderRadius: '8px' }}
          >
            ابدأ التشخيص الآن 🩺
          </button>
        </div>

      </div>
    </section>
  );
}
