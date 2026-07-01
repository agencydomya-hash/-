import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, TrendingUp, Target } from 'lucide-react';
import { translations } from '../translations';

const getCards = (isEn: boolean) => [
  {
    title: isEn ? "Specialized Medical Team" : "فريق طبي متخصص",
    desc: isEn ? "Pharmacists and medical marketing experts who fully understand Arabic medical terminology and patients." : "صيادلة وخبراء تسويق طبي يفهمون لغة الطب والمريض العربي بدقة.",
    icon: Stethoscope,
    highlight: false
  },
  {
    title: isEn ? "Measured Real Results" : "نتائج حقيقية مقاسة",
    desc: isEn ? "150%+ increase in clinic booking rates, 85%+ sales growth, verified results from actual clinics." : "150%+ زيادة في الحجوزات، 85%+ نمو في المبيعات، نتائج فعلية من عيادات حقيقية.",
    icon: TrendingUp,
    highlight: true
  },
  {
    title: isEn ? "Customized Strategy" : "استراتيجية مخصصة لتخصصك",
    desc: isEn ? "Every medical specialty has different patient triggers. We build a custom video production and map SEO plan." : "كل تخصص طبي له احتياجات مختلفة، نبني لك خطة مخصصة 100% لتصوير ومونتاج فيديوهاتك.",
    icon: Target,
    highlight: false
  }
];

interface WhyChooseUsProps {
  lang?: 'ar' | 'en';
}

export default function WhyChooseUs({ lang = 'ar' }: WhyChooseUsProps) {
  const isEn = lang === 'en';
  const cards = getCards(isEn);

  return (
    <section className="py-24 bg-transparent text-[#2C3E50] dark:text-slate-200 relative z-10 transition-colors" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3" dir={isEn ? "ltr" : "rtl"}>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Why do 50+ physicians choose DOMYA? 🌟" : "لماذا 50+ طبيب اختاروا دوميا؟ 🌟"}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none md:grid md:grid-cols-3 md:pb-0 md:overflow-x-visible max-w-6xl mx-auto" dir={isEn ? "ltr" : "rtl"}>
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 shrink-0 snap-start w-[85vw] sm:w-[280px] md:w-auto"
              >
                <div className={`space-y-4 ${isEn ? 'text-left' : 'text-right'}`}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[#FF6B35]">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#003D7A] dark:text-white">{card.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#2C3E50] dark:text-slate-400 font-semibold">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="text-center mt-16 space-y-6" dir={isEn ? "ltr" : "rtl"}>
          <p className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isEn ? "Are you ready to join them?" : "هل أنت مستعد للانضمام إليهم؟"} <br />
            {isEn ? "Start your diagnosis now and discover your clinic's growth blueprint ↓" : "ابدأ التشخيص الفوري الآن واكتشف خطتك المخصصة لنمو عيادتك ↓"}
          </p>
          <button
            onClick={() => {
              const diagSection = document.getElementById("diagnosis-section");
              if (diagSection) diagSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/20 text-base cursor-pointer"
            style={{ borderRadius: '8px' }}
          >
            {isEn ? "Start Free Audit 🩺" : "ابدأ التشخيص الآن 🩺"}
          </button>
        </div>

      </div>
    </section>
  );
}
