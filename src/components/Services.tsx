/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Video, Calendar, Users, Cpu, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

const SYMPTOMS = [
  {
    icon: ShieldAlert,
    title: "غياب الظهور الجغرافي للعيادة",
    desc: "المرضى في منطقتك الجغرافية مش عارفين عيادتك ولا تخصصك الدقيق لأن خرائط جوجل وصفحاتك غير مهيأة محلياً.",
    color: "text-red-500",
    bg: "bg-red-50"
  },
  {
    icon: Video,
    title: "محتوى غير سينمائي يقلل الهيبة",
    desc: "تصوير الفيديوهات الطبية بالموبايل مع إضاءة ضعيفة وصوت مشوش بيقلل من قيمتك العلمية عند المشاهد المتعلم.",
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    icon: Calendar,
    title: "انقطاع عشوائي في النشر والمتابعة",
    desc: "النشر بدون جدول أو استراتيجية واضحة بيخلي خوارزميات السوشيال ميديا تخفي حساباتك، وبيهدر مجهود تحضيرك.",
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    icon: Users,
    title: "تفاعل مرتفع بلا حجوزات فعلية",
    desc: "حساباتك ممكن تجيب لايكات ومتابعين، لكن مفيش مريض حقيقي بيطلب العنوان أو بيتصل بالعيادة لأن مفيش قمع تسويقي.",
    color: "text-purple-500",
    bg: "bg-purple-50"
  }
];

const TREATMENT_PILLARS = [
  {
    rx: "Rx 01",
    title: "ميديا بروداكشن طبي احترافي 🎥",
    desc: "بننزل لعيادتك بفريق تصوير كامل مجهز بأحدث كاميرات السينما (4K)، وإضاءة استوديو ناعمة، ومايكروفونات احترافية عازلة للضوضاء. النتيجة؟ محتوى مرئي طبي يشع بالثقة والهيبة والموثوقية المطلقة.",
    details: ["تصوير سينمائي في العيادة", "تعديل ألوان وتصحيح بصري متميز", "تلقين احترافي لو مش حابب تحفظ الاسكريبت"]
  },
  {
    rx: "Rx 02",
    title: "فريق طبي متخصص لكتابة المحتوى ✍️",
    desc: "عندنا صناع محتوى متخصصين في المجال الطبي وصيادلة بيبسطوا كلامك المعقد للهجة عامية مصرية وسعودية ودودة جداً تجذب انتباه المريض العادي في أول 3 ثواني، مع الاحتفاظ الكامل بالدقة العلمية والوقار.",
    details: ["تبسيط المصطلحات اللاتينية", "هوك (Hook) قوي يجذب الانتباه", "التزام بالحقائق الطبية والضمير المهني"]
  },
  {
    rx: "Rx 03",
    title: "نظام تسليم سلس وتيم منظم ⏱️",
    desc: "وداعاً لعشوائية التعامل مع الفريلانسرز. مع دومايا، ليك مدير مشروع مخصص بيكلمك، بنمشي بجدول شهري واضح، كل الفيديوهات بتترفع على فولدر خاص لمراجعتها بلمساتك قبل النشر، وتسليماتنا دقيقة زي عقارب الساعة.",
    details: ["مدير حساب طبي مخصص لك", "تعديلات غير محدودة قبل النشر", "جدول نشر وإدارة أسبوعية ملتزمة"]
  },
  {
    rx: "Rx 04",
    title: "كل الخدمات التسويقية في مكان واحد 🎯",
    desc: "مش بس تصوير ومونتاج، إحنا بنعملك إدارة كاملة للصفحات (فيسبوك، إنستجرام، يوتيوب، تيك توك)، وبنصمم لك إعلانات ممولة جغرافية مستهدفة بتوجيه دقيق للمرضى في محيط عيادتك علشان نزود اتصالات وحجوزات عيادتك فوراً.",
    details: ["إدارة حسابات والرد على الرسائل", "إعلانات ممولة مستهدفة جغرافياً", "تصميم صور مصغرة (Thumbnails) متميزة"]
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-white" id="services-and-solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Symptoms (الأعراض) */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-[#FF8C00] font-bold uppercase tracking-wider text-sm block">مرحلة الكشف السريري</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#1A2B5B]">
            أعراض الحضور الرقمي الضعيف للأطباء 🩺
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
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
                className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/80 hover:border-[#1A2B5B]/20 transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${symptom.bg} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${symptom.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A2B5B]">{symptom.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{symptom.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section 2: Treatment Plan (الخطة العلاجية) */}
        <div className="mt-28" id="treatment-plan">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[#FF8C00] font-bold uppercase tracking-wider text-sm block">الوصفة الطبية المتكاملة</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#1A2B5B]">
              الخطة العلاجية الشاملة من دومايا لعام 2026 💊
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              هندسة حضورك الرقمي وبناء براند طبي فخم من عيادتك يخليك المرجع الأول لمرضاك. إليك تفاصيل خطتك العلاجية:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {TREATMENT_PILLARS.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#0a1128] to-[#1A2B5B] p-8 rounded-2xl text-white relative overflow-hidden shadow-xl border border-white/5"
              >
                {/* Background watermarked large Rx */}
                <span className="absolute top-2 left-4 text-7xl font-serif font-black text-white/[0.03] select-none pointer-events-none">
                  {pillar.rx}
                </span>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-sm font-bold">
                      {pillar.rx}
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  </div>

                  <h3 className="text-xl font-bold text-[#FF8C00] tracking-tight">{pillar.title}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{pillar.desc}</p>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">تفاصيل بروتوكول العلاج:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {pillar.details.map((detail, dIdx) => (
                        <div key={dIdx} className="bg-white/5 px-2.5 py-1.5 rounded text-xs text-gray-200 border border-white/5 font-semibold">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
