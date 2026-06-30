/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, ChevronLeft, User, TrendingUp, Sparkles, Stethoscope, CheckCircle2, Video } from 'lucide-react';

interface Reel {
  id: string;
  specialty: string;
  doctorName: string;
  title: string;
  views: string;
  coverColor: string;
  length: number;
  qualityPillars: string[];
  subtitles: { time: number; text: string }[];
  videoUrl?: string;
  coverUrl?: string;
  challenge: string;
  result: string;
  treatment: string;
}

const REELS_DATA: Reel[] = [
  {
    id: "reel_ortho",
    specialty: "جراحة العظام والمفاصل",
    doctorName: "د. هاني الرفاعي",
    title: "خرافة طقطقة الرقبة.. هل بتسبب خشونة فعلاً؟",
    views: "124K",
    coverColor: "from-[#1E3A8A] to-[#3B82F6]",
    length: 12,
    challenge: "الطبيب لديه خبرة واسعة لكنه غير مرئي إطلاقاً في محيطه الجغرافي ويبحث عن طريقة وقورة للظهور.",
    result: "تأمين 45 حجز كشف جديد في أول 30 يوم من إطلاق الحملة الجغرافية.",
    treatment: "تصوير سينمائي 4K بداخل العيادة، كتابة اسكريبت طبي يبسط خشونة المفاصل بالعامية الدارجة دون ابتذال.",
    qualityPillars: [
      "ميكروفون لاسلكي ذو عزل فائق لتنقية ترددات الصوت",
      "تصوير بكاميرا سوني السينمائية مع عمق عزل فخم خلف الطبيب",
      "مؤثرات بصرية وصور حية للمفاصل تظهر عند ذكرها"
    ],
    subtitles: []
  },
  {
    id: "reel_derma",
    specialty: "الجلدية والتجميل والليزر",
    doctorName: "د. ياسمين شاهين",
    title: "الترتيب الصح لمنتجات العناية بالبشرة بالليل!",
    views: "310K",
    coverColor: "from-[#9D174D] to-[#F472B6]",
    length: 15,
    challenge: "المنافسة شرسة جداً في تجميل الجلدية بالرياض وصعوبة التميز وسط فيديوهات الفلاتر التجارية البسيطة.",
    result: "الحصول على +2.4 مليون مشاهدة عضوية وتصدر نتائج البحث للتجميل بالمنطقة.",
    treatment: "استخدام إضاءة استوديو دائرية سينمائية تبرز صفاء البشرة، وتصميم سيناريو تفاعلي يجبر المشاهد على حفظ المقطع.",
    qualityPillars: [
      "إضاءة استوديو ناعمة دائرية تبرز صفاء البشرة بشكل طبيعي",
      "مونتاج ديناميكي سريع الحركة يمنع المشاهد من التمرير",
      "لوحة ألوان دافئة مريحة تعكس الفخامة والاهتمام بالجمال"
    ],
    subtitles: []
  },
  {
    id: "reel_pedia",
    specialty: "طب الأطفال وحديثي الولادة",
    doctorName: "د. عادل الشاذلي",
    title: "أول خطوة لو حرارة طفلك ارتفعت فجأة بالليل!",
    views: "185K",
    coverColor: "from-[#065F46] to-[#34D399]",
    length: 13,
    challenge: "صعوبة تبسيط طوارئ الأطفال للأمهات دون إخافتهن، وحاجة العيادة لبناء خط اتصال موثوق ومستمر.",
    result: "زيادة استفسارات واتصالات الحجز بالعيادة بنسبة 180% عبر تفعيل الرد الآلي.",
    treatment: "مونتاج بخرائط بصرية توضح طريقة استخدام الكمادات، ومؤثرات صوتية تطمئن الآباء وتبرز إنسانية الطبيب.",
    qualityPillars: [
      "مؤثرات صوتية هادئة مريحة للأمهات والآباء القلقين",
      "سيناريو يبسط طوارئ الأطفال بطمأنينة علمية فائقة",
      "تصوير خلفية دافئة مريحة لعيادة أطفال مبهجة"
    ],
    subtitles: []
  }
];

