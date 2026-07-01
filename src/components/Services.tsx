import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Video, Calendar, Users, CheckCircle2, FileText, Smartphone, Target, MapPin, Globe, BarChart3, Lightbulb } from 'lucide-react';
import { translations } from '../translations';

const getSymptoms = (isEn: boolean) => [
  {
    icon: ShieldAlert,
    title: isEn ? "Invisible Local Presence" : "غياب الظهور الجغرافي للعيادة",
    desc: isEn ? "Patients in your area don't know your clinic or exact sub-specialty because your local SEO and map listings aren't optimized." : "المرضى في منطقتك الجغرافية مش عارفين عيادتك ولا تخصصك الدقيق لأن خرائط جوجل وصفحاتك غير مهيأة محلياً.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25"
  },
  {
    icon: Video,
    title: isEn ? "Low-Quality Video Content" : "محتوى غير سينمائي يقلل الهيبة",
    desc: isEn ? "Filming medical videos with smartphones in dim lighting and noisy sound decreases your scientific authority for educated viewers." : "تصوير الفيديوهات الطبية بالموبايل مع إضاءة ضعيفة وصوت مشوش بيقلل من قيمتك العلمية عند المشاهد المتعلم.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25"
  },
  {
    icon: Calendar,
    title: isEn ? "Inconsistent Publishing Schedule" : "انقطاع عشوائي في النشر والمتابعة",
    desc: isEn ? "Publishing without a strict schedule or strategy causes social media algorithms to hide your accounts, wasting your prep effort." : "النشر بدون جدول أو استراتيجية واضحة بيخلي خوارزميات السوشيال ميديا تخفي حساباتك، وبيهدر مجهود تحضيرك.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/25"
  },
  {
    icon: Users,
    title: isEn ? "High Engagement, Zero Bookings" : "تفاعل مرتفع بلا حجوزات فعلية",
    desc: isEn ? "Your accounts might get likes and followers, but no real patients call the clinic because there is no booking funnel." : "حساباتك ممكن تجيب لايكات ومتابعين، لكن مفيش مريض حقيقي بيطلب العنوان أو بيتصل بالعيادة لأن مفيش قمع تسويقي.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/25"
  }
];

