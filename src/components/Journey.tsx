import React from 'react';
import { motion } from 'motion/react';
import { Search, MessageSquare, Heart } from 'lucide-react';
import { translations } from '../translations';

const getSteps = (isEn: boolean) => [
  {
    step: "01",
    title: isEn ? "Search Engine & Map SEO" : "محرك التحسين والترتيب",
    desc: isEn ? "We rank your clinic on Google Maps and search results using specialized local SEO strategies." : "نرفع ظهور عيادتك على خرائط جوجل والمنصات الرقمية بتهيئة SEO محلية متخصصة لجذب الباحثين عن خدماتك.",
    icon: Search,
  },
  {
    step: "02",
    title: isEn ? "Educate & Interact" : "الاستماع والتفاعل مع المرضى",
    desc: isEn ? "We build trust by producing high-value, educational medical Reels content that simplifies complex terms." : "نبني علاقة ثقة حقيقية مع المرضى بتصميم وإعداد محتوى Reels تثقيفي هادف يبسط المعلومة الطبية.",
    icon: MessageSquare,
  },
  {
    step: "03",
    title: isEn ? "Patient Loyalty & Satisfaction" : "رضا المريض العالي",
    desc: isEn ? "We implement frictionless booking tools and digital follow-ups that turn one-time patients into loyal clinic promoters." : "نضمن للمريض تجربة حجز رقمية ومتابعة فائقة الاحترافية والسهولة تبني لديه ولاءً مستمراً لعيادتك.",
    icon: Heart,
  }
];

interface JourneyProps {
  lang?: 'ar' | 'en';
  onBookConsultation?: () => void;
}

export default function Journey({ lang = 'ar', onBookConsultation }: JourneyProps) {
  const isEn = lang === 'en';
  const steps = getSteps(isEn);

  return (
    <section className="py-24 bg-transparent text-[#2C3E50] dark:text-slate-200 relative z-10 transition-colors" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-3" dir={isEn ? "ltr" : "rtl"}>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Your Journey Towards a Successful Digital Clinic 🚀" : "رحلتك نحو عيادة رقمية ناجحة 🚀"}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none lg:grid lg:grid-cols-3 lg:pb-0 lg:overflow-x-visible max-w-6xl mx-auto relative" dir={isEn ? "ltr" : "rtl"}>
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="relative shrink-0 snap-start w-[85vw] sm:w-[280px] lg:w-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-8 relative z-10 flex flex-col justify-between hover:shadow-md transition-all duration-300 group h-full"
                >
                  {/* Step indicator */}
                  <div className="absolute top-4 left-6 text-4xl font-serif font-black text-slate-100 dark:text-slate-800 group-hover:text-orange-500/10 transition-colors select-none font-mono">
                    {step.step}
                  </div>

                  <div className={`space-y-4 ${isEn ? 'text-left' : 'text-right'}`}>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-950/20 border border-orange-500/20 dark:border-orange-900/35 text-[#FF6B35] flex items-center justify-center transition-transform group-hover:scale-105">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-[#003D7A] dark:text-white group-hover:text-[#FF6B35] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2C3E50] dark:text-slate-400 leading-relaxed font-semibold">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow Connector between steps */}
                {idx < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -left-8 translate-x-1/2 -translate-y-6 z-20 text-[#FF6B35] font-black text-3xl">
                    {isEn ? "→" : "←"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA block */}
        <div className="text-center mt-16 space-y-6" dir={isEn ? "ltr" : "rtl"}>
          <p className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-slate-355 max-w-xl mx-auto leading-relaxed">
            {isEn ? "This is the journey every successful doctor takes." : "هذه هي الرحلة التي يسلكها كل طبيب ناجح."} <br />
            {isEn ? "Want to start your journey today? Book a free consultation now." : "تريد أن تبدأ رحلتك اليوم؟ احجز استشارتك المجانية دلوقتي ↓"}
          </p>
          <button
            onClick={() => onBookConsultation?.()}
            className="px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/20 text-base cursor-pointer"
            style={{ borderRadius: '8px' }}
          >
            {isEn ? "Book Free Consultation 📞" : "احجز استشارتك المجانية 📞"}
          </button>
        </div>

      </div>
    </section>
  );
}
