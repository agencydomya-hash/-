/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Lock, Menu, X, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { DiagnosisOutput } from './types';

// Component Imports
import Logo from './components/Logo';
import Hero from './components/Hero';
import DiagnosisTool from './components/DiagnosisTool';
import Services from './components/Services';
import ReelsGallery from './components/ReelsGallery';
import BookingForm from './components/BookingForm';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
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

  // References to scroll targets
  const diagnosisRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const reelsRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-[#050b18] font-sans text-white overflow-x-hidden">
      
      {/* Premium Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#050b18]/60 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Right side: Brand Logo (appears on right in RTL) */}
            <Logo />

            {/* Middle Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => { scrollTo(servicesRef); setShowAdmin(false); }} 
                className="text-gray-300 hover:text-white font-bold text-xs sm:text-sm transition"
              >
                أعراض الكشف والحلول
              </button>
              <button 
                onClick={() => { scrollTo(reelsRef); setShowAdmin(false); }} 
                className="text-gray-300 hover:text-white font-bold text-xs sm:text-sm transition"
              >
                معرض سينما العيادة
              </button>
              <button 
                onClick={() => { scrollTo(bookingRef); setShowAdmin(false); }} 
                className="text-gray-300 hover:text-white font-bold text-xs sm:text-sm transition"
              >
                حجز الزيارة المجانية
              </button>
            </nav>

            {/* Left side: CTA action buttons (appears on left in RTL) */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={handleStartDiagnosis}
                className="px-5 py-2.5 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold rounded-xl transition duration-300 text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-orange-500/10"
                id="header-cta-diagnosis"
              >
                <Sparkles className="w-4 h-4" />
                <span>افحص حضورك الفوري</span>
              </button>

              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`px-4 py-2.5 rounded-xl border font-bold transition text-xs sm:text-sm flex items-center gap-1.5 ${
                  showAdmin 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
                id="header-cta-admin"
              >
                <Lock className="w-4 h-4 text-orange-500" />
                <span>بوابة المبيعات</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700"
                aria-label="Admin Portal"
              >
                <Lock className="w-4 h-4 text-[#FF8C00]" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[#1A2B5B] hover:bg-gray-100 transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="md:hidden border-t border-white/5 bg-[#050b18]"
              id="mobile-navigation-panel"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col items-stretch">
                <button
                  onClick={() => scrollTo(servicesRef)}
                  className="py-2.5 text-gray-300 hover:text-white font-bold text-sm block border-b border-white/5"
                >
                  أعراض الكشف والحلول
                </button>
                <button
                  onClick={() => scrollTo(reelsRef)}
                  className="py-2.5 text-gray-300 hover:text-white font-bold text-sm block border-b border-white/5"
                >
                  معرض سينما العيادة
                </button>
                <button
                  onClick={() => scrollTo(bookingRef)}
                  className="py-2.5 text-gray-300 hover:text-white font-bold text-sm block border-b border-white/5"
                >
                  حجز الزيارة المجانية
                </button>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => { scrollTo(diagnosisRef); setMobileMenuOpen(false); }}
                    className="w-full py-3 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold rounded-xl text-center text-sm"
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

        {/* 7. Clinical Reservation / Booking Form */}
        <div ref={bookingRef}>
          <BookingForm 
            diagnosisRef={completedDiagnosis} 
            onSuccess={() => setCompletedDiagnosis(null)} 
          />
        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
