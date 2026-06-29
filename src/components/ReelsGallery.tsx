/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Volume2, Video, Award, Star, Sparkles, User, Heart, MessageCircle, Share2, Send, ArrowRight, Check, Bell } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const [likes, setLikes] = useState<{ [key: string]: number }>({
    reel_ortho: 8521,
    reel_derma: 12430,
    reel_pedia: 9612,
  });
  const [hasLiked, setHasLiked] = useState<{ [key: string]: boolean }>({});
  const [activeSimulatorView, setActiveSimulatorView] = useState<'reels' | 'dm'>('reels');
  const [receivedDM, setReceivedDM] = useState<{ show: boolean; text: string; sender: string; userComment: string } | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const getLikesCount = (reelId: string) => {
    if (likes[reelId] !== undefined) {
      return likes[reelId];
    }
    const hash = reelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 800) + 1200;
  };

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch('/api/reels');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setReels(data);
            setSelectedReel(data[0]);
          }
        } else {
          setReels(REELS_DATA);
          setSelectedReel(REELS_DATA[0]);
        }
      } catch (err) {
        setReels(REELS_DATA);
        setSelectedReel(REELS_DATA[0]);
      }
    };
    fetchReels();
  }, []);

  const startReelPlayer = (reel: Reel) => {
    setSelectedReel(reel);
    setIsPlaying(true);
    setCurrentTime(0);
    setReceivedDM(null);
    setActiveSimulatorView('reels');
  };

  useEffect(() => {
    if (isPlaying && selectedReel && activeSimulatorView === 'reels') {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedReel.length) {
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, selectedReel, activeSimulatorView]);

  useEffect(() => {
    if (selectedReel) {
      const match = selectedReel.subtitles
        .slice()
        .reverse()
        .find(sub => currentTime >= sub.time);
      setActiveSubtitle(match ? match.text : "");
    }
  }, [currentTime, selectedReel]);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleCTABookingFromDM = () => {
    setShowToast("جاري توجيهك لملء استمارة تأمين الاستشارة المجانية... 📲");
    setTimeout(() => {
      const bookingSection = document.getElementById("booking-section");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);
  };



  return (
    <section className="py-20 bg-slate-50 text-slate-800 overflow-hidden border-b border-slate-200" id="media-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 text-[#FF5100] rounded-full text-sm font-semibold">
            <Video className="w-4 h-4" />
            <span>معرض سينما دومايا الطبية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#091B65]">
            شاهد جودة الميديا بروداكشن الطبي بنفسك 🎥
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm">
            اضغط على أي فيديو لتشغيل "محاكي الفيديوهات الطبية" التفاعلي. بنروح لعيادتك وننتج محتوى بنفس الفخامة والسينمائية دي لتثبيت سلطتك العلمية.
          </p>
        </div>

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
                {/* Real cover image instead of gradient */}
                <img 
                  src={reel.coverUrl || "/uploads/1782738201126_473188690_598630842913487_4523441016009157157_n.jpg"} 
                  className="absolute inset-0 w-full h-full object-cover z-0 transition duration-500 group-hover:scale-105" 
                  alt={reel.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 z-1" />

                {/* View Badge */}
                <div className="flex justify-between items-center z-10">
                  <span className="px-2.5 py-1 bg-black/45 backdrop-blur-sm rounded-full text-[10px] font-bold text-orange-200">
                    {reel.views} مشاهدة 👁️
                  </span>
                  <div className="w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 text-white group-hover:bg-[#FF5100] transition duration-300">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Cover graphic details */}
                <div className="text-center space-y-2 py-4 z-10">
                  <div className="text-white/80 font-mono text-xs">{reel.specialty}</div>
                  <h3 className="text-lg font-bold text-white drop-shadow">{reel.title}</h3>
                </div>

                {/* Doctor details banner */}
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

              {/* Quality pillars summary */}
              <div className="p-5 space-y-3 bg-slate-50 border-t border-slate-100 text-right">
                <span className="text-[10px] text-orange-600 font-bold block">ميزات الإنتاج في هذا الفيديو:</span>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-semibold">{reel.qualityPillars[0]}</p>
                <button
                  onClick={() => startReelPlayer(reel)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-bold text-slate-700 hover:shadow transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>شغل محاكي التشغيل التفاعلي</span>
                  <Play className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. Active Simulated Media Player Display */}
        <AnimatePresence>
          {selectedReel && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-16 bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8"
              dir="rtl"
              id="reels-simulator-player"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Simulated Smartphone Screen with dynamic subtitles */}
                <div className="lg:col-span-5 flex justify-center relative">
                  
                  {/* Toast Alert Inside Phone */}
                  <AnimatePresence>
                    {showToast && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-14 left-1/2 -translate-x-1/2 bg-orange-600 border border-orange-400/30 text-white font-bold text-[10px] px-3.5 py-2 rounded-full shadow-lg z-50 text-center w-[85%] whitespace-normal"
                      >
                        {showToast}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="w-64 h-[440px] bg-black rounded-[36px] border-8 border-gray-800 relative shadow-2xl overflow-hidden flex flex-col justify-between p-4 text-white">
                    {/* Speaker camera notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-full flex items-center justify-center z-25">
                      <div className="w-2.5 h-2.5 rounded-full bg-black mr-2"></div>
                      <div className="w-8 h-1 bg-gray-900 rounded-full"></div>
                    </div>

                    {/* Top status bar */}
                    <div className="flex justify-between items-center pt-2 text-[10px] text-gray-400 px-2 z-20 font-mono">
                      <span>9:41 📱</span>
                      <div className="flex gap-1 items-center">
                        <Volume2 className="w-3 h-3" />
                        <span>5G</span>
                      </div>
                    </div>

                    {/* Instagram/ManyChat Push Notification PopUp */}
                    <AnimatePresence>
                      {receivedDM && receivedDM.show && activeSimulatorView === 'reels' && (
                        <motion.div
                          initial={{ opacity: 0, y: -80 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -80 }}
                          onClick={() => {
                            setActiveSimulatorView('dm');
                            setReceivedDM(prev => prev ? { ...prev, show: false } : null);
                          }}
                          className="absolute top-12 left-2 right-2 bg-slate-900/95 border border-white/10 p-2.5 rounded-2xl shadow-2xl z-40 cursor-pointer hover:bg-slate-850 active:scale-98 transition flex items-start gap-2.5 text-right text-xs"
                          dir="rtl"
                        >
                          <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                            <Bell className="w-4 h-4 animate-bounce" />
                          </div>
                          <div className="flex-grow space-y-0.5">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-orange-400">رسالة تلقائية (ManyChat) 📬</span>
                              <span className="text-gray-400 font-mono">الآن</span>
                            </div>
                            <p className="font-semibold text-gray-100 text-[10px] leading-relaxed line-clamp-2">
                              {receivedDM.sender}: أهلاً بك! لقد علقت بـ "{receivedDM.userComment}". اضغط لرؤية العرض والروشتة المرسلة لك! 📨
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {activeSimulatorView === 'reels' ? (
                      /* VIEW 1: REELS SIMULATOR STREAM */
                      <>
                        {/* Dynamic Background or Video/Image */}
                        <video
                          ref={videoRef}
                          src={selectedReel?.videoUrl || "/uploads/1782738053406_5.mp4"}
                          poster={selectedReel?.coverUrl || "/uploads/1782738201126_473188690_598630842913487_4523441016009157157_n.jpg"}
                          className="absolute inset-0 w-full h-full object-cover z-0"
                          autoPlay={isPlaying}
                          loop
                          muted={false}
                          playsInline
                          style={{ filter: isPlaying ? 'none' : 'brightness(0.85)' }}
                        />

                        {/* Centered clean Play button overlay if paused */}
                        <div 
                          onClick={togglePlay}
                          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer w-full h-full"
                        >
                          {!isPlaying && (
                            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition transform hover:scale-105 active:scale-95">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          )}
                        </div>

                        {/* Clean overlay bottom details */}
                        <div className="z-10 space-y-2 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 rounded-b-3xl">
                          {/* Doctor details tag */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-right">
                              <div className="w-6 h-6 rounded-full bg-[#FF5100] flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div className="text-white text-right">
                                <div className="text-[10px] font-bold leading-tight">{selectedReel.doctorName}</div>
                                <div className="text-[8px] text-gray-300">{selectedReel.specialty}</div>
                              </div>
                            </div>

                            {/* Clean trigger automator button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReceivedDM({
                                  show: true,
                                  sender: selectedReel.doctorName,
                                  userComment: "روشتة",
                                  text: `أهلاً بك دكتور! نورت العيادة 🏥. تيم وكالة دومايا صمم هذا النظام التلقائي ليرسل لك العروض والروشتات فوراً.`
                                });
                                setActiveSimulatorView('dm');
                                setIsPlaying(false);
                              }}
                              className="px-2.5 py-1 bg-[#FF5100] hover:bg-orange-600 text-white rounded-lg text-[8px] font-bold transition flex items-center gap-1 shadow-md shadow-orange-500/20 cursor-pointer"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>مراسلة تلقائية 📲</span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* VIEW 2: SIMULATED INSTAGRAM DM AUTO-CHAT */
                      <div className="absolute inset-0 bg-slate-50 border-r border-l border-slate-200 flex flex-col justify-between pt-12 z-30 text-right">
                        {/* DM Header */}
                        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FF5100] flex items-center justify-center font-bold text-xs text-white">
                              {selectedReel.doctorName[3] || 'D'}
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-800">{selectedReel.doctorName}</h4>
                              <div className="text-[8px] text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-ping"></span>
                                <span>رد تلقائي نشط ✓</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveSimulatorView('reels');
                              setIsPlaying(true);
                            }}
                            className="text-xs text-slate-500 hover:text-[#091B65] flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <span>رجوع</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* DM Messages stream */}
                        <div className="flex-grow p-3 overflow-y-auto space-y-3.5 flex flex-col justify-start">
                          
                          {/* User comment message bubble */}
                          <div className="self-end max-w-[85%] bg-[#FF5100] p-2.5 rounded-2xl rounded-tr-none text-right shadow-sm">
                            <span className="text-[8px] text-orange-100 block font-bold mb-0.5">لقد علقت على فيديو Reels:</span>
                            <p className="text-[10px] text-white font-semibold leading-relaxed">
                              "{receivedDM?.userComment || "روشتة"}"
                            </p>
                          </div>

                          {/* Doctor Automated Reply 1 */}
                          <div className="self-start max-w-[90%] bg-slate-200/50 p-2.5 rounded-2xl rounded-tl-none border border-slate-200 space-y-1 shadow-sm">
                            <span className="text-[8px] text-[#091B65] font-bold block">مساعد {selectedReel.doctorName} الآلي:</span>
                            <p className="text-[10px] text-slate-700 leading-relaxed font-semibold">
                              أهلاً بك دكتور! نورت بروفايل العيادة 🏥.
                            </p>
                            <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                              تيم وكالة دومايا للدعاية الطبية صمم هذا الفيديو ليجلب لي عشرات المرضى يومياً بنظام ManyChat التلقائي.
                            </p>
                          </div>

                          {/* Doctor Automated Reply 2 with Offer */}
                          <div className="self-start max-w-[90%] bg-slate-200/50 p-2.5 rounded-2xl rounded-tl-none border border-slate-200 space-y-2 shadow-sm">
                            <span className="text-[8px] text-[#FF5100] font-bold block">العرض والروشتة الحصرية 🎁:</span>
                            <p className="text-[10px] text-slate-850 leading-relaxed font-bold">
                              خصم خاص 30% على أول باقة تصوير سينمائي ومونتاج طبي شامل لعيادتك هذا الشهر!
                            </p>
                            <ul className="text-[9px] text-slate-600 space-y-1 pr-1 border-r border-orange-500/30">
                              <li>🎥 تصوير 4K بأحدث كاميرات السينما.</li>
                              <li>🎙️ عزل صوت وفلاتر استوديو.</li>
                              <li>✍️ كتابة محتوى طبي بالعامية الدارحة.</li>
                            </ul>
                          </div>

                          {/* CTA Button Inside Chat */}
                          <div className="self-center w-full pt-1">
                            <button
                              onClick={handleCTABookingFromDM}
                              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-[#FF5100] hover:from-orange-600 hover:to-[#D94400] text-white font-bold rounded-xl text-[10px] shadow-lg animate-pulse flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>تأكيد حجز الاستشارة المجانية مجاناً 📲</span>
                            </button>
                          </div>

                        </div>

                        {/* Input bar of DM Chat (readonly) */}
                        <div className="p-2 border-t border-slate-250 bg-white text-center text-[9px] text-slate-500 font-bold">
                          تم توليد هذه الرسائل آلياً لتوضيح قمع تسويق دومايا 🤖
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Quality pillars and controls */}
                <div className="lg:col-span-7 space-y-6 text-right font-sans text-slate-850">
                  <div>
                    <span className="text-xs text-[#FF5100] font-bold uppercase tracking-wider font-mono block">التحليل الفني للإنتاج والربط</span>
                    <h3 className="text-2xl font-bold text-[#091B65] mt-1">كيف تصنع دومايا فيديوهات بهذا التميز؟ 🎞️</h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      الفيديو الذي تشاهده ليس مجرد كلام عشوائي، بل تم تصميمه بعناية فائقة وتتبع لمعايير الإنتاج العالمية، مع دمج **نظام الأتمتة المباشرة (Comment-to-DM Autoresponder)** لتحويل التعليقات لحجوزات حقيقية في ثوانٍ.
                    </p>
                  </div>

                  {/* Quality Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedReel.qualityPillars.map((pillar, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex gap-3 text-right">
                        <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-650 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border border-orange-200">
                          {index + 1}
                        </div>
                        <p className="text-xs text-slate-700 font-semibold leading-relaxed">{pillar}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progressive trackbar and Player control buttons */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                      <span>المدة: 0:{selectedReel.length}</span>
                      <span>جاري المحاكاة: 0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                    </div>

                    {/* Custom progress slider */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-[#FF5100] transition-all duration-300"
                        style={{ width: `${(currentTime / selectedReel.length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Controller bar */}
                    <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={togglePlay}
                          disabled={activeSimulatorView === 'dm'}
                          className="px-4 py-2 bg-[#FF5100] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? "إيقاف مؤقت" : "تشغيل المحاكي"}</span>
                        </button>

                        <button
                          onClick={handleReset}
                          disabled={activeSimulatorView === 'dm'}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>إعادة التشغيل</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#FF5100]" />
                        <span>تقييم الدقة التسويقية: 10/10 الأقوى</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
