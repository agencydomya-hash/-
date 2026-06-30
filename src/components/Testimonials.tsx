
import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Award, Sparkles, Heart } from 'lucide-react';
import { Testimonial } from '../types';

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test_1",
    name: "د. أحمد الشريف",
    specialty: "استشاري جراحة العظام والمفاصل - التجمع الخامس 🦴",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "مع تيم دوميا، تواجدي الرقمي اختلف 180 درجة. صورنا في العيادة بمعدات سينمائية فخمة وساعدوني في تبسيط المصطلحات العلمية المعقدة. المرضى بيجوا العيادة دلوقتي وهما حاسين إنهم يعرفوني شخصياً بالفعل وحافظين كلامي من الفيديوهات.",
    results: "زيادة الحجوزات 150% + تضاعف المتابعين العضويين"
  },
  {
    id: "test_2",
    name: "د. نورة العتيبي",
    specialty: "أخصائية الجلدية والتجميل والليزر - الرياض 🌸",
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "أكتر شيء ميز التعامل هو الاحترافية والتنظيم الدقيق للوقت. تيم دوميا مريحين جداً، السكريبتات مجهزة مسبقاً وتصحيح الألوان في الفيديوهات يظهر العيادة والتفاصيل بشكل فخم جداً يليق بمستوانا الطبي. المريض بيحجز وهو مطمئن تماماً.",
    results: "+2.4 مليون مشاهدة عضوية وتصدر نتائج البحث في منطقتها"
  },
  {
    id: "test_3",
    name: "د. مصطفى الجمال",
    specialty: "استشاري طب وزراعة الأسنان - الإسكندرية 🦷",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "كنت دايماً رافض فكرة السوشيال ميديا لأنها بتظهر الطبيب بشكل استعراضي مش محترم. لكن تيم دوميا فهموا قلقي وصنعوا لي خطة حضور تتسم بالوقار الطبي، الدقة العلمية، والتبسيط الراقي. النتيجة كانت مبهرة وتفاعلاً كبيراً من الزملاء والمرضى.",
    results: "إغلاق 40 حالة زراعة أسنان كاملة من السوشيال ميديا مباشرة"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white border-b border-slate-200" id="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[#FF6B35] font-bold uppercase tracking-wider text-sm block">قصص نجاح حقيقية</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#003D7A]">
            أطباء وضعوا ثقتهم في دوميا لتصميم حضورهم الرقمي 🌟
          </h2>
          <p className="text-[#2C3E50] max-w-2xl mx-auto text-xs sm:text-sm font-semibold">
            شاهد كيف ساعدنا كبار الاستشاريين والأخصائيين في مصر والمملكة العربية السعودية على كسب مكانة رقمية مرموقة وجذب المرضى عياداتهم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#E5E7EB] p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md flex flex-col justify-between relative group hover:border-[#FF6B35]/30 transition duration-300"
            >
              {/* Top Quote Icon decoration */}
              <div className="absolute top-6 left-6 text-[#FF6B35]/5 select-none pointer-events-none group-hover:text-[#FF6B35]/10 transition duration-300">
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
                <p className="text-[#2C3E50] text-xs sm:text-sm leading-relaxed text-right font-medium italic">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              {/* Doctor Profile Banner */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3.5 text-right">
                <div className="relative">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B35]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="w-4 h-4 bg-[#FF6B35] rounded-full absolute bottom-0 right-0 border-2 border-white flex items-center justify-center text-[8px] text-white">
                    ✓
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#003D7A] text-sm sm:text-base">{test.name}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-semibold">{test.specialty}</p>
                  
                  {/* Result Badge */}
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[#10B981] text-[10px] font-bold">
                    <Heart className="w-3 h-3 text-[#10B981] fill-current" />
                    <span>النتيجة: {test.results}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand guarantee banner */}
        <div className="mt-16 bg-gradient-to-r from-[#003D7A]/5 via-white to-[#FF6B35]/5 border border-[#E5E7EB] p-8 rounded-3xl text-center flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-right">
            <h3 className="text-xl font-bold flex items-center gap-2 justify-start text-[#003D7A]">
              <Award className="w-5 h-5 text-[#FF6B35]" />
              <span>ضمان الجودة العلمية والتسويقية من دوميا</span>
            </h3>
            <p className="text-[#2C3E50] text-xs sm:text-sm max-w-2xl leading-relaxed font-semibold">
              جميع السيناريوهات والنصوص الطبية تتم مراجعتها وتدقيقها علمياً للتأكد من مطابقتها لأخلاقيات مهنة الطب وقوانين نقابة الأطباء في دولتك قبل بدء تصويرها أو نشرها.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="px-5 py-3 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] font-bold text-xs sm:text-sm block">
              شريكك الرقمي المعتمد 🤝
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
