import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function PartnersTicker() {
  const [partners, setPartners] = useState<any[]>([]);

  const defaultMockLogos = [
    { name: "مركز الأمل للعيون 👁️", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { name: "عيادة د. هاني الرفاعي 🦴", color: "text-[#FF6B35] bg-orange-50 border-orange-200" },
    { name: "مستشفى النيل التخصصي 🏥", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { name: "مستشفى الصفوة للقلب 🫀", color: "text-red-600 bg-red-50 border-red-200" },
    { name: "د. منى الشريف للأطفال 👶", color: "text-purple-600 bg-purple-50 border-purple-200" },
    { name: "Clinique Premium ⚕️", color: "text-cyan-600 bg-cyan-50 border-cyan-200" }
  ];

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const normalized = data.map((p: any) => 
              typeof p === 'string' ? { logoUrl: p, name: '' } : p
            );
            setPartners(normalized);
          }
        }
      } catch (err) {
        console.error("Failed to fetch partners:", err);
      }
    };
    fetchPartners();
  }, []);

  const tickerItems = partners.length > 0 ? [...partners, ...partners, ...partners] : [];
  const mockTickerItems = [...defaultMockLogos, ...defaultMockLogos, ...defaultMockLogos];

  return (
    <section className="py-16 bg-white border-y border-slate-200/60 relative z-10 overflow-hidden" id="partners-ticker-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center" dir="rtl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>شركاء النجاح الرقمي 📈</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#003D7A]">
          أطباء وعيادات يثقون في خدمات دوميا
        </h2>
      </div>

      {/* Scrolling Strip wrapper */}
      <div className="w-full relative py-2 overflow-hidden flex items-center bg-slate-50/50" style={{ direction: 'ltr' }}>
        {/* Left and Right shadows/faders to create smooth entrance/exit */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        {/* The Marquee Ticker */}
        {partners.length > 0 ? (
          <div className="animate-marquee flex gap-6 items-center">
            {tickerItems.map((item, idx) => (
              <div
                key={idx}
                className="h-16 px-6 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3 justify-center shadow-sm select-none shrink-0"
              >
                {item.logoUrl && (
                  <img
                    src={item.logoUrl}
                    alt={item.name || "Client Partner Logo"}
                    className="h-9 w-auto object-contain max-w-[120px]"
                    loading="lazy"
                  />
                )}
                {item.name && (
                  <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap" dir="rtl">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Render stylized text/logo badges if no images uploaded yet */
          <div className="animate-marquee flex gap-6 items-center">
            {mockTickerItems.map((logo, idx) => (
              <div
                key={idx}
                className={`h-16 px-6 bg-white border rounded-2xl flex items-center justify-center shadow-sm select-none shrink-0 font-bold text-xs sm:text-sm ${logo.color}`}
              >
                <span>{logo.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}