const getIntegratedServices = (isEn: boolean) => [
  {
    rx: "Rx 01",
    icon: Video,
    title: isEn ? "Cinematic Video Production 📹" : "إنتاج محتوى Reels سينمائي 📹",
    desc: isEn ? "Professional filming inside your clinic with 4K cinema cameras and soft studio lighting to showcase the doctor's prestige." : "تصوير احترافي بداخل عيادتك بكاميرات سينما 4K، إضاءة استوديو ناعمة تبرز مظهر الطبيب الوقور، وصوت معزول بالكامل.",
    features: isEn ? ["In-clinic cinematic shoots", "Dynamic Reels video editing", "Color-grading and visual correction"] : ["تصوير سينمائي في عيادتك", "مونتاج Reels ديناميكي جذاب", "تعديل ألوان وتصحيح بصري"]
  },
  {
    rx: "Rx 02",
    icon: FileText,
    title: isEn ? "Engaging Medical Content Writing ✍️" : "كتابة محتوى طبي جاذب ✍️",
    desc: isEn ? "Drafting simplified, readable medical scripts in accessible language that explain terms without sacrificing scientific accuracy." : "صياغة اسكريبتات طبية بلغة عامية مفهومة وصيادلة يبسطون المصطلحات اللاتينية دون الإخلال بالضمير العلمي والدقة.",
    features: isEn ? ["Simplified medical jargon", "3-second video hooks", "Strict scientific accuracy"] : ["تبسيط للمصطلحات اللاتينية", "خطاف (Hook) في أول 3 ثواني", "التزام علمي ودقة تامة"]
  },
  {
    rx: "Rx 03",
    icon: Smartphone,
    title: isEn ? "Social Media Account Management 📱" : "إدارة حسابات السوشيال 📱",
    desc: isEn ? "Complete management of your pages (Facebook, Instagram, YouTube, TikTok) with systematic publishing schedules." : "إدارة كاملة لحساباتك (فيسبوك، إنستجرام، يوتيوب، تيك توك) بجدولة نشر منظم وتغطية الردود التفاعلية.",
    features: isEn ? ["Weekly posting schedule", "Premium thumbnail designs", "Platform monitoring and moderation"] : ["جدولة نشر أسبوعية ملتزمة", "صناعة غلاف فيديوهات متميز", "إشراف ومتابعة للمنصات"]
  },
  {
    rx: "Rx 04",
    icon: Target,
    title: isEn ? "Targeted Paid Campaigns 🎯" : "إعلانات ممولة مستهدفة 🎯",
    desc: isEn ? "Planning and launching local geographic paid ad campaigns targeted at patients near your clinic to drive bookings." : "تخطيط وإطلاق حملات إعلانية جغرافية ممولة ومستهدفة للمرضى في محيط عيادتك الجغرافي لتحقيق حجوزات فعلية.",
    features: isEn ? ["Precise geotargeting", "Acquisition cost analysis", "Monthly ROI performance reports"] : ["استهداف جغرافي وديموغرافي دقيق", "تحليل تكلفة الحجز لتقليل الصرف", "تقارير العائد الاستثماري (ROI)"]
  },
  {
    rx: "Rx 05",
    icon: MapPin,
    title: isEn ? "Google Maps Local SEO 🗺️" : "تحسين خرائط جوجل 🗺️",
    desc: isEn ? "Optimizing your clinic on Google Maps and search results, and activating patient reviews to rank higher." : "تهيئة عيادتك للظهور في محركات البحث المحلية لجوجل مابس، وتفعيل تقييمات المرضى الحقيقية لتصدر البحث.",
    features: isEn ? ["Local keyword optimization", "Geographic map search rankings", "Reputation & reviews supervision"] : ["تهيئة الكلمات المفتاحية المحلية", "ترتيب ظهور العيادة جغرافياً", "إشراف على آراء المرضى"]
  },
  {
    rx: "Rx 06",
    icon: Globe,
    title: isEn ? "Premium Web Layout Design 🏥" : "تصميم الملف الطبي الرقمي 🏥",
    desc: isEn ? "Building a fast, luxury personal brand landing page displaying your CV, success stories, and booking forms." : "بناء صفحة ويب/موقع هبوط طبي فخم يعرض سيرتك الذاتية وقصص نجاح المرضى مع نموذج حجز مباشر ويسير.",
    features: isEn ? ["Mobile-friendly fast design", "Success stories gallery layout", "Instant appointment booking form"] : ["موقع سريع متوافق مع الموبايل", "قالب استعراض قصص النجاح", "نظام حجز مواعيد فوري"]
  },
  {
    rx: "Rx 07",
    icon: BarChart3,
    title: isEn ? "Analytics & Reports 📊" : "تحليل الأداء والتقارير 📊",
    desc: isEn ? "Providing a monthly statistics report explaining clinic call volumes, views, and actual booking rates." : "تزويدك بتقرير رقمي شهري يوضح زيادة الاتصالات والمشاهدات والحجوزات الفعلية لمتابعة نمو العيادة بالأرقام.",
    features: isEn ? ["Inbound calls & leads tracking", "Ad spend acquisition analysis", "Simplified periodic growth reports"] : ["تتبع المكالمات والرسائل الواردة", "قياس عائد الصرف الإعلاني بدقة", "تقارير نمو دورية مبسطة"]
  },
  {
    rx: "Rx 08",
    icon: Lightbulb,
    title: isEn ? "Medical Growth Consulting 💡" : "استشارات تسويقية طبية 💡",
    desc: isEn ? "Periodic sessions with medical marketing consultants to train clinic receptionists on handling digital bookings." : "جلسات استشارية دورية مع خبراء التسويق الطبي لتوجيه وتدريب فريق سكرتارية عيادتك على التعامل مع الحجوزات الرقمية.",
    features: isEn ? ["Receptionist conversion training", "Clinic branch growth blueprint", "Continuous marketing technical support"] : ["تدريب السكرتارية على الاتصالات", "خطط نمو وتوسع العيادات", "متابعة ودعم تسويقي فني مستمر"]
  }
];

interface ServicesProps {
  lang?: 'ar' | 'en';
}

