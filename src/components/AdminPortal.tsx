/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, RefreshCw, CheckCircle, FileSpreadsheet, Lock, AlertCircle, Sparkles, CheckSquare, Mail, ClipboardList, Database } from 'lucide-react';
import { DoctorSubmission } from '../types';

export default function AdminPortal() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<DoctorSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'integrations'>('leads');
  
  // Custom states for editing notes
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'domya2026') {
      setIsAuthenticated(true);
      setError('');
      fetchSubmissions();
    } else {
      setError('كلمة المرور غير صحيحة. برجاء مراجعة الرمز السري لوكالة دومايا.');
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
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 focus:ring-2 focus:ring-[#FF8C00] outline-none text-center font-mono tracking-widest text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF8C00] hover:bg-orange-600 rounded-xl font-bold transition text-xs sm:text-sm"
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
                  <div className="text-2xl font-black mt-1 font-mono text-[#FF8C00]">{submissions.length}</div>
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
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeTab === 'leads' ? 'bg-[#FF8C00] text-white' : 'bg-white/5 text-gray-300'
                  }`}
                >
                  طلبات الأطباء الحالية ({submissions.length})
                </button>
                <button
                  onClick={() => setActiveTab('integrations')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeTab === 'integrations' ? 'bg-[#FF8C00] text-white' : 'bg-white/5 text-gray-300'
                  }`}
                >
                  ربط جوجل وورك سبيس 🔒
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

                            {/* Notes Editor */}
                            <td className="p-4">
                              {editingId === sub.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={2}
                                    className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white resize-none"
                                    placeholder="اكتب تفاصيل المكالمة والترتيب هنا..."
                                  />
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleSaveNotes(sub.id)}
                                      className="px-2 py-1 bg-emerald-600 rounded text-[10px] font-bold text-white"
                                    >
                                      حفظ
                                    </button>
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-300"
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
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-orange-500" />
                    <span>تكاملات ومزامنة جوجل السحابية المدمجة (Google Workspace Sync)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    جميع الحجوزات يتم مزامنتها تلقائياً مع نظام الإدارة الداخلي الخاص بوكالة دومايا من خلال ترخيص OAuth وتكاملات Google APIs:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Google Sheets */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded">مفعل ونشط ✓</span>
                      <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-white text-sm">مجدول بيانات جوجل (Google Sheets)</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      يتم تصدير أي طلب حجز فوراً إلى ملف المبيعات المشترك عيادة عيادة لتسهيل المتابعة الفورية للعملاء.
                    </p>
                    <div className="text-[9px] font-mono text-gray-500 bg-white/[0.02] p-1.5 rounded truncate">
                      Sheet: domya_doctors_crm_v2_2026
                    </div>
                  </div>

                  {/* Gmail API */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-blue-500/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-blue-400 uppercase font-mono bg-blue-500/10 px-2 py-0.5 rounded">مفعل ونشط ✓</span>
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <h4 className="font-bold text-white text-sm">بريد إلكتروني مزدوج (Gmail API)</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      إرسال رسالة آلية لتأكيد الاستلام وتوجيه الطبيب للخطوة القادمة، مع إرسال بريد تنبيهي فوري لمدير مشروع دومايا.
                    </p>
                    <div className="text-[9px] font-mono text-gray-500 bg-white/[0.02] p-1.5 rounded truncate">
                      Sender: Contact@domya.net
                    </div>
                  </div>

                  {/* Google Tasks / Calendar */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-orange-500/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-orange-400 uppercase font-mono bg-orange-500/10 px-2 py-0.5 rounded">مفعل ونشط ✓</span>
                      <CheckSquare className="w-6 h-6 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-white text-sm">مهام المتابعة (Google Tasks API)</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      يتم تعيين مهمة تذكيرية فورية لمدير مبيعات دومايا على تقويم جوجل للاتصال بالطبيب في غضون 24 ساعة بدون أي إخفاق.
                    </p>
                    <div className="text-[9px] font-mono text-gray-500 bg-white/[0.02] p-1.5 rounded truncate">
                      Tasklist: Domya Doctors Followups
                    </div>
                  </div>
                </div>

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
          </motion.div>
        )}

      </div>
    </div>
  );
}
