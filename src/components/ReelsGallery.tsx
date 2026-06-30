/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, User, TrendingUp, Sparkles, Stethoscope, CheckCircle2, Video, Eye, Volume2, VolumeX } from 'lucide-react';

interface Reel {
  id: string;
  specialty: string;
  doctorName: string;
  title: string;
  views: string;
  coverColor: string;
  length: number;
  qualityPillars: string[];
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
    coverColor: "from-blue-900 to-blue-700",
    length: 12,
    challenge: "الطبيب لديه خبرة واسعة لكنه غير مرئي إطلاقاً في محيطه الجغرافي ويبحث عن طريقة وقورة للظهور.",
    result: "تأمين 45 حجز كشف جديد في أول 30 يوم من إطلاق الحملة الجغرافية.",
    treatment: "تصوير سينمائي 4K بداخل العيادة، كتابة اسكريبت طبي يبسط خشونة المفاصل بالعامية الدارجة دون ابتذال.",
    qualityPillars: [
      "ميكروفون لاسلكي ذو عزل فائق لتنقية ترددات الصوت",
      "تصوير بكاميرا سوني السينمائية مع عمق عزل فخم خلف الطبيب",
      "مؤثرات بصرية وصور حية للمفاصل تظهر عند ذكرها"
    ]
  },
  {
    id: "reel_derma",
    specialty: "الجلدية والتجميل والليزر",
    doctorName: "د. ياسمين شاهين",
    title: "الترتيب الصح لمنتجات العناية بالبشرة بالليل!",
    views: "310K",
    coverColor: "from-pink-900 to-rose-700",
    length: 15,
    challenge: "المنافسة شرسة جداً في تجميل الجلدية بالرياض وصعوبة التميز وسط فيديوهات الفلاتر التجارية البسيطة.",
    result: "الحصول على +2.4 مليون مشاهدة عضوية وتصدر نتائج البحث للتجميل بالمنطقة.",
    treatment: "استخدام إضاءة استوديو دائرية سينمائية تبرز صفاء البشرة، وتصميم سيناريو تفاعلي يجبر المشاهد على حفظ المقطع.",
    qualityPillars: [
      "إضاءة استوديو ناعمة دائرية تبرز صفاء البشرة بشكل طبيعي",
      "مونتاج ديناميكي سريع الحركة يمنع المشاهد من التمرير",
      "لوحة ألوان دافئة مريحة تعكس الفخامة والاهتمام بالجمال"
    ]
  },
  {
    id: "reel_pedia",
    specialty: "طب الأطفال وحديثي الولادة",
    doctorName: "د. عادل الشاذلي",
    title: "أول خطوة لو حرارة طفلك ارتفعت فجأة بالليل!",
    views: "185K",
    coverColor: "from-emerald-900 to-teal-700",
    length: 13,
    challenge: "صعوبة تبسيط طوارئ الأطفال للأمهات دون إخافتهن، وحاجة العيادة لبناء خط اتصال موثوق ومستمر.",
    result: "زيادة استفسارات واتصالات الحجز بالعيادة بنسبة 180% عبر تفعيل الرد الآلي.",
    treatment: "مونتاج بخرائط بصرية توضح طريقة استخدام الكمادات، ومؤثرات صوتية تطمئن الآباء وتبرز إنسانية الطبيب.",
    qualityPillars: [
      "مؤثرات صوتية هادئة مريحة للأمهات والآباء القلقين",
      "سيناريو يبسط طوارئ الأطفال بطمأنينة علمية فائقة",
      "تصوير خلفية دافئة مريحة لعيادة أطفال مبهجة"
    ]
  }
];

