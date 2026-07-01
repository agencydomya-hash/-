
import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Award, Heart } from 'lucide-react';
import { Testimonial } from '../types';

const getTestimonials = (isEn: boolean): Testimonial[] => [
  {
    id: "test_1",
    name: isEn ? "Dr. Ahmed Al-Sharif" : "د. أحمد الشريف",
    specialty: isEn ? "Orthopedic Surgery Consultant — 5th Settlement 🦴" : "استشاري جراحة العظام والمفاصل - التجمع الخامس 🦴",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150",
    quote: isEn 
      ? "With the Domya team, my digital presence changed 180 degrees. We filmed in the clinic with premium cinematic equipment and they helped me simplify complex medical terms. Patients now come to my clinic feeling like they already know me personally from the videos."
      : "مع تيم دوميا، تواجدي الرقمي اختلف 180 درجة. صورنا في العيادة بمعدات سينمائية فخمة وساعدوني في تبسيط المصطلحات العلمية المعقدة. المرضى بيجوا العيادة دلوقتي وهما حاسين إنهم يعرفوني شخصياً بالفعل وحافظين كلامي من الفيديوهات.",
    results: isEn ? "150% booking increase + doubled organic followers" : "زيادة الحجوزات 150% + تضاعف المتابعين العضويين"
  },
  {
    id: "test_2",
    name: isEn ? "Dr. Noura Al-Otaibi" : "د. نورة العتيبي",
    specialty: isEn ? "Dermatology & Cosmetics Specialist — Riyadh 🌸" : "أخصائية الجلدية والتجميل والليزر - الرياض 🌸",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150&h=150",
    quote: isEn
      ? "What stood out most was the professionalism and precise time management. The Domya team is very comfortable to work with, scripts are pre-prepared and the color correction in the videos makes the clinic look premium and worthy of our medical standard."
      : "أكتر شيء ميز التعامل هو الاحترافية والتنظيم الدقيق للوقت. تيم دوميا مريحين جداً، السكريبتات مجهزة مسبقاً وتصحيح الألوان في الفيديوهات يظهر العيادة والتفاصيل بشكل فخم جداً يليق بمستوانا الطبي. المريض بيحجز وهو مطمئن تماماً.",
    results: isEn ? "+2.4M organic views and ranked #1 in her area" : "+2.4 مليون مشاهدة عضوية وتصدر نتائج البحث في منطقتها"
  },
  {
    id: "test_3",
    name: isEn ? "Dr. Mostafa Al-Gamal" : "د. مصطفى الجمال",
    specialty: isEn ? "Dental Implants Consultant — Alexandria 🦷" : "استشاري طب وزراعة الأسنان - الإسكندرية 🦷",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150&h=150",
    quote: isEn
      ? "I always rejected social media because it makes doctors look unprofessional. But the Domya team understood my concern and built me a presence plan that's dignified, scientifically accurate, and elegantly simplified. The result was impressive."
      : "كنت دايماً رافض فكرة السوشيال ميديا لأنها بتظهر الطبيب بشكل استعراضي مش محترم. لكن تيم دوميا فهموا قلقي وصنعوا لي خطة حضور تتسم بالوقار الطبي، الدقة العلمية، والتبسيط الراقي. النتيجة كانت مبهرة وتفاعلاً كبيراً من الزملاء والمرضى.",
    results: isEn ? "40 full dental implant cases closed directly from social media" : "إغلاق 40 حالة زراعة أسنان كاملة من السوشيال ميديا مباشرة"
  }
];

interface TestimonialsProps {
  lang?: 'ar' | 'en';
}

export default function Testimonials({ lang = 'ar' }: TestimonialsProps) {
  const isEn = lang === 'en';
  const testimonials = getTestimonials(isEn);

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors" id="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 space-y-3 ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
          <span className="text-[#FF6B35] font-bold uppercase tracking-wider text-sm block">
            {isEn ? "Real Success Stories" : "قصص نجاح حقيقية"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Doctors Who Trusted DOMYA for Their Digital Presence 🌟" : "أطباء وضعوا ثقتهم في دوميا لتصميم حضورهم الرقمي 🌟"}
          </h2>
          <p className="text-[#2C3E50] dark:text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm font-semibold">
            {isEn 
              ? "See how we helped top consultants and specialists in Egypt and Saudi Arabia build a prestigious digital presence and attract patients to their clinics."
              : "شاهد كيف ساعدنا كبار الاستشاريين والأخصائيين في مصر والمملكة العربية السعودية على كسب مكانة رقمية مرموقة وجذب المرضى لعياداتهم."
            }
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none lg:grid lg:grid-cols-3 lg:pb-0 lg:overflow-x-visible" dir={isEn ? "ltr" : "rtl"}>
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md flex flex-col justify-between relative group hover:border-[#FF6B35]/30 transition duration-300 shrink-0 snap-start w-[85vw] sm:w-[320px] lg:w-auto"
            >
              {/* Top Quote Icon decoration */}
              <div className="absolute top-6 left-6 text-[#FF6B35]/5 dark:text-[#FF6B35]/10 select-none pointer-events-none group-hover:text-[#FF6B35]/10 transition duration-300">
                <Quote className="w-16 h-16 transform rotate-180" />
              </div>

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex gap-1 justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>

                {/* Quote text */}
                <p className={`text-[#2C3E50] dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium italic ${isEn ? 'text-left' : 'text-right'}`}>
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              {/* Doctor Profile Banner */}
              <div className={`mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5 ${isEn ? 'text-left' : 'text-right'}`}>
                <div className="relative">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B35]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="w-4 h-4 bg-[#FF6B35] rounded-full absolute bottom-0 right-0 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white">
                    ✓
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#003D7A] dark:text-white text-sm sm:text-base">{test.name}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-slate-500 font-semibold">{test.specialty}</p>
                  
                  {/* Result Badge */}
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-[#10B981] text-[10px] font-bold">
                    <Heart className="w-3 h-3 text-[#10B981] fill-current" />
                    <span>{isEn ? "Result: " : "النتيجة: "}{test.results}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand guarantee banner */}
        <div className="mt-16 bg-gradient-to-r from-[#003D7A]/5 via-white dark:via-slate-900 to-[#FF6B35]/5 border border-[#E5E7EB] dark:border-slate-800 p-8 rounded-3xl text-center flex flex-col sm:flex-row justify-between items-center gap-6" dir={isEn ? "ltr" : "rtl"}>
          <div className={`space-y-1 ${isEn ? 'text-left' : 'text-right'}`}>
            <h3 className="text-xl font-bold flex items-center gap-2 justify-start text-[#003D7A] dark:text-white">
              <Award className="w-5 h-5 text-[#FF6B35]" />
              <span>{isEn ? "Domya Scientific & Marketing Quality Guarantee" : "ضمان الجودة العلمية والتسويقية من دوميا"}</span>
            </h3>
            <p className="text-[#2C3E50] dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-semibold">
              {isEn 
                ? "All medical scripts and content are scientifically reviewed and verified to comply with medical ethics standards and your country's medical board regulations before filming or publishing."
                : "جميع السيناريوهات والنصوص الطبية تتم مراجعتها وتدقيقها علمياً للتأكد من مطابقتها لأخلاقيات مهنة الطب وقوانين نقابة الأطباء في دولتك قبل بدء تصويرها أو نشرها."
              }
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="px-5 py-3 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] font-bold text-xs sm:text-sm block">
              {isEn ? "Your Certified Digital Partner 🤝" : "شريكك الرقمي المعتمد 🤝"}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
