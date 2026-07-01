import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, User, TrendingUp, Sparkles, Stethoscope, CheckCircle2, Video, Eye, Volume2, VolumeX, Image, ChevronLeft, ChevronRight } from 'lucide-react';

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
  images?: string[];
  mediaType?: 'video' | 'images';
  challenge?: string;
  result?: string;
  treatment?: string;
}

const REELS_DATA: Reel[] = [
  {
    id: "reel_derma",
    specialty: "الجلدية والتجميل والليزر",
    doctorName: "د. هبة شرف الدين",
    title: "ليه البوتوكس مش مجرد رفاهية؟ الحقيقة الكاملة في دقيقة!",
    views: "245K",
    coverColor: "from-[#0F172A] to-[#1E293B]",
    length: 15,
    challenge: "صعوبة إقناع المرضى بجدوى البوتوكس العلاجي وتخوفهم من النتائج غير الطبيعية، وضعف الحجوزات المباشرة.",
    result: "ارتفاع نسبة الحجوزات المباشرة لعيادة الجلدية بمعدل 220% خلال شهر من إطلاق الفيديو.",
    treatment: "تصوير سينمائي مقرب يبرز ملامح الوجه الطبيعية مع مونتاج سريع يركز على شرح الفوائد الطبية بلغة مبسطة.",
    qualityPillars: [
      "إضاءة سينمائية ناعمة تبرز نضارة البشرة",
      "نص طبي متكامل يركز على الجانب العلاجي للبوتوكس",
      "تعديل ألوان يضفي طابع العيادات الفاخرة"
    ]
  },
  {
    id: "reel_dental",
    specialty: "طب وجراحة الفم والأسنان",
    doctorName: "د. أحمد رأفت",
    title: "من الخوف للابتسامة كاملة: رحلة زراعة الأسنان الرقمية في يوم واحد",
    views: "312K",
    coverColor: "from-slate-900 to-indigo-950",
    length: 18,
    challenge: "خوف المرضى الشديد من آلام الجراحة والزراعة التقليدية، وتشكيكهم في سرعة وجودة الزراعة الرقمية.",
    result: "زيادة طلبات الاستشارة الخاصة بالزراعة الرقمية بنسبة 300% وتضاعف الحجوزات الفعلية.",
    treatment: "توثيق تجربة حية لمريض حقيقي بلقطات قبل وبعد، مع إظهار سهولة وراحة التقنية الحديثة داخل العيادة.",
    qualityPillars: [
      "توثيق لقطات حية وتفاصيل دقيقة بوضوح تام",
      "استخدام مؤثرات بصرية لتوضيح مراحل الزراعة الرقمية",
      "إيقاع مونتاج حماسي يبني الثقة ويزيل رهبة الجراحة"
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

interface ReelsGalleryProps {
  lang?: 'ar' | 'en';
}

export default function ReelsGallery({ lang = 'ar' }: ReelsGalleryProps) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isEn = lang === 'en';

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = (direction === 'left' ? -320 : 320) * (isEn ? 1 : -1);
      scrollContainerRef.current.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    }
  };

  const prevImage = (e: React.MouseEvent, showcase: any) => {
    e.stopPropagation();
    const images = showcase.images || [];
    if (images.length === 0) return;
    const current = cardImageIndices[showcase.id] || 0;
    const nextIdx = (current - 1 + images.length) % images.length;
    setCardImageIndices(prev => ({ ...prev, [showcase.id]: nextIdx }));
  };

  const nextImage = (e: React.MouseEvent, showcase: any) => {
    e.stopPropagation();
    const images = showcase.images || [];
    if (images.length === 0) return;
    const current = cardImageIndices[showcase.id] || 0;
    const nextIdx = (current + 1) % images.length;
    setCardImageIndices(prev => ({ ...prev, [showcase.id]: nextIdx }));
  };

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch('/api/reels');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setReels(data);
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
      setPlayingIndex(null);
    } else {
      setPlayingIndex(index);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleCTABooking = () => {
    setShowToast(isEn ? "Redirecting to free consultation booking form..." : "جاري توجيهك لملء استمارة حجز جلسة التصوير المجانية...");
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

  const rawVideoReels = reels.filter(r => r.mediaType !== 'images');
  const rawImageReels = reels.filter(r => r.mediaType === 'images');

  const translateReel = (reel: Reel) => {
    if (!isEn) return reel;
    if (reel.id === 'reel_derma') {
      return {
        ...reel,
        specialty: "Dermatology & Aesthetic",
        doctorName: "Dr. Heba Sharaf El-Din",
        title: "Why Botox is not just a luxury? The complete truth in 60s!",
        challenge: "Difficulty in convincing patients of therapeutic Botox benefits and fear of unnatural results, leading to low booking conversion.",
        result: "220% increase in direct dermatology clinic bookings within a month of video launch.",
        treatment: "Close-up cinematic shoots showcasing natural aesthetics with fast-paced editing focused on medical explanations in simple terms.",
        qualityPillars: [
          "Soft cinematic lighting highlighting skin glow",
          "Comprehensive script targeting the medical side of Botox",
          "Color-grading matching high-end clinics aesthetics"
        ]
      };
    }
    if (reel.id === 'reel_dental') {
      return {
        ...reel,
        specialty: "Dental & Oral Surgery",
        doctorName: "Dr. Ahmed Raafat",
        title: "From fear to a complete smile: The 1-day digital dental implant journey",
        challenge: "Intense patient fear of surgical pain and skepticism towards the speed and quality of same-day digital implants.",
        result: "300% increase in digital implant consultations and doubling actual clinic bookings.",
        treatment: "Documenting a real patient's live experience before/after, emphasizing comfort and advanced digital tools.",
        qualityPillars: [
          "Capturing fine surgical details with total clarity",
          "Visual effects explaining digital implant steps",
          "Dynamic pacing to build trust and relieve anxiety"
        ]
      };
    }
    if (reel.id === 'reel_pedia') {
      return {
        ...reel,
        specialty: "Pediatrics & Neonatology",
        doctorName: "Dr. Adel El-Shazly",
        title: "First step if your child's fever spikes suddenly at night!",
        challenge: "Difficulty in explaining pediatric emergencies to mothers without causing panic, and building a trusted contact channel.",
        result: "180% increase in clinic reservation inquiries via automated chat funnel.",
        treatment: "Visual guides showing compress application, combined with comforting sound effects emphasizing the doctor's empathy.",
        qualityPillars: [
          "Calm sound effects comforting anxious parents",
          "Script simplifying child emergencies with medical reassurance",
          "Warm background shoot showcasing a welcoming child clinic"
        ]
      };
    }
    return {
      ...reel,
      doctorName: reel.doctorName.replace("د. ", "Dr. "),
      views: reel.views.replace("مشاهدة", "views").replace("ألف", "K")
    };
  };

  const videoReels = rawVideoReels.map(translateReel);
  const imageReels = rawImageReels.map(translateReel);

  if (reels.length === 0) return null;

  const currentActiveReel = videoReels[activeReelIndex] || videoReels[0] || null;

  return (
    <section className="py-24 bg-[#F0F4F8] dark:bg-slate-950 text-[#2C3E50] dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 relative z-10 transition-colors" id="reels-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-2xl z-[100] text-center"
            >
              {showToast}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`text-center mb-16 space-y-3 ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-sm font-semibold">
            <Video className="w-4 h-4" />
            <span>{isEn ? "DOMYA Clinic Cinema 🎬" : "سينما عيادة دوميا 🎬"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Cinematic Portfolio & Medical Case Studies" : "معرض الفيديوهات ودراسات النجاح الطبية"}
          </h2>
          <p className="text-[#2C3E50] dark:text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-semibold">
            {isEn 
              ? "Watch cinema-quality video samples from our doctors. Click any video to play, see case details, and view clinic growth numbers below."
              : "شاهد نماذج الفيديوهات السينمائية لأطبائنا مباشرة من الصفحة. اضغط على أي فيديو لتشغيله واكتشاف الأرقام ودراسة الحالة بالتفصيل أدناه."
            }
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto mb-12 px-2 sm:px-0 group/slider">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-slate-900/90 hover:bg-[#FF6B35] hover:text-white text-[#003D7A] dark:text-white p-2.5 sm:p-3.5 rounded-full shadow-lg border border-slate-200/40 dark:border-slate-800 flex items-center justify-center transition active:scale-90 cursor-pointer lg:opacity-0 lg:group-hover/slider:opacity-100 z-30"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-slate-900/90 hover:bg-[#FF6B35] hover:text-white text-[#003D7A] dark:text-white p-2.5 sm:p-3.5 rounded-full shadow-lg border border-slate-200/40 dark:border-slate-800 flex items-center justify-center transition active:scale-90 cursor-pointer lg:opacity-0 lg:group-hover/slider:opacity-100 z-30"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 sm:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory" 
            dir={isEn ? "ltr" : "rtl"}
          >
            {videoReels.map((reel, index) => {
              const isSelected = index === activeReelIndex;
              const isCurrentlyPlaying = index === playingIndex;

              return (
                <motion.div
                  key={reel.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => handleCardClick(index)}
                  className={`group cursor-pointer relative aspect-[9/16] w-[80vw] sm:w-auto shrink-0 snap-center rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-[#FF6B35] shadow-lg shadow-orange-500/35 scale-[1.02] z-10' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-[#FF6B35]/50'
                  }`}
                >
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={reel.videoUrl || "/uploads/1782738053406_5.mp4"}
                    poster={reel.coverUrl}
                    className={`absolute inset-0 w-full h-full object-contain bg-slate-950 transition-opacity duration-300 ${
                      isCurrentlyPlaying ? 'opacity-100' : 'opacity-80 group-hover:opacity-90'
                    }`}
                    loop
                    playsInline
                    muted={isMuted}
                  />

                  {!isCurrentlyPlaying && reel.coverUrl && (
                    <img
                      src={reel.coverUrl}
                      alt={reel.title}
                      className="absolute inset-0 w-full h-full object-contain bg-slate-950 transition-transform duration-700 group-hover:scale-102"
                      loading="lazy"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-300" />

                  <div className={`absolute top-4 ${isEn ? 'right-4' : 'right-4'} z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[10px] sm:text-xs font-bold`}>
                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                    <span>{reel.views} {isEn ? "views" : "مشاهدة"}</span>
                  </div>

                  {isCurrentlyPlaying && (
                    <button
                      onClick={toggleMute}
                      className={`absolute top-4 ${isEn ? 'left-4' : 'left-4'} z-20 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#FF6B35] transition`}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-orange-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center">
                    {!isCurrentlyPlaying ? (
                      <div className="w-14 h-14 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6B35] group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-orange-500/30">
                        <Play className={`w-5 h-5 fill-current text-white ${isEn ? 'ml-1' : 'mr-1'}`} />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Pause className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className={`absolute bottom-28 ${isEn ? 'left-5' : 'right-5'} z-10 px-2 py-0.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded`}>
                    {reel.specialty}
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end ${isEn ? 'text-left' : 'text-right'} text-white z-10 space-y-2`}>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {reel.title}
                    </h3>
                    <div className={`flex items-center gap-2 pt-1 border-t border-white/10 ${isEn ? 'justify-start' : 'justify-start'}`}>
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
        </div>

        {currentActiveReel && (
          <div className="max-w-6xl mx-auto mb-16" dir={isEn ? "ltr" : "rtl"}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentActiveReel.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md text-[#2C3E50] dark:text-slate-200 transition-colors"
              >
                <div className={`absolute top-0 ${isEn ? 'left-0' : 'right-0'} bottom-0 w-2 bg-[#FF6B35]`} />

                <div className={`md:flex md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800`}>
                  <div className={`flex items-center gap-4`}>
                    <div className="w-12 h-12 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] border border-orange-500/25">
                      <User className="w-6 h-6" />
                    </div>
                    <div className={isEn ? "text-left" : "text-right"}>
                      <h3 className="text-lg sm:text-xl font-bold text-[#003D7A] dark:text-white">{currentActiveReel.doctorName}</h3>
                      <span className="text-xs font-bold text-slate-400 block mt-0.5">{currentActiveReel.specialty}</span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 py-2.5 px-4 rounded-xl flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-bold text-[#FF6B35]">{currentActiveReel.result}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#FF6B35] flex items-center gap-1.5 font-sans">
                      <Stethoscope className="w-4 h-4" />
                      <span>{isEn ? "Clinic Profile & Marketing Challenge:" : "حالة العيادة والتحدي التسويقي:"}</span>
                    </h4>
                    <p className={`text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-semibold ${isEn ? 'text-left' : 'text-right'}`}>
                      {currentActiveReel.challenge}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 font-sans">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEn ? "Production Plan & Content Quality:" : "خطة الإنتاج وجودة المحتوى:"}</span>
                    </h4>
                    <p className={`text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-semibold ${isEn ? 'text-left' : 'text-right'}`}>
                      {currentActiveReel.treatment}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className={isEn ? "text-left" : "text-right"}>
                    <h4 className="text-xs font-bold text-[#003D7A] dark:text-white">
                      {isEn ? "Want similar growth results for your clinic?" : "هل ترغب في نتائج نمو مماثلة لعيادتك؟"}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {isEn ? "Click the button to book your free cinematic shoot and growth consultation now." : "اضغط على الزر لحجز جلسة التصوير والاستشارة المجانية فوراً."}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleCTABooking}
                    className="w-full sm:w-auto px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-103 shine-effect"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEn ? "Produce Similar Media for My Clinic 📲" : "تصوير ميديا مماثلة لعيادتي 📲"}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {imageReels.length > 0 && (
          <div className="mt-24 border-t border-slate-200/60 dark:border-slate-800/80 pt-20">
            <div className={`text-center mb-16 space-y-3 ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-sm font-semibold">
                <Image className="w-4 h-4" />
                <span>{isEn ? "Visual Identity & Photo Shoots Album 📸" : "ألبوم الهوية البصرية وجلسات التصوير 📸"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
                {isEn ? "Clinic Photo Shoots & Design Showcase" : "معرض الجلسات الفوتوغرافية وتصميم العيادات"}
              </h2>
              <p className="text-[#2C3E50] dark:text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-semibold">
                {isEn 
                  ? "Browse physician photo shoots, visual branding, and luxury clinic designs built by DOMYA."
                  : "تصفح صور جلسات تصوير الأطباء، وتصميمات الهويات البصرية للعيادات التي قمنا بإنشائها."
                }
              </p>
            </div>

            <div 
              className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12 px-4 pb-4 sm:px-0 sm:pb-0 scrollbar-thin scroll-smooth snap-x snap-mandatory" 
              dir={isEn ? "ltr" : "rtl"}
            >
              {imageReels.map((showcase) => {
                const activeImgIdx = cardImageIndices[showcase.id] || 0;
                const images = showcase.images || [];
                return (
                  <div 
                    key={showcase.id} 
                    className="group relative aspect-[9/16] w-[80vw] sm:w-auto shrink-0 snap-center rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 hover:border-[#FF6B35]/40"
                  >
                    <div className="absolute inset-0 w-full h-full bg-slate-950">
                      {images.length > 0 ? (
                        <img
                          src={images[activeImgIdx]}
                          alt={`${showcase.title} - ${activeImgIdx}`}
                          className="w-full h-full object-contain bg-slate-950 transition-opacity duration-300 opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-xs">
                          {isEn ? "No uploaded images." : "لا يوجد صور مرفوعة."}
                        </div>
                      )}

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => prevImage(e, showcase)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#FF6B35] text-white flex items-center justify-center border border-white/10 transition z-20 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => nextImage(e, showcase)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#FF6B35] text-white flex items-center justify-center border border-white/10 transition z-20 cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            {images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                  activeImgIdx === idx ? 'bg-[#FF6B35] w-3' : 'bg-white/40'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none transition-opacity duration-300" />

                    <div className={`absolute top-4 ${isEn ? 'right-4' : 'right-4'} z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white text-[10px] sm:text-xs font-bold`}>
                      <Image className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>{images.length} {isEn ? "photos" : "صور"}</span>
                    </div>

                    <button
                      onClick={handleCTABooking}
                      className={`absolute top-4 ${isEn ? 'left-4' : 'left-4'} z-25 bg-[#FF6B35] hover:bg-[#E55A2B] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-[#FF6B35]/20 cursor-pointer transition opacity-0 group-hover:opacity-100`}
                    >
                      {isEn ? "Book Shoot 📲" : "احجز جلسة 📲"}
                    </button>

                    {/* Specialty Tag */}
                    <div className={`absolute bottom-24 ${isEn ? 'left-5' : 'right-5'} z-10 px-2 py-0.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded`}>
                      {showcase.specialty}
                    </div>

                    {/* Card Title & Doctor */}
                    <div className={`absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end ${isEn ? 'text-left' : 'text-right'} text-white z-10 space-y-2`}>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {showcase.title}
                      </h3>
                      <div className={`flex items-center gap-2 pt-1 border-t border-white/10 ${isEn ? 'justify-start' : 'justify-start'}`}>
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#FF6B35] border border-white/10">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-semibold text-slate-350">{showcase.doctorName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
