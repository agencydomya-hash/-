/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Video, Calendar, Users, CheckCircle2, FileText, Smartphone, Target, MapPin, Globe, BarChart3, Lightbulb } from 'lucide-react';

const SYMPTOMS = [
  {
    icon: ShieldAlert,
    title: "غياب الظهور الجغرافي للعيادة",
    desc: "المرضى في منطقتك الجغرافية مش عارفين عيادتك ولا تخصصك الدقيق لأن خرائط جوجل وصفحاتك غير مهيأة محلياً.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25"
  },
  {
    icon: Video,
    title: "محتوى غير سينمائي يقلل الهيبة",
    desc: "تصوير الفيديوهات الطبية بالموبايل مع إضاءة ضعيفة وصوت مشوش بيقلل من قيمتك العلمية عند المشاهد المتعلم.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25"
  },
  {
    icon: Calendar,
    title: "انقطاع عشوائي في النشر والمتابعة",
    desc: "النشر بدون جدول أو استراتيجية واضحة بيخلي خوارزميات السوشيال ميديا تخفي حساباتك، وبيهدر مجهود تحضيرك.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/25"
  },
  {
    icon: Users,
    title: "تفاعل مرتفع بلا حجوزات فعلية",
    desc: "حساباتك ممكن تجيب لايكات ومتابعين، لكن مفيش مريض حقيقي بيطلب العنوان أو بيتصل بالعيادة لأن مفيش قمع تسويقي.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/25"
  }
];

