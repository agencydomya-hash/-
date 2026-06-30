/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Video, User, X, Send, Check } from 'lucide-react';

interface Reel {
  id: string;
  specialty: string;
  doctorName: string;
  title: string;
  views: string;
  coverColor: string;
  length: number; // in seconds
  qualityPillars: string[];
  subtitles: { time: number; text: string }[];
  videoUrl?: string;
  coverUrl?: string;
}

const REELS_DATA: Reel[] = [
  {
    id: "reel_ortho",
    specialty: "جراحة العظام والمفاصل 🦴",
    doctorName: "د. هاني الرفاعي",
    title: "خرافة طقطقة الرقبة.. هل بتسبب خشونة فعلاً؟",
    views: "124K",
    coverColor: "from-[#1E3A8A] to-[#3B82F6]",
    length: 12,
    qualityPillars: [
      "ميكروفون لاسلكي ذو عزل فائق لتنقية ترددات الصوت",
      "تصوير بكاميرا سوني السينمائية مع عمق عزل فخم خلف الطبيب",
      "مؤثرات بصرية وصور حية للمفاصل تظهر عند ذكرها"
    ],
    subtitles: [
      { time: 0, text: "طقطقة الرقبة والظهر.. حركة بنعملها كلنا لما نحس بضغط..." },
      { time: 3, text: "بس هل الحركة دي ممكن تدمر مفاصلك وتجيب لك خشونة مبكرة؟" },
      { time: 6, text: "العلم بيقول: دي مجرد فقاعات غاز بتنفجر في السائل الزلالي!" },
      { time: 9, text: "بس لو تكررت بألم، هنا الخطر الحقيقي ولازم فحص فوري عيادتنا." }
    ]
  },
  {
    id: "reel_derma",
    specialty: "الجلدية والتجميل والليزر 🌸",
    doctorName: "د. ياسمين شاهين",
    title: "الترتيب الصح لمنتجات العناية بالبشرة بالليل!",
    views: "310K",
    coverColor: "from-[#9D174D] to-[#F472B6]",
    length: 15,
    qualityPillars: [
      "إضاءة استوديو ناعمة دائرية تبرز صفاء البشرة بشكل طبيعي",
      "مونتاج ديناميكي سريع الحركة يمنع المشاهد من التمرير",
      "لوحة ألوان دافئة مريحة تعكس الفخامة والاهتمام بالجمال"
    ],
    subtitles: [
      { time: 0, text: "بتحطي السيروم قبل الكريم ولا الكريم الأول؟ 🤔" },
      { time: 3, text: "الترتيب الغلط للمنتجات بيضيع تأثيرها وفلوسك في الأرض!" },
      { time: 6, text: "القاعدة الذهبية: بنبدأ من الأخف وزناً زي التونر والسيروم..." },
      { time: 9, text: "ثم بنقفل بالمرطب التقيل لحبس الفوائد داخل خلايا الجلد." },
      { time: 12, text: "احفظي الفيديو ده عندك وشاركيه مع صاحبتك المهتمة بالبشرة!" }
    ]
  },
  {
    id: "reel_pedia",
    specialty: "طب الأطفال وحديثي الولادة 👶",
    doctorName: "د. عادل الشاذلي",
    title: "أول خطوة لو حرارة طفلك ارتفعت فجأة بالليل!",
    views: "185K",
    coverColor: "from-[#065F46] to-[#34D399]",
    length: 13,
    qualityPillars: [
      "مؤثرات صوتية هادئة مريحة للأمهات والآباء القلقين",
      "سيناريو يبسط طوارئ الأطفال بطمأنينة علمية فائقة",
      "تصوير خلفية دافئة مريحة لعيادة أطفال مبهجة"
    ],
    subtitles: [
      { time: 0, text: "لو حرارة طفلك ارتفعت بالليل.. أرجوكِ بلاش ذعر!" },
      { time: 3, text: "أول وأهم خطوة مش خافض الحرارة، بل الكمادات بمياه الحنفية..." },
      { time: 6, text: "بنحطها على الفخذين وتحت الإبطين، مش على الجبهة!" },
      { time: 9, text: "لأن دي المناطق اللي بيمر فيها الدم وبيرجع بارد للجسم." },
      { time: 11, text: "لو الحرارة مستمرة، كلمينا فوراً وسجلي زيارة للعيادة للاطمئنان." }
    ]
  }
];

