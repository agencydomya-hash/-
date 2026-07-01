/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, RefreshCw, CheckCircle, FileSpreadsheet, Lock, AlertCircle, Sparkles, CheckSquare, Mail, ClipboardList, Database, Globe } from 'lucide-react';
import { DoctorSubmission } from '../types';
import { translations } from '../translations';

export default function AdminPortal() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('domya_admin_auth') === 'true';
  });
  const [submissions, setSubmissions] = useState<DoctorSubmission[]>([]);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'integrations' | 'content' | 'translations'>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'integrations' || tabParam === 'content' || tabParam === 'translations') {
      return tabParam;
    }
    return 'leads';
  });
  
  // Custom states for editing notes
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  // States for Google Workspace and custom SMTP Configs
  const [googleConfig, setGoogleConfig] = useState({
    spreadsheetId: '',
    accessToken: '',
    webhookUrl: '',
    receiverEmail: 'agencydomya@gmail.com',
    smtpUser: '',
    smtpPass: ''
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // States for Success Partners
  const [partners, setPartners] = useState<any[]>([]);
  const [uploadingPartner, setUploadingPartner] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [editingPartnerIdx, setEditingPartnerIdx] = useState<number | null>(null);
  const [tempPartnerName, setTempPartnerName] = useState('');

  // States for Reels CMS
  const [reels, setReels] = useState<any[]>([]);
  const [loadingReels, setLoadingReels] = useState(false);
  const [editingReel, setEditingReel] = useState<any | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingCarousel, setUploadingCarousel] = useState(false);
  
  const [reelForm, setReelForm] = useState({
    id: '',
    specialty: '',
    doctorName: '',
    title: '',
    views: '10K',
    coverColor: 'from-[#091B65] to-[#FF5100]',
    length: 15,
    qualityPillars: ['', '', ''],
    subtitlesText: '0: أول جملة في الفيديو\n3: ثاني جملة في الفيديو\n6: ثالث جملة في الفيديو',
    videoUrl: '',
    coverUrl: '',
    mediaType: 'video' as 'video' | 'images',
    images: [] as string[]
  });

  // Dynamic custom translations states
  const [translationsData, setTranslationsData] = useState<any>({ ar: {}, en: {} });
  const [savingTranslations, setSavingTranslations] = useState(false);
  const [translationSuccess, setTranslationSuccess] = useState('');
  const [translatingField, setTranslatingField] = useState<string | null>(null);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      if (response.ok) {
        const data = await response.json();
        const normalized = data.map((p: any) => 
          typeof p === 'string' ? { logoUrl: p, name: '' } : p
        );
        setPartners(normalized);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const savePartnersList = async (updatedPartners: any[]) => {
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth: 'domya2026',
          partners: updatedPartners
        })
      });
      if (!response.ok) {
        alert('فشل حفظ قائمة الشركاء على السيرفر.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'cover' | 'partner' | 'carousel') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'video') setUploadingVideo(true);
    else if (type === 'cover') setUploadingCover(true);
    else if (type === 'carousel') setUploadingCarousel(true);
    else setUploadingPartner(true);

    try {
      // Upload directly from browser to Cloudinary (bypasses Vercel body size limit)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'domya_uploads');
      formData.append('folder', 'domya');

      const isVideo = file.type.startsWith('video');
      const resourceType = isVideo ? 'video' : 'image';
      const cloudName = 'wcntnyxa';

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: 'POST', body: formData }
      );

      if (response.ok) {
        const data = await response.json();
        const url = data.secure_url;

        if (type === 'video') {
          setReelForm(prev => ({ ...prev, videoUrl: url }));
          alert('تم رفع ملف الفيديو بنجاح! 🎥');
        } else if (type === 'cover') {
          setReelForm(prev => ({ ...prev, coverUrl: url }));
          alert('تم رفع صورة الغلاف بنجاح! 🖼️');
        } else if (type === 'carousel') {
          setReelForm(prev => ({
            ...prev,
            images: [...(prev.images || []), url]
          }));
          alert('تم إضافة صورة الكاروسيل بنجاح! 🖼️');
        } else {
          const newLogoObj = { logoUrl: url, name: newPartnerName || '' };
          const updatedList = [...partners, newLogoObj];
          setPartners(updatedList);
          await savePartnersList(updatedList);
          setNewPartnerName('');
          alert('تم إضافة شعار العميل بنجاح! 🤝');
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Cloudinary error:', errData);
        alert('فشل رفع الملف على Cloudinary: ' + (errData?.error?.message || 'خطأ غير معروف'));
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الملف.');
    } finally {
      if (type === 'video') setUploadingVideo(false);
      else if (type === 'cover') setUploadingCover(false);
      else if (type === 'carousel') setUploadingCarousel(false);
      else setUploadingPartner(false);
    }
  };


  const fetchReels = async () => {
    setLoadingReels(true);
    try {
      const response = await fetch('/api/reels');
      if (response.ok) {
        const data = await response.json();
        setReels(data);
      }
    } catch (err) {
      console.error('Failed to fetch reels:', err);
    } finally {
      setLoadingReels(false);
    }
  };

  const handleDeleteReel = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الفيديو من المعرض؟')) return;
    try {
      const response = await fetch(`/api/reels/${id}?auth=domya2026`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const data = await response.json();
        setReels(data.reels || []);
        showSuccess('تم حذف الفيديو بنجاح من المعرض! 🎥');
      } else {
        setError('فشل حذف الفيديو.');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم لحذف الفيديو.');
    }
  };

  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.doctorName || !reelForm.specialty || !reelForm.title) {
      alert('برجاء ملء الحقول الأساسية للفيديو.');
      return;
    }

    // Parse subtitles text to array
    const parsedSubtitles = reelForm.subtitlesText
      .split('\n')
      .map(line => {
        const index = line.indexOf(':');
        if (index === -1) return null;
        const time = parseFloat(line.substring(0, index).trim());
        const text = line.substring(index + 1).trim();
        return isNaN(time) ? null : { time, text };
      })
      .filter((s): s is { time: number; text: string } => s !== null);

    const updatedReel = {
      id: reelForm.id || `reel_${Date.now()}`,
      specialty: reelForm.specialty,
      doctorName: reelForm.doctorName,
      title: reelForm.title,
      views: reelForm.views,
      coverColor: reelForm.coverColor,
      length: Number(reelForm.length),
      qualityPillars: reelForm.qualityPillars.filter(p => p.trim() !== ''),
      subtitles: parsedSubtitles,
      videoUrl: reelForm.videoUrl || '',
      coverUrl: reelForm.coverUrl || '',
      mediaType: reelForm.mediaType,
      images: reelForm.images
    };

    try {
      const response = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth: 'domya2026',
          reel: updatedReel
        })
      });
      if (response.ok) {
        const data = await response.json();
        setReels(data.reels || []);
        setEditingReel(null);
        showSuccess('تم حفظ فيديو المعرض بنجاح! 🎥');
      } else {
        setError('فشل حفظ الفيديو.');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم لحفظ الفيديو.');
    }
  };

  const fetchGoogleConfig = async () => {
    try {
      const response = await fetch('/api/google/config?auth=domya2026');
      if (response.ok) {
        const data = await response.json();
        setGoogleConfig({
          spreadsheetId: data.spreadsheetId || '',
          accessToken: data.accessToken || '',
          webhookUrl: data.webhookUrl || '',
          receiverEmail: data.receiverEmail || 'agencydomya@gmail.com',
          smtpUser: data.smtpUser || '',
          smtpPass: data.smtpPass || ''
        });
      }
    } catch (err) {
      console.error('Failed to load Google configuration:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'integrations') {
      fetchGoogleConfig();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'content') {
      fetchReels();
      fetchPartners();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'translations') {
      fetchTranslations();
    }
  }, [isAuthenticated, activeTab]);

  const fetchTranslations = async () => {
    try {
      const response = await fetch('/api/translations');
      if (response.ok) {
        const data = await response.json();
        // Start with a clean copy of default translations
        const defaultAr = { ...translations.ar };
        const defaultEn = { ...translations.en };
        // Merge custom translations on top
        setTranslationsData({
          ar: { ...defaultAr, ...(data.ar || {}) },
          en: { ...defaultEn, ...(data.en || {}) }
        });
      }
    } catch (err) {
      console.error("Failed to load translations:", err);
    }
  };

  const handleAiTranslate = async (key: string, sourceLang: 'ar' | 'en', text: string) => {
    if (!text.trim()) return;
    const targetLang = sourceLang === 'ar' ? 'en' : 'ar';
    const fieldId = `${key}_${targetLang}`;
    setTranslatingField(fieldId);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translation) {
          setTranslationsData((prev: any) => ({
            ...prev,
            [targetLang]: {
              ...prev[targetLang],
              [key]: data.translation
            }
          }));
        }
      }
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslatingField(null);
    }
  };

  const handleSaveTranslations = async () => {
    setSavingTranslations(true);
    setError('');
    setTranslationSuccess('');
    try {
      const res = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translationsData)
      });
      if (res.ok) {
        setTranslationSuccess('تم حفظ تعديلات نصوص الموقع والترجمات بنجاح! سيتم تحديث الموقع لحظياً.');
        setTimeout(() => setTranslationSuccess(''), 4000);
      } else {
        setError('فشل حفظ التعديلات.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالسيرفر لحفظ التعديلات.');
    } finally {
      setSavingTranslations(false);
    }
  };

  const handleSaveGoogleConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const response = await fetch('/api/google/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth: 'domya2026',
          ...googleConfig
        })
      });
      if (response.ok) {
        showSuccess('تم حفظ إعدادات المزامنة والربط بنجاح! 🔒');
      } else {
        setError('فشل حفظ الإعدادات على الخادم.');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم لحفظ الإعدادات.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Append a unique timestamp query parameter to bypass aggressive browser caching
      const response = await fetch('/api/google/auth-url?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        // Redirect browser to Google Authorization Page
        window.location.href = data.url;
      } else {
        alert('فشل توليد رابط المصادقة من جوجل.');
      }
    } catch (err) {
      console.error(err);
      alert('خطأ في الاتصال بالخادم لتسجيل الدخول بحساب جوجل.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'domya2026') {
      sessionStorage.setItem('domya_admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة. برجاء مراجعة الرمز السري لوكالة دومايا.');
    }
  };

  const handleResendEmail = async (id: string) => {
    setResendingId(id);
    setError('');
    try {
      const response = await fetch('/api/submissions/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth: 'domya2026', id })
      });
      if (response.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, emailStatus: 'success' } : s));
        showSuccess('تم إعادة إرسال الإيميل للطبيب بنجاح! ✉️');
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || 'فشل إرسال الإيميل يدوياً.');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم لإعادة إرسال الإيميل.');
    } finally {
      setResendingId(null);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/submissions?auth=domya2026');
      if (!response.ok) {
        throw new Error('فشل تحميل الطلبات.');
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError('فشل جلب البيانات من الخادم.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'archived') => {
    try {
      const response = await fetch('/api/submissions/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth: 'domya2026', id, status: newStatus })
      });
      if (response.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        showSuccess('تم تحديث حالة الطبيب بنجاح.');
      }
    } catch (err) {
      setError('فشل تحديث الحالة.');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const response = await fetch('/api/submissions/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth: 'domya2026', id, notes: editNotes })
      });
      if (response.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, notes: editNotes } : s));
        setEditingId(null);
        showSuccess('تم حفظ الملاحظات السريرية بنجاح.');
      }
    } catch (err) {
      setError('فشل حفظ الملاحظات.');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Export to CSV client-side
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    
    // Arabic UTF-8 BOM
    let csvContent = "\uFEFF";
    csvContent += "المعرف,الاسم,التخصص,العيادة,الهاتف,البريد,رابط السوشيال ميديا,الهدف,الحالة,تاريخ التسجيل,ملاحظات\n";
    
    submissions.forEach(s => {
      csvContent += `"${s.id}","${s.name}","${s.specialty}","${s.clinicName}","${s.phone}","${s.email}","${s.socialLink}","${s.goal}","${s.status}","${new Date(s.createdAt).toLocaleString('ar-EG')}","${s.notes || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `domya_doctors_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0f172a] text-white py-20 border-t border-white/10" id="admin-portal-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-orange-400 rounded-full text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>خاص بالإدارة والمبيعات فقط</span>
          </div>
          <h2 className="text-3xl font-sans font-bold text-white">لوحة تحكم إدارة الحجوزات (CRM) 📊</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm">
            أداة سرية خاصة بفريق مبيعات وكالة دومايا لمتابعة استمارات الأطباء، جدولة الفحوصات الميدانية وتحديث قواعد البيانات الفورية.
          </p>
        </div>

        {!isAuthenticated ? (
          /* Login Section */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 text-right"
            id="admin-login-box"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold">بوابة المبيعات الآمنة</h3>
              <p className="text-xs text-gray-400">برجاء إدخال رمز المرور السري لوكالة دومايا (domya2026) للوصول.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300">رمز الدخول الأمني</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-center font-mono tracking-widest text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF5100] hover:bg-orange-600 rounded-xl font-bold transition text-xs sm:text-sm"
              >
                فتح بوابة التحكم بالبيانات
              </button>
            </form>
          </motion.div>
        ) : (
          /* Authenticated Dashboard view */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-right"
            id="admin-dashboard-wrapper"
          >
            {/* Dashboard top stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-white/5 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">إجمالي الأطباء المسجلين</span>
                  <div className="text-2xl font-black mt-1 font-mono text-[#FF5100]">{submissions.length}</div>
                </div>
                <Users className="w-8 h-8 text-orange-500/30" />
              </div>

              <div className="bg-slate-900 border border-white/5 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">حالات الحجز الجديدة</span>
                  <div className="text-2xl font-black mt-1 font-mono text-blue-400">
                    {submissions.filter(s => s.status === 'new').length}
                  </div>
                </div>
                <ClipboardList className="w-8 h-8 text-blue-500/30" />
              </div>

              <div className="bg-slate-900 border border-white/5 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">تم فحصهم ومتابعتهم</span>
                  <div className="text-2xl font-black mt-1 font-mono text-emerald-400">
                    {submissions.filter(s => s.status === 'contacted').length}
                  </div>
                </div>
                <CheckSquare className="w-8 h-8 text-emerald-500/30" />
              </div>
            </div>

            {/* Success and Error messages */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Dashboard Nav bar */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 w-full flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'leads' ? 'bg-[#FF5100] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  طلبات الأطباء الحالية ({submissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('integrations')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'integrations' ? 'bg-[#FF5100] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  ربط جوجل وورك سبيس 🔒
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'content' ? 'bg-[#FF5100] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  إدارة فيديوهات المعرض 🎥
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('translations')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'translations' ? 'bg-[#FF5100] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  تعديل نصوص الصفحة والترجمة 📝
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchSubmissions}
                  disabled={loading}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition flex items-center gap-1 text-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={submissions.length === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-bold transition text-xs flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير Excel/CSV</span>
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('domya_admin_auth');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-950/60 border border-red-500/20 text-red-400 font-bold rounded-lg transition text-xs cursor-pointer"
                >
                  تسجيل الخروج 🚪
                </button>
              </div>
            </div>

            {/* Tab 1: Leads list */}
            {activeTab === 'leads' && (
              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                  <div className="p-12 text-center text-gray-400 text-xs">جاري سحب بيانات الاستمارات الأمنية...</div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 text-xs">مفيش أي حجوزات مسجلة على السيرفر لغاية دلوقتي.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950 text-gray-300 font-bold border-b border-white/5">
                        <tr>
                          <th className="p-4">الطبيب والتخصص</th>
                          <th className="p-4">اسم العيادة</th>
                          <th className="p-4">بيانات الاتصال</th>
                          <th className="p-4">الهدف التسويقي الأساسي</th>
                          <th className="p-4">الحالة</th>
                          <th className="p-4 text-center">الإيميل التلقائي</th>
                          <th className="p-4">الملاحظات الطبية والتسويقية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {submissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/[0.02] transition">
                            {/* Doctor and specialty */}
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">د. {sub.name}</div>
                              <div className="text-gray-400 text-[10px] mt-0.5">{sub.specialty}</div>
                              <span className="text-[9px] font-mono text-gray-500 mt-1 block">رقم الاستمارة: {sub.id}</span>
                            </td>

                            {/* Clinic */}
                            <td className="p-4 text-gray-300 font-medium">{sub.clinicName}</td>

                            {/* Contact data */}
                            <td className="p-4 space-y-1">
                              <div className="font-mono text-gray-200">{sub.phone}</div>
                              <div className="text-gray-400 font-mono">{sub.email}</div>
                              {sub.socialLink && sub.socialLink !== "غير محدد" && (
                                <a
                                  href={sub.socialLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-orange-400 hover:underline truncate max-w-[150px] block"
                                >
                                  زيارة رابط صفحتهم 🌐
                                </a>
                              )}
                            </td>

                            {/* Goal */}
                            <td className="p-4 text-gray-300 max-w-[180px] leading-relaxed">{sub.goal}</td>

                            {/* Status controls */}
                            <td className="p-4">
                              <div className="flex flex-col gap-1.5 w-24">
                                <button
                                  onClick={() => handleUpdateStatus(sub.id, 'new')}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition text-center ${
                                    sub.status === 'new'
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                  }`}
                                >
                                  جديد
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(sub.id, 'contacted')}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition text-center ${
                                    sub.status === 'contacted'
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                  }`}
                                >
                                  تم المتابعة
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(sub.id, 'archived')}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition text-center ${
                                    sub.status === 'archived'
                                      ? 'bg-gray-600 text-white'
                                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                  }`}
                                >
                                  مؤرشف
                                </button>
                              </div>
                            </td>

                            {/* Email Status & Resend */}
                            <td className="p-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {sub.emailStatus === 'success' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                                    <CheckCircle className="w-3 h-3" /> تم الإرسال
                                  </span>
                                )}
                                {sub.emailStatus === 'failed' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold text-[10px]">
                                    <AlertCircle className="w-3 h-3" /> فشل الإرسال
                                  </span>
                                )}
                                {sub.emailStatus === 'pending' && sub.email && sub.email !== 'غير محدد' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] animate-pulse">
                                    <RefreshCw className="w-3 h-3 animate-spin" /> جاري الإرسال
                                  </span>
                                )}
                                {(sub.emailStatus === 'not_provided' || !sub.email || sub.email === 'غير محدد') && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 font-bold text-[10px]">
                                    لا يوجد بريد
                                  </span>
                                )}
                                
                                {sub.email && sub.email !== 'غير محدد' && (
                                  <button
                                    onClick={() => handleResendEmail(sub.id)}
                                    disabled={resendingId === sub.id}
                                    className="mt-1.5 px-2 py-1 bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 border border-white/10 rounded font-bold text-[9px] text-gray-300 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <Mail className="w-3 h-3" />
                                    {resendingId === sub.id ? 'جاري...' : 'إعادة إرسال'}
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Notes Editor */}
                            <td className="p-4">
                              {editingId === sub.id ? (
                                <div className="space-y-2 text-right">
                                  <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={2}
                                    className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white resize-none"
                                    placeholder="اكتب تفاصيل المكالمة والترتيب هنا..."
                                  />
                                  <div className="flex gap-1.5 justify-start">
                                    <button
                                      onClick={() => handleSaveNotes(sub.id)}
                                      className="px-2 py-1 bg-emerald-600 rounded text-[10px] font-bold text-white cursor-pointer"
                                    >
                                      حفظ
                                    </button>
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-300 cursor-pointer"
                                    >
                                      إلغاء
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1.5 max-w-[200px]">
                                  <p className="text-gray-400 italic text-xs leading-relaxed line-clamp-3">
                                    {sub.notes || "لا يوجد ملاحظات لغاية الآن..."}
                                  </p>
                                  <button
                                    onClick={() => {
                                      setEditingId(sub.id);
                                      setEditNotes(sub.notes || '');
                                    }}
                                    className="text-orange-400 hover:underline text-[10px] font-bold block"
                                  >
                                    تعديل الملاحظات ✏️
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Integrations dashboard */}
            {activeTab === 'integrations' && (
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-orange-500" />
                    <span>إعدادات الربط السحابي والمزامنة (Google Workspace & Webhooks Config)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    قم بتكوين إعدادات الربط مع ملف جوجل شيتس أو النموذج التلقائي (Google Form Webhook) وموقع وكالة دومايا:
                  </p>
                </div>

                <form onSubmit={handleSaveGoogleConfig} className="space-y-6 text-right">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Google Sheets Spreadsheet ID */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-300">معرف جدول البيانات (Google Spreadsheet ID)</label>
                      <input
                        type="text"
                        placeholder="مثال: 1a2b3c4d5e6f7g8h9i..."
                        value={googleConfig.spreadsheetId}
                        onChange={(e) => setGoogleConfig(prev => ({ ...prev, spreadsheetId: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-white text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-500 block">المعرف الفريد لملف Google Sheets الخاص بك من الرابط المتصفح.</span>
                    </div>

                    {/* Google OAuth / API Access Token */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-gray-300">رمز الدخول البرمجي (API Access Token)</label>
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>🔑 تسجيل الدخول السريع مع Google</span>
                        </button>
                      </div>
                      <input
                        type="password"
                        placeholder="سيتم ملء هذا الحقل تلقائياً بعد تسجيل الدخول..."
                        value={googleConfig.accessToken}
                        onChange={(e) => setGoogleConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-white text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-500 block">اضغط على زر الدخول ليقوم النظام بالربط وتحديث الرمز تلقائياً بحسابك.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Custom Google Forms / Apps Script Webhook URL */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-300">رابط جوجل فورم / ويبهوك (Google Form Webhook URL)</label>
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={googleConfig.webhookUrl}
                        onChange={(e) => setGoogleConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-white text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-500 block">رابط Webhook / Apps Script لإرسال البيانات مباشرة وتخزينها في نموذج جوجل.</span>
                    </div>

                    {/* Leads Receiver Email */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-300">البريد الإلكتروني لاستقبال الإشعارات (Receiver Email)</label>
                      <input
                        type="email"
                        placeholder="agencydomya@gmail.com"
                        value={googleConfig.receiverEmail}
                        onChange={(e) => setGoogleConfig(prev => ({ ...prev, receiverEmail: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-white text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-500 block">البريد الخاص بوكالة دومايا الذي سيتلقى استمارات الحجز الجديدة فوراً.</span>
                    </div>
                  </div>

                  {/* SMTP Credentials Section */}
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <h4 className="text-sm font-bold text-orange-400 border-r-4 border-orange-500 pr-2">
                      إعدادات إرسال البريد الإلكتروني الحقيقي (Gmail SMTP Config)
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      أدخل بيانات حساب Gmail الخاص بوكالة دومايا لإرسال إيميلات تأكيد حقيقية للأطباء وتنبيهات فورية للمبيعات:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">بريد المرسل SMTP User (Gmail)</label>
                        <input
                          type="email"
                          placeholder="مثال: DomyaWorld@gmail.com"
                          value={googleConfig.smtpUser}
                          onChange={(e) => setGoogleConfig(prev => ({ ...prev, smtpUser: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-white text-xs font-mono"
                        />
                        <span className="text-[10px] text-gray-500 block">حساب Gmail الرئيسي المرسل للإشعارات.</span>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">كلمة مرور التطبيق SMTP Password (App Password)</label>
                        <input
                          type="password"
                          placeholder="رمز كلمة مرور التطبيق (16 حرفاً)..."
                          value={googleConfig.smtpPass}
                          onChange={(e) => setGoogleConfig(prev => ({ ...prev, smtpPass: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF5100] outline-none text-white text-xs font-mono"
                        />
                        <span className="text-[10px] text-gray-500 block">كلمة مرور التطبيقات (App Password) المولدة من إعدادات الأمان لحساب جوجل.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-start">
                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="px-8 py-3.5 bg-[#FF5100] hover:bg-orange-600 rounded-xl font-bold transition text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                    >
                      {savingConfig ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>حفظ إعدادات الربط والمزامنة السحابية</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/15 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-orange-300">نصيحة أمنية سرية لفريق المبيعات:</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      احرص على غلق لوحة التحكم أو تحديث الصفحة بعد الانتهاء من مراجعة الحجوزات الطبية لعدم تعرض بيانات الأطباء للوصول غير المصرح. سرية العملاء هي من أهم قيم وكالة دومايا لعام 2026.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Reels CMS */}
            {activeTab === 'content' && (
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-white/5 pb-4 flex justify-between items-center flex-wrap gap-4">
                  <div className="text-right">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      <span>إدارة معرض فيديوهات السينما الطبية (Reels CMS)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      أضف فيديوهات ميديا سينمائية جديدة، عدّل ميزاتها الطبية وعناوينها، أو احذفها للتحكم في المعرض العام بالكامل:
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingReel({ isNew: true });
                      setReelForm({
                        id: '',
                        specialty: 'جراحة العظام والمفاصل 🦴',
                        doctorName: 'د. ',
                        title: '',
                        views: '100K',
                        coverColor: 'from-[#091B65] to-[#FF5100]',
                        length: 15,
                        qualityPillars: ['', '', ''],
                        subtitlesText: '0: أول جملة في الفيديو\n3: ثاني جملة في الفيديو\n6: ثالث جملة في الفيديو',
                        videoUrl: '',
                        coverUrl: '',
                        mediaType: 'video',
                        images: []
                      });
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <span>إضافة فيديو جديد لمعرض السينما 🎥</span>
                  </button>
                </div>

                {editingReel ? (
                  /* Add / Edit Reel Form */
                  <form onSubmit={handleSaveReel} className="glass p-6 rounded-2xl space-y-4 text-right">
                    <h4 className="text-sm font-bold text-orange-400 border-b border-white/5 pb-2">
                      {editingReel.isNew ? 'إضافة فيديو جديد للمعرض' : `تعديل فيديو: ${reelForm.title}`}
                    </h4>

                    {/* Content Type Selector */}
                    <div className="space-y-2 pb-2 border-b border-white/5">
                      <label className="block text-xs font-bold text-gray-300">نوع المحتوى المرفوع لمعرض الأعمال:</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition">
                          <input
                            type="radio"
                            name="mediaType"
                            value="video"
                            checked={reelForm.mediaType === 'video'}
                            onChange={() => setReelForm(prev => ({ ...prev, mediaType: 'video' }))}
                            className="text-[#FF5100] focus:ring-[#FF5100]"
                          />
                          <span>فيديو سينمائي 🎥</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition">
                          <input
                            type="radio"
                            name="mediaType"
                            value="images"
                            checked={reelForm.mediaType === 'images'}
                            onChange={() => setReelForm(prev => ({ ...prev, mediaType: 'images' }))}
                            className="text-[#FF5100] focus:ring-[#FF5100]"
                          />
                          <span>ألبوم صور كاروسيل 📸</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">اسم الطبيب</label>
                        <input
                          type="text"
                          required
                          value={reelForm.doctorName}
                          onChange={(e) => setReelForm(prev => ({ ...prev, doctorName: e.target.value }))}
                          placeholder="مثال: د. أحمد الشريف"
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">التخصص الطبي والرموز التعبيرية</label>
                        <input
                          type="text"
                          required
                          value={reelForm.specialty}
                          onChange={(e) => setReelForm(prev => ({ ...prev, specialty: e.target.value }))}
                          placeholder="مثال: جراحة العظام والمفاصل 🦴"
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-300">عنوان الفيديو (الخطاف التسويقي)</label>
                        <input
                          type="text"
                          required
                          value={reelForm.title}
                          onChange={(e) => setReelForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="مثال: خرافة طقطقة الرقبة.. هل بتسبب خشونة فعلاً؟"
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">عدد المشاهدات (المحاكي)</label>
                        <input
                          type="text"
                          required
                          value={reelForm.views}
                          onChange={(e) => setReelForm(prev => ({ ...prev, views: e.target.value }))}
                          placeholder="مثال: 124K"
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">تدرج الألوان (Tailwind classes)</label>
                        <input
                          type="text"
                          value={reelForm.coverColor}
                          onChange={(e) => setReelForm(prev => ({ ...prev, coverColor: e.target.value }))}
                          placeholder="from-[#091B65] to-[#FF5100]"
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-300">مدة الفيديو (بالثواني)</label>
                        <input
                          type="number"
                          value={reelForm.length}
                          onChange={(e) => setReelForm(prev => ({ ...prev, length: Number(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>
                    </div>

                    {reelForm.mediaType === 'video' ? (
                      <>
                        {/* Media File Uploads (Video & Image Cover) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Video File Uploader */}
                          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <label className="block text-xs font-bold text-gray-300">رفع ملف الفيديو الحقيقي (Video File - MP4)</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="file"
                                accept="video/mp4,video/x-m4v,video/*"
                                onChange={(e) => handleFileUpload(e, 'video')}
                                className="hidden"
                                id="video-file-upload-input"
                              />
                              <label
                                htmlFor="video-file-upload-input"
                                className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition"
                              >
                                {uploadingVideo ? 'جاري رفع الفيديو... ⏳' : 'اختر ملف الفيديو 🎥'}
                              </label>
                              {reelForm.videoUrl && (
                                <span className="text-[10px] text-emerald-400 font-mono truncate max-w-[120px]" dir="ltr">
                                  ✓ {reelForm.videoUrl.split('/').pop()}
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="أو ضع رابط الفيديو مباشرة..."
                              value={reelForm.videoUrl}
                              onChange={(e) => setReelForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                              className="w-full mt-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                            />
                          </div>

                          {/* Cover Image Uploader */}
                          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <label className="block text-xs font-bold text-gray-300">رفع صورة الغلاف/الخلفية (Cover Image - JPG/PNG)</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'cover')}
                                className="hidden"
                                id="cover-file-upload-input"
                              />
                              <label
                                htmlFor="cover-file-upload-input"
                                className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition"
                              >
                                {uploadingCover ? 'جاري رفع الصورة... ⏳' : 'اختر صورة الغلاف 🖼️'}
                              </label>
                              {reelForm.coverUrl && (
                                <span className="text-[10px] text-emerald-400 font-mono truncate max-w-[120px]" dir="ltr">
                                  ✓ {reelForm.coverUrl.split('/').pop()}
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="أو ضع رابط الصورة مباشرة..."
                              value={reelForm.coverUrl}
                              onChange={(e) => setReelForm(prev => ({ ...prev, coverUrl: e.target.value }))}
                              className="w-full mt-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                            />
                          </div>
                        </div>

                        {/* Quality Pillars */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-300">ميزات الإنتاج وجودة الفيمبروداكشن (3 نقاط)</label>
                          <div className="space-y-2">
                            {reelForm.qualityPillars.map((pillar, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`ميزة الإنتاج رقم ${idx + 1}`}
                                value={pillar}
                                onChange={(e) => {
                                  const updated = [...reelForm.qualityPillars];
                                  updated[idx] = e.target.value;
                                  setReelForm(prev => ({ ...prev, qualityPillars: updated }));
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Subtitles text block */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-300">الكلام المكتوب ومواقيت الظهور (Subtitles Transcription)</label>
                          <textarea
                            rows={4}
                            value={reelForm.subtitlesText}
                            onChange={(e) => setReelForm(prev => ({ ...prev, subtitlesText: e.target.value }))}
                            placeholder="أدخل الوقت متبوعاً بالثواني والنص، سطر بكل جملة. مثال:&#10;0: طقطقة الرقبة والظهر.. حركة بنعملها كلنا&#10;3: بس هل الحركة دي بتضر فعلاً؟"
                            className="w-full p-3 rounded-xl border border-white/10 bg-slate-950 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-[#FF5100] resize-none"
                          />
                        </div>
                      </>
                    ) : (
                      /* Carousel Images Uploader for Showcase album */
                      <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-right">
                          <label className="block text-xs font-bold text-gray-300">صور ألبوم الكاروسيل (Carousel Images - JPG/PNG)</label>
                          <p className="text-[10px] text-gray-400 mt-1">ارفع صورة واحدة أو أكثر لتكوين ألبوم الصور التفاعلي:</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'carousel')}
                            className="hidden"
                            id="carousel-file-upload-input"
                          />
                          <label
                            htmlFor="carousel-file-upload-input"
                            className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition"
                          >
                            {uploadingCarousel ? 'جاري الرفع... ⏳' : 'رفع صورة وإضافتها للألبوم 📸'}
                          </label>
                        </div>

                        {/* List of uploaded photos inside this specific reelForm carousel */}
                        {reelForm.images && reelForm.images.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                            {reelForm.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative rounded-lg overflow-hidden border border-white/10 aspect-[9/16] bg-slate-950 flex flex-col justify-end shadow-sm">
                                <img src={imgUrl} className="absolute inset-0 w-full h-full object-contain" alt="" />
                                <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-mono">
                                  #{imgIdx + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedImgs = reelForm.images.filter((_, idx) => idx !== imgIdx);
                                    setReelForm(prev => ({ ...prev, images: updatedImgs }));
                                  }}
                                  className="absolute inset-x-0 bottom-0 py-1 bg-red-650 hover:bg-red-700 text-white text-[8px] font-bold text-center transition cursor-pointer"
                                >
                                  حذف الصورة
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic text-center py-4">لم يتم رفع أي صور لهذا الألبوم بعد.</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 justify-start pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                      >
                        حفظ البيانات
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReel(null)}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition cursor-pointer"
                      >
                        إلغاء التعديل
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Reels List */
                  <div className="space-y-4">
                    {loadingReels ? (
                      <div className="p-12 text-center text-gray-400 text-xs">جاري سحب بيانات الفيديوهات من الخادم...</div>
                    ) : reels.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 text-xs">مفيش أي فيديوهات مسجلة في المعرض لغاية دلوقتي. اضغط على إضافة فيديو جديد بالأعلى.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reels.map((reel) => (
                          <div
                            key={reel.id}
                            className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-orange-500/20 transition text-right"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded font-mono">
                                  ID: {reel.id}
                                </span>
                                <span className="text-[10px] font-bold text-orange-400 font-mono">
                                  {reel.views} مشاهدة 👁️
                                </span>
                              </div>
                              <h4 className="font-bold text-white text-sm line-clamp-1">{reel.title}</h4>
                              <p className="text-gray-400 text-[11px] font-semibold">{reel.doctorName} — {reel.specialty}</p>
                              <div className="text-[10px] text-gray-500 font-mono">المدة: {reel.length} ثانية | عدد الجمل المكتوبة: {reel.subtitles?.length || 0}</div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                              <button
                                onClick={() => {
                                  setEditingReel(reel);
                                  setReelForm({
                                    id: reel.id,
                                    specialty: reel.specialty,
                                    doctorName: reel.doctorName,
                                    title: reel.title,
                                    views: reel.views,
                                    coverColor: reel.coverColor || 'from-[#091B65] to-[#FF5100]',
                                    length: reel.length,
                                    qualityPillars: [
                                      reel.qualityPillars?.[0] || '',
                                      reel.qualityPillars?.[1] || '',
                                      reel.qualityPillars?.[2] || ''
                                    ],
                                    subtitlesText: (reel.subtitles || [])
                                      .map((s: any) => `${s.time}: ${s.text}`)
                                      .join('\n'),
                                    videoUrl: reel.videoUrl || '',
                                    coverUrl: reel.coverUrl || '',
                                    mediaType: reel.mediaType || 'video',
                                    images: reel.images || []
                                  });
                                }}
                                className="flex-1 py-2 bg-orange-600/10 hover:bg-orange-600/20 border border-orange-500/20 text-[#FF5100] text-xs font-bold rounded-xl transition cursor-pointer text-center"
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeleteReel(reel.id)}
                                className="px-3 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl transition cursor-pointer"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Partners Logos CMS Ticker Management */}
                <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
                  <div className="text-right">
                    <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2 justify-end">
                      <Globe className="w-4 h-4 text-orange-500" />
                      <span>إدارة شعارات العملاء وشركاء النجاح (Moving Ticker Logos)</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">
                      ارفع شعارات جديدة للأطباء أو العيادات الشريكة لتتحرك تلقائياً في شريط شركاء النجاح بمنتصف الصفحة:
                    </p>
                  </div>

                  <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex gap-4 items-center flex-wrap md:flex-nowrap border-b border-white/5 pb-4">
                      <div className="flex-1 space-y-1 text-right w-full">
                        <label className="block text-[11px] font-bold text-gray-300">اسم الطبيب أو العيادة (اختياري، يظهر بجوار الشعار):</label>
                        <input
                          type="text"
                          placeholder="مثال: عيادة د. محمد هلال 🦴"
                          value={newPartnerName}
                          onChange={(e) => setNewPartnerName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-[#FF5100]"
                        />
                      </div>
                      <div className="shrink-0 pt-5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'partner')}
                          className="hidden"
                          id="partner-logo-upload-input"
                        />
                        <label
                          htmlFor="partner-logo-upload-input"
                          className="px-4 py-2 bg-[#FF6B35]/25 hover:bg-[#FF6B35]/35 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition"
                        >
                          {uploadingPartner ? 'جاري الرفع... ⏳' : 'رفع الشعار وإضافة الشريك 🤝'}
                        </label>
                      </div>
                    </div>

                    {/* List of uploaded partner logos */}
                    {partners.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
                        {partners.map((partner, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-white flex flex-col items-center justify-between p-2 pb-7 shadow-sm">
                            <div className="flex-1 flex items-center justify-center w-full">
                              {partner.logoUrl ? (
                                <img src={partner.logoUrl} className="max-h-[35px] max-w-full object-contain" alt="" />
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">بدون لوجو</span>
                              )}
                            </div>
                            
                            {editingPartnerIdx === idx ? (
                              <div className="flex gap-1 items-center w-full mt-1 px-1">
                                <input
                                  type="text"
                                  value={tempPartnerName}
                                  onChange={(e) => setTempPartnerName(e.target.value)}
                                  className="w-full text-[9px] px-1 py-0.5 border border-slate-300 rounded text-slate-800 bg-slate-50 font-bold text-center outline-none focus:border-orange-500"
                                  placeholder="الاسم..."
                                  autoFocus
                                  onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                      const updated = [...partners];
                                      updated[idx] = { ...updated[idx], name: tempPartnerName };
                                      setPartners(updated);
                                      await savePartnersList(updated);
                                      setEditingPartnerIdx(null);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const updated = [...partners];
                                    updated[idx] = { ...updated[idx], name: tempPartnerName };
                                    setPartners(updated);
                                    await savePartnersList(updated);
                                    setEditingPartnerIdx(null);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-0.5 rounded text-[8px] font-bold shrink-0 cursor-pointer"
                                  title="حفظ"
                                >
                                  ✓
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 mt-1 w-full px-1">
                                <span className="text-[9px] font-bold text-slate-700 truncate max-w-[80%] text-center animate-fade-in" dir="rtl">
                                  {partner.name || <span className="text-gray-400 italic text-[8px]">بدون اسم</span>}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPartnerIdx(idx);
                                    setTempPartnerName(partner.name || '');
                                  }}
                                  className="text-orange-500 hover:text-orange-600 p-0.5 text-[8px] shrink-0 font-bold cursor-pointer transition-transform hover:scale-110"
                                  title="تعديل الاسم ✏️"
                                >
                                  ✏️
                                </button>
                              </div>
                            )}

                            <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-mono">
                              #{idx + 1}
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = partners.filter((_, i) => i !== idx);
                                setPartners(updated);
                                await savePartnersList(updated);
                              }}
                              className="absolute inset-x-0 bottom-0 py-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold text-center transition cursor-pointer"
                            >
                              حذف الشريك
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic text-center py-4">لم يتم رفع أي شعارات بعد. سيتم عرض الشعارات التجريبية الافتراضية.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'translations' && translationsData && (
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-white/5 pb-4 flex justify-between items-center flex-wrap gap-4">
                  <div className="text-right">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-orange-500" />
                      <span>تعديل نصوص ومحتوى الموقع والترجمة الذكية (Translations Editor)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      عدّل أي نص أو عنوان رئيسي في الموقع باللغتين العربية والإنجليزية، واستعن بالذكاء الاصطناعي لترجمة النصوص تلقائياً بنقرة واحدة:
                    </p>
                  </div>
                  <button
                    onClick={handleSaveTranslations}
                    disabled={savingTranslations}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/25"
                  >
                    {savingTranslations ? 'جاري الحفظ...' : 'حفظ التعديلات ونشرها فوراً 🚀'}
                  </button>
                </div>

                {translationSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-semibold text-right">
                    {translationSuccess}
                  </div>
                )}

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  {[
                    { key: 'heroBadge', label: 'شارة الهيرو (Hero Badge)' },
                    { key: 'heroTitle1', label: 'العنوان الرئيسي السطر الأول' },
                    { key: 'heroTitle2', label: 'العنوان الرئيسي السطر الثاني (برتقالي)' },
                    { key: 'heroSubtitle', label: 'العنوان الفرعي للهيرو (Hero Subtitle)', type: 'textarea' },
                    { key: 'heroCtaConsult', label: 'زر الحجز الرئيسي (CTA Button)' },
                    { key: 'whyUsTitle', label: 'عنوان قسم "لماذا نحن؟"' },
                    { key: 'whyUsSubtitle', label: 'وصف قسم "لماذا نحن؟"', type: 'textarea' },
                    { key: 'journeyTitle', label: 'عنوان قسم "رحلة النجاح"' },
                    { key: 'journeySubtitle', label: 'وصف قسم "رحلة النجاح"', type: 'textarea' },
                    { key: 'reelsTitle', label: 'عنوان معرض الفيديوهات' },
                    { key: 'reelsSubtitle', label: 'وصف معرض الفيديوهات', type: 'textarea' },
                    { key: 'footerDesc', label: 'وصف الفوتر (Footer Description)', type: 'textarea' },
                    { key: 'footerTagline', label: 'شعار الفوتر (Footer Tagline)' }
                  ].map((field) => (
                    <div key={field.key} className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-4 text-right">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 font-mono">Key: {field.key}</span>
                        <span className="text-sm font-bold text-white">{field.label}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Arabic Column */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => handleAiTranslate(field.key, 'en', translationsData.en?.[field.key] || '')}
                              disabled={translatingField !== null}
                              className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/15"
                            >
                              {translatingField === `${field.key}_ar` ? 'جاري الترجمة...' : 'ترجم إلى العربية بالـ AI 🤖'}
                            </button>
                            <label className="text-[11px] font-bold text-orange-400">النسخة العربية (Arabic)</label>
                          </div>
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={4}
                              value={translationsData.ar?.[field.key] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTranslationsData((prev: any) => ({
                                  ...prev,
                                  ar: { ...prev.ar, [field.key]: val }
                                }));
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 text-right leading-relaxed"
                              dir="rtl"
                            />
                          ) : (
                            <input
                              type="text"
                              value={translationsData.ar?.[field.key] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTranslationsData((prev: any) => ({
                                  ...prev,
                                  ar: { ...prev.ar, [field.key]: val }
                                }));
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 text-right"
                              dir="rtl"
                            />
                          )}
                        </div>

                        {/* English Column */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => handleAiTranslate(field.key, 'ar', translationsData.ar?.[field.key] || '')}
                              disabled={translatingField !== null}
                              className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/15"
                            >
                              {translatingField === `${field.key}_en` ? 'Translating...' : 'Translate to EN via AI 🤖'}
                            </button>
                            <label className="text-[11px] font-bold text-orange-400">النسخة الإنجليزية (English)</label>
                          </div>
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={4}
                              value={translationsData.en?.[field.key] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTranslationsData((prev: any) => ({
                                  ...prev,
                                  en: { ...prev.en, [field.key]: val }
                                }));
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 text-left leading-relaxed"
                              dir="ltr"
                            />
                          ) : (
                            <input
                              type="text"
                              value={translationsData.en?.[field.key] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTranslationsData((prev: any) => ({
                                  ...prev,
                                  en: { ...prev.en, [field.key]: val }
                                }));
                              }}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 text-left"
                              dir="ltr"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    onClick={handleSaveTranslations}
                    disabled={savingTranslations}
                    className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/25"
                  >
                    {savingTranslations ? 'جاري الحفظ...' : 'حفظ التعديلات ونشرها فوراً 🚀'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