export default function Services({ lang = 'ar' }: ServicesProps) {
  const t = translations[lang];
  const isEn = lang === 'en';

  const symptoms = getSymptoms(isEn);
  const services = getIntegratedServices(isEn);

  return (
    <section className="py-24 bg-transparent text-[#2C3E50] dark:text-slate-200" id="services-and-solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Symptoms (الأعراض) */}
        <div className={`text-center mb-16 space-y-3 ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Symptoms of Weak Digital Presence 🩺" : "أعراض الحضور الرقمي الضعيف للأطباء 🩺"}
          </h2>
          <p className="text-[#2C3E50] dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            {isEn 
              ? "Do you suffer from any of these symptoms? If you suffer from more than one, you are losing dozens of patients daily."
              : "هل تعاني من أي من هذه الأعراض؟ لو أنت تعاني من أكثر من عرض واحد، فأنت تخسر عشرات المرضى يومياً."
            }
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-4 md:pb-0 md:overflow-x-visible" dir={isEn ? "ltr" : "rtl"}>
          {symptoms.map((symptom, idx) => {
            const IconComponent = symptom.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shrink-0 snap-start w-[85vw] sm:w-[280px] md:w-auto"
              >
                <div className={`space-y-4 ${isEn ? 'text-left' : 'text-right'}`}>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003D7A] dark:text-white">{symptom.title}</h3>
                  <p className="text-[#2C3E50] dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">{symptom.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Symptoms CTA & Urgency */}
        <div className="text-center mt-12 space-y-4" dir={isEn ? "ltr" : "rtl"}>
          <p className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-slate-355 leading-relaxed">
            {isEn ? "If you suffer from more than one symptom, you are losing potential patients." : "لو أنت تعاني من أكثر من عرض واحد، فأنت تخسر عشرات المرضى يومياً."}
            <br />
            <span className="text-[#FF6B35]">
              {isEn ? "The solution is simple: start your free audit below ↓" : "الحل بسيط: ابدأ التشخيص الفوري الآن ↓"}
            </span>
          </p>
          <div className="inline-flex items-center gap-1.5 text-[#EF4444] font-bold text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30">
            <span>⏰</span>
            <span>{isEn ? "Every day you wait, your competitors win your patients" : "كل يوم تنتظر، منافسك يأخذ مرضاءك"}</span>
          </div>
        </div>

        {/* Section 2: Treatment Plan (الخدمات الطبية المتكاملة) */}
        <div className="mt-28 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-8 sm:p-12 lg:p-16 rounded-[40px] shadow-sm relative overflow-hidden text-[#2C3E50] dark:text-slate-200 transition-colors" id="treatment-plan">
          
          {/* Subtle aurora blob background inside the container */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/[0.02] aurora-blob"></div>
          <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/[0.02] aurora-blob-2"></div>

          <div className="text-center mb-16 space-y-3 relative z-10" dir={isEn ? "ltr" : "rtl"}>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
              {t.servicesBadge}
            </h2>
            <p className="text-[#2C3E50] dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
              {t.servicesSubtitle}
            </p>
          </div>

          {/* 8-Column Bento Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:pb-0 md:overflow-x-visible relative z-10" dir={isEn ? "ltr" : "rtl"}>
            {services.map((service, idx) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white dark:bg-slate-950 border border-[#E5E7EB] dark:border-slate-800 p-6 rounded-2xl text-[#2C3E50] dark:text-slate-200 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between shrink-0 snap-start w-[85vw] sm:w-[280px] md:w-auto"
                >
                  {/* Background watermarked large Rx */}
                  <span className="absolute top-2 left-4 text-6xl font-serif font-black text-slate-100 dark:text-slate-900 select-none pointer-events-none font-mono">
                    {service.rx}
                  </span>

                  <div className={`space-y-4 ${isEn ? 'text-left' : 'text-right'}`}>
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] font-mono text-xs font-bold">
                        {service.rx}
                      </span>
                      <IconComponent className="w-5 h-5 text-[#FF6B35] group-hover:scale-110 transition-transform" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#003D7A] dark:text-white tracking-tight">{service.title}</h3>
                    <p className="text-[#2C3E50] dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">{service.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-155 dark:border-slate-800 space-y-1.5">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono">
                      {isEn ? "Service Details:" : "تفاصيل الخدمة:"}
                    </span>
                    <ul className="space-y-1">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className={`flex items-center gap-1.5 ${isEn ? 'justify-start' : 'justify-start'} text-[10px] sm:text-xs text-[#2C3E50] dark:text-slate-355 font-semibold`}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Integrated Services CTA */}
          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 text-center space-y-6" dir={isEn ? "ltr" : "rtl"}>
            <p className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {isEn 
                ? "Which of these services does your clinic need most? Answer 3 questions to find out." 
                : "أي من هذه الخدمات تحتاجها أكثر؟ أجب عن 3 أسئلة وسنخبرك بالضبط ما تحتاج ↓"
              }
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
 
      </div>
    </section>
  );
}
