import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Lock, Menu, X, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, Globe, ArrowUp, Home, Layers, Video, Calendar, Moon, Sun } from 'lucide-react';
import { DiagnosisOutput } from './types';
import { translations } from './translations';

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
  
  // Language & Dark Mode States
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('domya_lang') as 'ar' | 'en') || 'ar';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('domya_dark_mode') === 'true';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('domya_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('domya_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('domya_dark_mode', 'false');
    }
  }, [darkMode]);

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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
      const isMobile = window.innerWidth < 1024;
      ref.current.scrollIntoView({ 
        behavior: isMobile ? 'auto' : 'smooth', 
        block: 'start' 
      });
    }
    setMobileMenuOpen(false);
  };

  const handleStartDiagnosis = () => {
    scrollTo(diagnosisRef);
  };

  const handleBookConsultation = () => {
    setIsBookingModalOpen(true);
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
      setIsBookingModalOpen(true);
    }, 100);
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950 font-sans text-[#2C3E50] dark:text-slate-200 overflow-x-hidden relative transition-colors duration-300">
      
      {/* Floating Ambient Brand Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FF6B35]/4 aurora-blob dark:opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#003D7A]/6 aurora-blob-2 dark:opacity-10" />
        <div className="absolute top-[40%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[#FF6B35]/2 aurora-blob dark:opacity-10" />
      </div>

      {/* Premium Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#003D7A] dark:bg-slate-900 border-b border-[#002A57] dark:border-slate-800 shadow-lg relative z-50 transition-colors" id="main-header">
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
            <Logo light={true} lang={lang} />

            {/* Middle Nav Links */}
            <nav className="hidden xl:flex items-center gap-6">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                {t.home}
              </button>
              <button 
                onClick={() => { scrollTo(servicesRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                {t.services}
              </button>
              <button 
                onClick={() => { scrollTo(whyChooseUsRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                {t.whyUs}
              </button>
              <button 
                onClick={() => { scrollTo(journeyRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                {t.journey}
              </button>
              <button 
                onClick={() => { scrollTo(reelsRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                {t.portfolio}
              </button>
              <button 
                onClick={() => { scrollTo(faqsRef); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer"
              >
                {t.faqs}
              </button>
              <button 
                onClick={() => { setIsBookingModalOpen(true); setShowAdmin(false); }} 
                className="text-white/95 hover:text-[#FF6B35] font-bold text-xs transition cursor-pointer nav-link-slide"
              >
                {t.contact}
              </button>
            </nav>

            {/* Left side: CTA action buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher Badge */}
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1.5 bg-[#002A57]/60 border border-[#001F3F]/40 px-3 py-1.5 rounded-xl text-[10px] text-white select-none hover:bg-[#002A57] transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span className={`font-bold ${lang === 'ar' ? 'text-white' : 'text-slate-400'}`}>AR</span>
                <span className="text-slate-500">|</span>
                <span className={`font-bold ${lang === 'en' ? 'text-white' : 'text-slate-400'}`}>EN</span>
              </button>

              {/* Dark Mode Switcher */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-[#002A57]/60 border border-[#001F3F]/40 text-white hover:bg-[#002A57] transition cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#FF6B35]" />}
              </button>

              <button
                onClick={handleStartDiagnosis}
                className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition duration-300 text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/15 cursor-pointer"
                id="header-cta-diagnosis"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.aiCheckup}</span>
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
                <span>{t.salesPortal}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex xl:hidden items-center gap-2">
              {/* Language Switcher Badge */}
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="p-2 rounded-lg bg-[#002A57] border border-[#001F3F] text-white hover:bg-[#002A57]/80 transition cursor-pointer text-xs font-bold"
              >
                {lang === 'ar' ? 'EN' : 'AR'}
              </button>

              {/* Dark Mode Switcher */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-[#002A57] border border-[#001F3F] text-white hover:bg-[#002A57]/80 transition cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#FF6B35]" />}
              </button>

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
              className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
              id="mobile-navigation-panel"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col items-stretch">
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.home}
                </button>
                <button
                  onClick={() => { scrollTo(servicesRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.services}
                </button>
                <button
                  onClick={() => { scrollTo(whyChooseUsRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.whyUs}
                </button>
                <button
                  onClick={() => { scrollTo(journeyRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.journey}
                </button>
                <button
                  onClick={() => { scrollTo(reelsRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.portfolio}
                </button>
                <button
                  onClick={() => { scrollTo(faqsRef); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.faqs}
                </button>
                <button
                  onClick={() => { setIsBookingModalOpen(true); setMobileMenuOpen(false); }}
                  className="py-2 text-[#2C3E50] dark:text-slate-200 hover:text-[#FF6B35] font-bold text-sm block border-b border-slate-100 dark:border-slate-800 text-right cursor-pointer"
                >
                  {t.contact}
                </button>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => { scrollTo(diagnosisRef); setMobileMenuOpen(false); }}
                    className="w-full py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-center text-sm cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    {t.aiCheckup}
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
          lang={lang}
          darkMode={darkMode}
          onStartDiagnosis={handleStartDiagnosis} 
          onBookConsultation={handleBookConsultation} 
        />

        {/* Statistics Section */}
        <Statistics lang={lang} />

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
          <Services lang={lang} />
        </div>

        {/* 5. Doctors cinematic Reels multimedia section */}
        <div ref={reelsRef}>
          <ReelsGallery lang={lang} />
        </div>

        {/* 7. Clinical Reservation / Booking Form */}
        <div ref={bookingRef}>
          <BookingForm 
            lang={lang}
            diagnosisRef={completedDiagnosis} 
            onSuccess={() => setCompletedDiagnosis(null)} 
          />
        </div>

        {/* Why Choose Us Section */}
        <div ref={whyChooseUsRef}>
          <WhyChooseUs lang={lang} />
        </div>

        {/* Journey Section */}
        <div ref={journeyRef}>
          <Journey lang={lang} />
        </div>

        {/* 4. Interactive AI Branding Diagnosis Tool */}
        <div ref={diagnosisRef}>
          <DiagnosisTool 
            lang={lang}
            onDiagnosisComplete={handleDiagnosisComplete} 
            onSelectBookingWithDiagnosis={handleSelectBookingWithDiagnosis} 
          />
        </div>

        {/* FAQs Section */}
        <div ref={faqsRef}>
          <FAQs lang={lang} />
        </div>

        {/* Partners / Success Clients Auto-Moving Logos Ticker */}
        <PartnersTicker lang={lang} />

      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 xl:bottom-6 left-6 z-50 w-12 h-12 bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="العودة للأعلى"
            id="floating-scroll-top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Booking Modal Overlay */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-[#020813]/85 backdrop-blur-sm"
            />
            {/* Modal Card container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#061025] rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-200 dark:border-[#10244d] max-h-[85vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF6B35] hover:text-white transition cursor-pointer text-slate-500 dark:text-slate-400 z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-1">
                <BookingForm
                  lang={lang}
                  diagnosisRef={completedDiagnosis}
                  onSuccess={() => {
                    setCompletedDiagnosis(null);
                    // Dismiss modal after success feedback
                    setTimeout(() => {
                      setIsBookingModalOpen(false);
                    }, 2000);
                  }}
                  isModal={true}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Premium Bottom Floating Mobile Navigation Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 block xl:hidden">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xl px-4 py-2 flex items-center justify-between pb-safe">
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowAdmin(false); }} 
            className="flex flex-col items-center gap-1 text-[#2C3E50]/70 hover:text-[#FF6B35] transition interactive-tab cursor-pointer py-1 flex-1"
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">الرئيسية</span>
          </button>
          
          <button 
            onClick={() => { scrollTo(servicesRef); setShowAdmin(false); }} 
            className="flex flex-col items-center gap-1 text-[#2C3E50]/70 hover:text-[#FF6B35] transition interactive-tab cursor-pointer py-1 flex-1"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[9px] font-bold">الخدمات</span>
          </button>

          {/* Centered Glowing AI Diagnosis Button */}
          <div className="flex-1 flex justify-center -mt-6">
            <button 
              onClick={() => { scrollTo(diagnosisRef); setShowAdmin(false); }} 
              className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-orange-500/35 border-4 border-white animate-pulse-subtle transition interactive-tab cursor-pointer"
              aria-label="AI Checkup"
            >
              <Stethoscope className="w-6 h-6" />
            </button>
          </div>

          <button 
            onClick={() => { scrollTo(reelsRef); setShowAdmin(false); }} 
            className="flex flex-col items-center gap-1 text-[#2C3E50]/70 hover:text-[#FF6B35] transition interactive-tab cursor-pointer py-1 flex-1"
          >
            <Video className="w-5 h-5" />
            <span className="text-[9px] font-bold">الأعمال</span>
          </button>

          <button 
            onClick={() => { setIsBookingModalOpen(true); setShowAdmin(false); }} 
            className="flex flex-col items-center gap-1 text-[#2C3E50]/70 hover:text-[#FF6B35] transition interactive-tab cursor-pointer py-1 flex-1"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[9px] font-bold">الحجز</span>
          </button>
        </div>
      </div>

    </div>
  );
}