export default function ReelsGallery() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  
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
              treatment: r.treatment || "إنتاج محتوى Reels عالي الجودة بالعيادة مع كتابة نصوص طبية تبسط المعلومة.",
              views: r.views || "100K+",
              coverColor: r.coverColor || "from-blue-950 to-orange-600"
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

  // Handle Play/Pause for individual videos
  useEffect(() => {
    videoRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      if (idx === playingIndex) {
        ref.play().catch((err) => {
          console.log("Play interrupted for index", idx, err);
          setPlayingIndex(null);
        });
      } else {
        ref.pause();
      }
    });
  }, [playingIndex]);

  const handleCardClick = (index: number) => {
    setActiveReelIndex(index);
    if (playingIndex === index) {
      setPlayingIndex(null); // Pause if clicking already playing
    } else {
      setPlayingIndex(index); // Play clicked
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
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

  const currentActiveReel = reels[activeReelIndex];

  return (
    <section className="py-24 bg-transparent text-slate-200 border-b border-white/5 relative z-10" id="reels-gallery">
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

        {/* Section Header */}
        <div className="text-center mb-16 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5100]/10 border border-[#FF5100]/25 text-[#FF5100] rounded-full text-sm font-semibold">
            <Video className="w-4 h-4" />
            <span>سينما عيادة دومايا 🎬</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-white">
            معرض الفيديوهات ودراسات النجاح الطبية
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            شاهد نماذج الفيديوهات السينمائية لأطبائنا مباشرة من الصفحة. اضغط على أي فيديو لتشغيله واكتشاف الأرقام ودراسة الحالة بالتفصيل أدناه.
          </p>
        </div>

        {/* 3-Column Video Portrait Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12" dir="rtl">
          {reels.map((reel, index) => {
            const isSelected = index === activeReelIndex;
            const isCurrentlyPlaying = index === playingIndex;

            return (
              <motion.div
                key={reel.id}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => handleCardClick(index)}
                className={`group cursor-pointer relative aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 shadow-xl transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'border-[#FF5100] shadow-orange-500/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Video Element */}
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={reel.videoUrl || "/uploads/1782738053406_5.mp4"}
                  poster={reel.coverUrl}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isCurrentlyPlaying ? 'opacity-100' : 'opacity-80 group-hover:opacity-90'
                  }`}
                  loop
                  playsInline
                  muted={isMuted}
                />

                {/* Cover Image fallback if not playing */}
                {!isCurrentlyPlaying && reel.coverUrl && (
                  <img
                    src={reel.coverUrl}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-300" />

                {/* View Count Badge (Top Right) */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[10px] sm:text-xs font-bold">
                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                  <span>{reel.views} مشاهدة</span>
                </div>

                {/* Mute/Unmute Indicator (only visible when playing) */}
                {isCurrentlyPlaying && (
                  <button
                    onClick={toggleMute}
                    className="absolute top-4 left-4 z-20 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-orange-600 transition"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-orange-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Play/Pause Button Overlay (Center) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {!isCurrentlyPlaying ? (
                    <div className="w-14 h-14 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF5100] group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-orange-500/30">
                      <Play className="w-5 h-5 fill-current text-white ml-1" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Pause className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Specialty Tag */}
                <div className="absolute bottom-28 right-5 z-10 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
                  {reel.specialty}
                </div>

                {/* Card Title & Doctor */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end text-right text-white z-10 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {reel.title}
                  </h3>
                  <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-orange-400 border border-white/10">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{reel.doctorName}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Case Study Details Panel (Directly inline below the grid - Glassmorphic) */}
        <div className="max-w-6xl mx-auto" dir="rtl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActiveReel.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white"
            >
              {/* Premium color bar */}
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-[#FF5100]" />

              <div className="md:flex md:items-center md:justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-[#FF5100] border border-orange-500/25">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{currentActiveReel.doctorName}</h3>
                    <span className="text-xs font-bold text-slate-450 block mt-0.5">{currentActiveReel.specialty}</span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 bg-emerald-500/10 border border-emerald-500/20 py-2.5 px-4 rounded-xl flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-bold text-emerald-400">{currentActiveReel.result}</span>
                </div>
              </div>

              {/* Case Study Body Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4" />
                    <span>حالة العيادة والتحدي التسويقي:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                    {currentActiveReel.challenge}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>خطة الإنتاج وجودة المحتوى:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                    {currentActiveReel.treatment}
                  </p>
                </div>
              </div>

              {/* CTA Panel Row */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-400">هل ترغب في نتائج نمو مماثلة لعيادتك؟</h4>
                  <p className="text-xs font-semibold text-slate-300 mt-1">اضغط على الزر لحجز جلسة التصوير والاستشارة المجانية فوراً.</p>
                </div>
                
                <button
                  onClick={handleCTABooking}
                  className="w-full sm:w-auto px-6 py-3 bg-[#FF5100] hover:bg-orange-650 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-103"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تصوير ميديا مماثلة لعيادتي 📲</span>
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
