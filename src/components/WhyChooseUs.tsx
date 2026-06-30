
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
    <section className="py-24 bg-transparent text-[#2C3E50] relative z-10" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3" dir="rtl">
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A]">
            لماذا 50+ طبيب اختاروا دوميا؟ 🌟
          </h2>
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
                className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4 text-right">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 text-[#FF6B35]">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#003D7A]">{card.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#2C3E50] font-semibold">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="text-center mt-16 space-y-6" dir="rtl">
          <p className="text-base sm:text-lg font-bold text-[#2C3E50] max-w-xl mx-auto leading-relaxed">
            هل أنت مستعد للانضمام إليهم؟ <br />
            ابدأ التشخيص الفوري الآن واكتشف خطتك المخصصة لنمو عيادتك ↓
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