export default function ReelsGallery() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch('/api/reels');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((r: any) => ({
              ...r,
              specialty: (r.specialty || "").replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, ""),
              challenge: r.challenge || "غياب التواجد الرقمي الممنهج وصعوبة بناء الثقة الرقمية مع المرضى قبل الحجز.",
              result: r.result || "زيادة الحجوزات الفعلية بنسبة تتجاوز 150% بالعيادة.",
              treatment: r.treatment || "إنتاج محتوى Reels عالي الجودة بالعيادة مع كتابة نصوص طبية تبسط المعلومة."
            }));
            setReels(mapped);
          } else {
            setReels(REELS_DATA);
          }
        } else {
          setReels(REELS_DATA);
        }
      } catch (err) {
        setReels(REELS_DATA);
      }
    };
    fetchReels();
  }, []);

  // Autoplay Effect (Runs when not hovered, not playing, and has multiple reels)
  useEffect(() => {
    if (isPlaying || isHovered || reels.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reels.length);
    }, 8000); // 8 seconds transition

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, reels.length, activeIndex]);

  // Handle Play/Pause logic preserving DOM elements
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;
      if (index === activeIndex && isPlaying) {
        videoEl.play().catch((err) => {
          console.log("Video playback interrupted/blocked:", err);
        });
      } else {
        videoEl.pause();
        if (index !== activeIndex) {
          videoEl.currentTime = 0;
        }
      }
    });
  }, [activeIndex, isPlaying]);

  const handleNext = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleCTABooking = () => {
    setShowToast("جاري توجيهك لملء استمارة حجز جلسة التصوير المجانية...");
    setTimeout(() => {
      const bookingSection = document.getElementById("booking-section");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);
  };

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  if (reels.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200" id="media-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Toast Alert */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-2xl z-[100] text-center"
            >
              {showToast}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-16 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 text-[#FF5100] rounded-full text-sm font-semibold">
            <Video className="w-4 h-4" />
            <span>معرض دراسات النجاح الطبية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#091B65]">
            كيف نصنع الحضور ونقيس النتائج بالأرقام
          </h2>
          <p className="text-slate-650 max-w-2xl mx-auto text-xs sm:text-sm">
            تصفح ملفات الأطباء وشاهد جودة الفيديوهات ونسب زيادة الحجوزات الناتجة عن إشراف وتخطيط وكالة دومايا.
          </p>
        </div>

        {/* CASE STUDY SPLIT VIEW VIEWPORT CONTAINER */}
        <div 
          className="max-w-5xl mx-auto bg-white rounded-[32px] border border-slate-200/80 shadow-2xl overflow-hidden relative h-[720px] md:h-[580px]" 
          dir="rtl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Decorative premium bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-[#FF5100] to-orange-600 z-30" />

          {/* Slider track preserving video DOM states */}
          <div 
            className="w-full h-full flex flex-col"
            style={{ 
              transform: `translateY(-${activeIndex * 100}%)`,
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {reels.map((reel, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={reel.id} 
                  className="w-full h-full flex-shrink-0 grid grid-cols-1 md:grid-cols-12 relative"
                >
                  
                  {/* Right Side (5 cols): Video Player */}
                  <div className="col-span-12 md:col-span-5 bg-slate-950 relative h-[320px] md:h-full flex items-center justify-center border-l border-slate-100">
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={reel.videoUrl || "/uploads/1782738053406_5.mp4"}
                      poster={reel.coverUrl || "/uploads/1782738201126_473188690_598630842913487_4523441016009157157_n.jpg"}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      muted={false}
                      playsInline
                      onClick={togglePlay}
                    />

                    {/* Play Overlay */}
                    <div 
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer bg-black/10 hover:bg-black/20 transition duration-300"
                    >
                      {(!isPlaying || !isActive) && (
                        <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition transform hover:scale-105 active:scale-95 border border-white/10 shadow-xl">
                          <Play className="w-6 h-6 fill-current ml-1 text-orange-500" />
                        </div>
                      )}
                    </div>

                    {/* Specialty Tag Overlay */}
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold rounded-lg border border-white/10">
                      {reel.specialty}
                    </div>
                  </div>

                  {/* Left Side (7 cols): Case Study Details Card */}
                  <div className="col-span-12 md:col-span-7 p-6 sm:p-10 flex flex-col justify-between text-right text-slate-800 space-y-6 h-[400px] md:h-full">
                    
                    <div className="space-y-4 md:space-y-6">
                      {/* Doctor Bio */}
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 md:pb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5100] border border-orange-200">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-blue-900">{reel.doctorName}</h3>
                          <span className="text-xs text-slate-450 font-bold block mt-0.5">{reel.specialty}</span>
                        </div>
                      </div>

                      {/* Case Study Header & Title */}
                      <div>
                        <span className="text-[10px] text-orange-600 font-bold block uppercase tracking-wider font-mono">عنوان الموضوع التثقيفي:</span>
                        <h4 className="text-base md:text-lg font-bold text-slate-900 mt-1 leading-snug">{reel.title}</h4>
                      </div>

                      {/* Challenge & Treatment Layout */}
                      <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {/* The Challenge */}
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-blue-900 flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5 text-[#FF5100]" />
                            <span>حالة العيادة قبل التدخل:</span>
                          </h5>
                          <p className="text-xs text-slate-605 leading-relaxed font-semibold">
                            {reel.challenge}
                          </p>
                        </div>

                        {/* Treatment Protocol */}
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-blue-900 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>خطة ميديا بروداكشن دومايا:</span>
                          </h5>
                          <p className="text-xs text-slate-605 leading-relaxed font-semibold">
                            {reel.treatment}
                          </p>
                        </div>
                      </div>

                      {/* Highlighted Result Box */}
                      <div className="bg-emerald-50 border border-emerald-150 p-3 md:p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-emerald-700 block font-bold uppercase tracking-widest font-mono">النتيجة بعد النشر والإعلان:</span>
                          <p className="text-xs font-bold text-emerald-800 leading-snug mt-0.5">
                            {reel.result}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions and Navigation */}
                    <div className="pt-3 border-t border-slate-100 flex flex-row gap-4 items-center justify-between">
                      {/* Arrow Switchers */}
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={handlePrev}
                          className="p-2 md:p-2.5 rounded-xl bg-slate-105 hover:bg-slate-200 border border-slate-200 text-slate-700 transition cursor-pointer"
                          aria-label="Previous Case Study"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">
                          {index + 1} / {reels.length}
                        </span>
                        <button
                          onClick={handleNext}
                          className="p-2 md:p-2.5 rounded-xl bg-slate-105 hover:bg-slate-200 border border-slate-200 text-slate-700 transition cursor-pointer"
                          aria-label="Next Case Study"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>

                      {/* CTA Call */}
                      <button
                        onClick={handleCTABooking}
                        className="px-4 md:px-6 py-2.5 md:py-3 bg-[#FF5100] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تصوير ميديا مماثلة لعيادتي</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