export default function ReelsGallery() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [dmActivated, setDmActivated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, selectedReel]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch('/api/reels');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setReels(data);
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

  const startReelPlayer = (reel: Reel) => {
    setSelectedReel(reel);
    setIsPlaying(true);
    setDmActivated(false);
  };

  const closePlayer = () => {
    setSelectedReel(null);
    setIsPlaying(false);
    setDmActivated(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCTABookingFromDM = () => {
    closePlayer();
    setShowToast("جاري توجيهك لملء استمارة تأمين الاستشارة المجانية... 📲");
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

  return (
    <section className="py-20 bg-slate-50 text-slate-800 overflow-hidden border-b border-slate-200" id="media-gallery">
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
            <span>معرض سينما دومايا الطبية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#091B65]">
            شاهد جودة الميديا بروداكشن الطبي بنفسك 🎥
          </h2>
          <p className="text-slate-650 max-w-2xl mx-auto text-xs sm:text-sm">
            اضغط على أي فيديو لتشغيل العرض السينمائي التفاعلي المتميز. نذهب لعيادتك وننتج محتوى بنفس الفخامة والسينمائية لجذب المرضى.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-orange-500/30 shadow-lg hover:shadow-xl hover:shadow-slate-200/50 transition duration-300 flex flex-col justify-between"
            >
              {/* Cover Card with play overlay */}
              <div 
                onClick={() => startReelPlayer(reel)}
                className="h-64 p-6 relative flex flex-col justify-between cursor-pointer group overflow-hidden rounded-t-2xl"
              >
                <img 
                  src={reel.coverUrl || "/uploads/1782738201126_473188690_598630842913487_4523441016009157157_n.jpg"} 
                  className="absolute inset-0 w-full h-full object-cover z-0 transition duration-500 group-hover:scale-105" 
                  alt={reel.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 z-1" />

                {/* Play icon overlay */}
                <div className="flex justify-end items-center z-10">
                  <div className="w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 text-white group-hover:bg-[#FF5100] transition duration-300">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Cover details */}
                <div className="text-center space-y-2 py-4 z-10">
                  <div className="text-white/80 font-mono text-xs">{reel.specialty}</div>
                  <h3 className="text-lg font-bold text-white drop-shadow">{reel.title}</h3>
                </div>

                {/* Doctor details */}
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/10 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-xs border border-white/20">
                    <User className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-right text-white">
                    <div className="text-xs font-bold">{reel.doctorName}</div>
                    <div className="text-[9px] text-gray-250">ميديا معتمد من دومايا</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                <button
                  onClick={() => startReelPlayer(reel)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-[#FF5100] hover:text-white rounded-xl text-xs font-bold text-slate-700 hover:shadow transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>شاهد الفيديو السينمائي 🎥</span>
                  <Play className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. PREMIUM FULLSCREEN INSTAGRAM LIGHTBOX DISPLAY */}
        <AnimatePresence>
          {selectedReel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[80] flex items-center justify-center p-4 sm:p-6"
              onClick={closePlayer}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="max-w-4xl w-full bg-slate-900 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[600px]"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
              >
                {/* Right Side: Video Player Panel */}
                <div className="w-full md:w-[360px] bg-black relative flex items-center justify-center flex-shrink-0 h-[50%] md:h-full">
                  <video
                    ref={videoRef}
                    src={selectedReel.videoUrl || "/uploads/1782738053406_5.mp4"}
                    poster={selectedReel.coverUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay={isPlaying}
                    loop
                    muted={false}
                    playsInline
                  />

                  {/* Play Overlay toggle control */}
                  <div 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                  >
                    {!isPlaying && (
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition hover:scale-105 active:scale-95">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Close button on mobile video top corner */}
                  <button
                    onClick={closePlayer}
                    className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 md:hidden transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Left Side: Details & Interactive Automator Panel */}
                <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between text-right text-white h-[50%] md:h-full bg-slate-900 border-r border-white/5 overflow-y-auto">
                  
                  {/* Close button for desktop */}
                  <div className="hidden md:flex justify-end mb-2">
                    <button
                      onClick={closePlayer}
                      className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Header Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#FF5100] flex items-center justify-center text-xs font-bold text-white shadow-md">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-none">{selectedReel.doctorName}</h4>
                        <span className="text-[10px] text-orange-400 mt-0.5 block">{selectedReel.specialty}</span>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-150 leading-snug">{selectedReel.title}</h3>
                  </div>

                  {/* Interactive ManyChat Simulation */}
                  <div className="my-5 flex-grow border border-white/10 rounded-2xl bg-slate-950/45 p-4 flex flex-col justify-between min-h-[160px] text-xs">
                    
                    {!dmActivated ? (
                      /* Step 1: Simulated Reel View Prompt */
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-3 p-4">
                        <p className="text-gray-350 leading-relaxed text-xs">
                          تيم وكالة دومايا يربط هذا الفيديو بنظام رد آلي ذكي (Comment-to-DM). 
                          اكتب تعليقًا لمحاكاة وصول الرسالة التلقائية فورا دكتور!
                        </p>
                        <button
                          onClick={() => setDmActivated(true)}
                          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-orange-400" />
                          <span>كتابة تعليق تلقائي "روشتة" 💬</span>
                        </button>
                      </div>
                    ) : (
                      /* Step 2: Automated Chat preview stream */
                      <div className="space-y-3 flex flex-col justify-start overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-white/5 pb-1">
                          <span className="text-[9px] text-[#FF5100] font-bold">ManyChat Autoresponder 📬</span>
                          <span className="text-[9px] text-emerald-500 font-medium">مراسلة فورية نشطة</span>
                        </div>

                        {/* User comment */}
                        <div className="self-end max-w-[85%] bg-[#FF5100] p-2.5 rounded-2xl rounded-tr-none text-right">
                          <span className="text-[8px] text-orange-100 block font-bold mb-0.5">تعليقك على فيديو Reels:</span>
                          <p className="text-[10px] text-white font-semibold">"روشتة"</p>
                        </div>

                        {/* Automated reply */}
                        <div className="self-start max-w-[90%] bg-white/5 border border-white/10 p-2.5 rounded-2xl rounded-tl-none space-y-1">
                          <span className="text-[8px] text-orange-400 font-bold block">مساعد العيادة الآلي (دومايا):</span>
                          <p className="text-[10px] text-gray-200 leading-relaxed font-semibold">
                            أهلاً بك دكتور! صمم هذا النظام ليجلب للعيادة عشرات المرضى يومياً بتفعيل العرض الحصري المبرمج آلياً بخصم 30%.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Booking Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleCTABookingFromDM}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-[#FF5100] hover:from-orange-600 hover:to-[#D94400] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>حجز جلسة تسويق وتصوير مجانية لعيادتي 📲</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
