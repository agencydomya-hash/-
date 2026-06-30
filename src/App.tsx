
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Lock, Menu, X, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, Globe, ArrowUp } from 'lucide-react';
import { DiagnosisOutput } from './types';

// Component Imports
import Logo from './components/Logo';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import DiagnosisTool from './components/DiagnosisTool';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Journey from './components/Journey';
import ReelsGallery from './components/ReelsGallery';
import FAQs from './components/FAQs';
import BookingForm from './components/BookingForm';
import AdminPortal from './components/AdminPortal';
import PartnersTicker from './components/PartnersTicker';
import Footer from './components/Footer';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAdmin, setShowAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('domya_admin_auth') === 'true';
  });
  const [completedDiagnosis, setCompletedDiagnosis] = useState<DiagnosisOutput | null>(() => {
    const saved = localStorage.getItem('domya_doctor_diagnosis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return null;
      }
    }
    return null;
  });

  // Scroll-to-top visibility + reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollY > 600);
      setScrollProgress(docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('google_auth_success') === 'true') {
      sessionStorage.setItem('domya_admin_auth', 'true');
      setShowAdmin(true);
      // Clean up URL search query parameters without reloading
      const cleanUrl = window.location.pathname + (urlParams.get('tab') ? `?tab=${urlParams.get('tab')}` : '');
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // References to scroll targets
  const diagnosisRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const whyChooseUsRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const reelsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const handleStartDiagnosis = () => {
    scrollTo(diagnosisRef);
  };

  const handleBookConsultation = () => {
    scrollTo(bookingRef);
  };

  const handleDiagnosisComplete = (diagnosis: DiagnosisOutput) => {
    setCompletedDiagnosis(diagnosis);
    if (diagnosis) {
      localStorage.setItem('domya_doctor_diagnosis', JSON.stringify(diagnosis));
    } else {
      localStorage.removeItem('domya_doctor_diagnosis');
    }
  };

  const handleSelectBookingWithDiagnosis = (diagnosis: DiagnosisOutput) => {
    setCompletedDiagnosis(diagnosis);
    if (diagnosis) {
      localStorage.setItem('domya_doctor_diagnosis', JSON.stringify(diagnosis));
    }
    setTimeout(() => {
      scrollTo(bookingRef);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-[#2C3E50] overflow-x-hidden relative">
      
      {/* Floating Ambient Brand Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FF6B35]/4 aurora-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#003D7A]/6 aurora-blob-2" />
        <div className="absolute top-[40%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[#FF6B35]/2 aurora-blob" />
      </div>

      {/* Premium Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#003D7A] border-b border-[#002A57] shadow-lg relative z-50" id="main-header">
        {/* Reading Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B35] to-orange-400 transition-all duration-100 origin-left"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Right side: Brand Logo */}
            <Logo light={true} />

            {/* Middle Nav Links */}
            <nav className="hidden xl:flex items-center gap-6">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                الرئيسية
              </button>
              <button 
                onClick={() => { scrollTo(servicesRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                الخدمات
              </button>
              <button 
                onClick={() => { scrollTo(whyChooseUsRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                لماذا نحن؟
              </button>
              <button 
                onClick={() => { scrollTo(journeyRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                رحلة النجاح
              </button>
              <button 
                onClick={() => { scrollTo(reelsRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                معرض الأعمال
              </button>
              <button 
                onClick={() => { scrollTo(faqsRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                الأسئلة الشائعة
              </button>
              <button 
                onClick={() => { scrollTo(bookingRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                تواصل معنا
              </button>
            </nav>

            {/* Left side: CTA action buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher Badge */}
              <div className="flex items-center gap-1.5 bg-[#002A57]/60 border border-[#001F3F]/40 px-3 py-1.5 rounded-xl text-[10px] text-white select-none">
                <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span className="font-bold text-white">AR</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition">EN</span>
              </div>

              <button
                onClick={handleStartDiagnosis}
                className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition duration-300 text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/15 cursor-pointer"
                id="header-cta-diagnosis"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>افحص حضورك الفوري</span>
              </button>

              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`px-4 py-2.5 rounded-xl border font-bold transition text-xs flex items-center gap-1.5 cursor-pointer ${
                  showAdmin 
                    ? 'bg-[#FF6B35] text-white border-[#FF6B35]' 
                    : 'bg-transparent text-white border-white/20 hover:bg-white/10'
                }`}
                id="header-cta-admin"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>بوابة المبيعات</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="p-2 rounded-lg bg-[#002A57] border border-[#001F3F] text-white hover:bg-[#002A57]/80 transition"
                aria-label="Admin Portal"
              >
                <Lock className="w-4 h-4 text-[#FF6B35]" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-[#002A57] border border-[#001F3F] text-white hover:bg-[#002A57]/80 transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl"
              id="mobile-navigation-panel"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col items-stretch">
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  الرئيسية
                </button>
                <button
                  onClick={() => { scrollTo(servicesRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  الخدمات
                </button>
                <button
                  onClick={() => { scrollTo(whyChooseUsRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  لماذا يختارنا الأطباء؟
                </button>
                <button
                  onClick={() => { scrollTo(journeyRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  رحلة النجاح
                </button>
                <button
                  onClick={() => { scrollTo(reelsRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  معرض الأعمال
                </button>
                <button
                  onClick={() => { scrollTo(faqsRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  الأسئلة الشائعة
                </button>
                <button
                  onClick={() => { scrollTo(bookingRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 text-right cursor-pointer"
                >
                  تواصل معنا
                </button>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => { scrollTo(diagnosisRef); setMobileMenuOpen(false); }}
                    className="w-full py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-center text-sm cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    التشخيص الذكي الفوري
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Landing Content */}
      <main>
        
        {/* 1. Hero / Main presentation banner */}
        <Hero 
          onStartDiagnosis={handleStartDiagnosis} 
          onBookConsultation={handleBookConsultation} 
        />

        {/* Statistics Section */}
        <Statistics />



        {/* 2. Admin Portal CRM Dashboard (Conditional View) */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <AdminPortal />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Branding Symptoms check and Solutions grid */}
        <div ref={servicesRef}>
          <Services />
        </div>

        {/* Why Choose Us Section */}
        <div ref={whyChooseUsRef}>
          <WhyChooseUs />
        </div>

        {/* Journey Section */}
        <div ref={journeyRef}>
          <Journey />
        </div>

        {/* 4. Interactive AI Branding Diagnosis Tool */}
        <div ref={diagnosisRef}>
          <DiagnosisTool 
            onDiagnosisComplete={handleDiagnosisComplete} 
            onSelectBookingWithDiagnosis={handleSelectBookingWithDiagnosis} 
          />
        </div>

        {/* 5. Doctors cinematic Reels multimedia section */}
        <div ref={reelsRef}>
          <ReelsGallery />
        </div>

        {/* FAQs Section */}
        <div ref={faqsRef}>
          <FAQs />
        </div>

        {/* 7. Clinical Reservation / Booking Form */}
        <div ref={bookingRef}>
          <BookingForm 
            diagnosisRef={completedDiagnosis} 
            onSuccess={() => setCompletedDiagnosis(null)} 
          />
        </div>

        {/* Partners / Success Clients Auto-Moving Logos Ticker */}
        <PartnersTicker />

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="العودة للأعلى"
            id="floating-scroll-top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