const INTEGRATED_SERVICES = [
  {
    rx: "Rx 01",
    icon: Video,
    title: "إنتاج محتوى Reels سينمائي 📹",
    desc: "تصوير احترافي بداخل عيادتك بكاميرات سينما 4K، إضاءة استوديو ناعمة تبرز مظهر الطبيب الوقور، وصوت معزول بالكامل.",
    features: ["تصوير سينمائي في عيادتك", "مونتاج Reels ديناميكي جذاب", "تعديل ألوان وتصحيح بصري"]
  },
  {
    rx: "Rx 02",
    icon: FileText,
    title: "كتابة محتوى طبي جاذب ✍️",
    desc: "صياغة اسكريبتات طبية بلغة عامية مفهومة وصيادلة يبسطون المصطلحات اللاتينية دون الإخلال بالضمير العلمي والدقة.",
    features: ["تبسيط للمصطلحات اللاتينية", "خطاف (Hook) في أول 3 ثواني", "التزام علمي ودقة تامة"]
  },
  {
    rx: "Rx 03",
    icon: Smartphone,
    title: "إدارة حسابات السوشيال 📱",
    desc: "إدارة كاملة لحساباتك (فيسبوك، إنستجرام، يوتيوب، تيك توك) بجدولة نشر منظم وتغطية الردود التفاعلية.",
    features: ["جدولة نشر أسبوعية ملتزمة", "صناعة غلاف فيديوهات متميز", "إشراف ومتابعة للمنصات"]
  },
  {
    rx: "Rx 04",
    icon: Target,
    title: "إعلانات ممولة مستهدفة 🎯",
    desc: "تخطيط وإطلاق حملات إعلانية جغرافية ممولة ومستهدفة للمرضى في محيط عيادتك الجغرافي لتحقيق حجوزات فعلية.",
    features: ["استهداف جغرافي وديموغرافي دقيق", "تحليل تكلفة الحجز لتقليل الصرف", "تقارير العائد الاستثماري (ROI)"]
  },
  {
    rx: "Rx 05",
    icon: MapPin,
    title: "تحسين خرائط جوجل 🗺️",
    desc: "تهيئة عيادتك للظهور في محركات البحث المحلية لجوجل مابس، وتفعيل تقييمات المرضى الحقيقية لتصدر البحث.",
    features: ["تهيئة الكلمات المفتاحية المحلية", "ترتيب ظهور العيادة جغرافياً", "إشراف على آراء المرضى"]
  },
  {
    rx: "Rx 06",
    icon: Globe,
    title: "تصميم الملف الطبي الرقمي 🏥",
    desc: "بناء صفحة ويب/موقع هبوط طبي فخم يعرض سيرتك الذاتية وقصص نجاح المرضى مع نموذج حجز مباشر ويسير.",
    features: ["موقع سريع متوافق مع الموبايل", "قالب استعراض قصص النجاح", "نظام حجز مواعيد فوري"]
  },
  {
    rx: "Rx 07",
    icon: BarChart3,
    title: "تحليل الأداء والتقارير 📊",
    desc: "تزويدك بتقرير رقمي شهري يوضح زيادة الاتصالات والمشاهدات والحجوزات الفعلية لمتابعة نمو العيادة بالأرقام.",
    features: ["تتبع المكالمات والرسائل الواردة", "قياس عائد الصرف الإعلاني بدقة", "تقارير نمو دورية مبسطة"]
  },
  {
    rx: "Rx 08",
    icon: Lightbulb,
    title: "استشارات تسويقية طبية 💡",
    desc: "جلسات استشارية دورية مع خبراء التسويق الطبي لتوجيه وتدريب فريق سكرتارية عيادتك على التعامل مع الحجوزات الرقمية.",
    features: ["تدريب السكرتارية على الاتصالات", "خطط نمو وتوسع العيادات", "متابعة ودعم تسويقي فني مستمر"]
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-transparent text-white" id="services-and-solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Symptoms (الأعراض) */}
        <div className="text-center mb-16 space-y-3" dir="rtl">
          <span className="text-[#FF5100] font-bold uppercase tracking-wider text-sm block">مرحلة الكشف السريري</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-white">
            أعراض الحضور الرقمي الضعيف للأطباء 🩺
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            لو بتواجه واحد أو أكتر من الأعراض دي، فعيادتك بتخسر عشرات المرضى الجدد يومياً لصالح منافسين أقل كفاءة علمية لكن أكتر ظهوراً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYMPTOMS.map((symptom, idx) => {
            const IconComponent = symptom.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass p-6 rounded-3xl hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4 text-right" dir="rtl">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <IconComponent className={`w-6 h-6 ${symptom.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{symptom.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">{symptom.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section 2: Treatment Plan (الخدمات الطبية المتكاملة) */}
        <div className="mt-28 glass p-8 sm:p-12 lg:p-16 rounded-[40px] shadow-2xl relative overflow-hidden text-white" id="treatment-plan">
          
          {/* Subtle aurora blob background inside the container */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/5 aurora-blob"></div>
          <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/5 aurora-blob-2"></div>

          <div className="text-center mb-16 space-y-3 relative z-10" dir="rtl">
            <span className="text-[#FF5100] font-bold uppercase tracking-wider text-sm block">الوصفة الطبية المتكاملة</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-white">
              الخدمات الطبية المتكاملة من دومايا 💊
            </h2>
            <p className="text-slate-350 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              هندسة حضورك الرقمي وبناء براند طبي فخم من عيادتك يخليك المرجع الأول لمرضاك. إليك تفاصيل خدماتنا:
            </p>
          </div>

          {/* 8-Column Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10" dir="rtl">
            {INTEGRATED_SERVICES.map((service, idx) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg hover:border-[#FF5100]/30 transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Background watermarked large Rx */}
                  <span className="absolute top-2 left-4 text-6xl font-serif font-black text-white/5 select-none pointer-events-none font-mono">
                    {service.rx}
                  </span>

                  <div className="space-y-4 text-right">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#FF5100]/10 border border-[#FF5100]/25 text-[#FF5100] font-mono text-xs font-bold">
                        {service.rx}
                      </span>
                      <IconComponent className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#FF5100] tracking-tight">{service.title}</h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">{service.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 space-y-1.5">
                    <span className="text-[9px] text-slate-450 uppercase tracking-widest block font-mono">تفاصيل الخدمة:</span>
                    <ul className="space-y-1">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5 justify-start text-[10px] sm:text-xs text-slate-200 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
