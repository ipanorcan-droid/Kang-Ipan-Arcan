import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RTLItem, RTLStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Send,
  Eye,
  Check,
  X,
  RotateCcw
} from 'lucide-react';

export const MonitoringRTLView: React.FC = () => {
  const { rtlItems, verifyRTLItem, currentUser, showNotification } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [selectedRtl, setSelectedRtl] = useState<RTLItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  // Statistics
  const totalRtl = rtlItems.length;
  const doneRtl = rtlItems.filter((r) => r.status === 'SELESAI').length;
  const pendingVerificationRtl = rtlItems.filter((r) => r.status === 'MENUNGGU_VERIFIKASI').length;
  const inProgressRtl = rtlItems.filter((r) => r.status === 'SEDANG_DILAKSANAKAN').length;
  const completionPercent = totalRtl > 0 ? Number(((doneRtl / totalRtl) * 100).toFixed(1)) : 0;

  const openVerifyModal = (item: RTLItem) => {
    setSelectedRtl(item);
    setFeedbackText(item.supervisorFeedback || '');
    setVerificationModalOpen(true);
  };

  const handleVerifySubmit = (newStatus: RTLStatus) => {
    if (!selectedRtl) return;
    verifyRTLItem(selectedRtl.id, feedbackText, newStatus);
    setVerificationModalOpen(false);
  };

  const filteredItems = rtlItems.filter((r) => {
    if (filter === 'PENDING') return r.status === 'MENUNGGU_VERIFIKASI';
    if (filter === 'IN_PROGRESS') return r.status === 'SEDANG_DILAKSANAKAN' || r.status === 'BELUM_DIMULAI';
    if (filter === 'DONE') return r.status === 'SELESAI';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Pengawasan &amp; Verifikasi Hasil Supervisi
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Monitoring Rencana Tindak Lanjut (RTL)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kepala Sekolah memantau bukti penyelesaian dan melakukan verifikasi pengesahan RTL unit kerja.
          </p>
        </div>

        {/* Live Completion Pill */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-sm">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Penyelesaian RTL Sekolah</span>
            <span className="font-extrabold text-amber-300 text-sm">{completionPercent}% Tuntas ({doneRtl}/{totalRtl})</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-75 uppercase block">Total Seluruh RTL</span>
          <span className="text-3xl font-black mt-1 block">{totalRtl}</span>
          <span className="text-[10px] opacity-60">Semua Unit</span>
        </div>

        <div
          onClick={() => setFilter('PENDING')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'PENDING' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md font-bold' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-800 uppercase block">Menunggu Verifikasi</span>
          <span className="text-3xl font-black text-amber-900 mt-1 block">{pendingVerificationRtl}</span>
          <span className="text-[10px] text-amber-700">Perlu Pengesahan Kepsek</span>
        </div>

        <div
          onClick={() => setFilter('IN_PROGRESS')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'IN_PROGRESS' ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-semibold text-blue-700 uppercase block">Sedang Dilaksanakan</span>
          <span className="text-3xl font-black text-blue-900 mt-1 block">{inProgressRtl}</span>
          <span className="text-[10px] text-blue-600">Dalam Proses Pengerjaan</span>
        </div>

        <div
          onClick={() => setFilter('DONE')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'DONE' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Tuntas &amp; Disahkan</span>
          <span className="text-3xl font-black text-emerald-900 mt-1 block">{doneRtl}</span>
          <span className="text-[10px] text-emerald-600">Status Selesai</span>
        </div>
      </div>

      {/* Monitoring Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Daftar Pemantauan Rencana Tindak Lanjut
          </h2>
          <span className="text-xs text-slate-500">
            {filteredItems.length} Rencana Tindak Lanjut
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-600 uppercase">
                    {item.unitName}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {item.indicatorName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    <strong>Temuan:</strong> {item.finding}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'SELESAI'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : item.status === 'MENUNGGU_VERIFIKASI'
                        ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                        : item.status === 'SEDANG_DILAKSANAKAN'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => openVerifyModal(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Verifikasi Kepsek</span>
                  </button>
                </div>
              </div>

              {/* Action plan & Evidence Document */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Bentuk Aksi:</span>
                  <p className="text-slate-800 font-medium">{item.actionPlan}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Batas Waktu:</span>
                  <p className="text-slate-800 font-semibold">{item.targetDate} (PIC: {item.pic})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Bukti Pelaksanaan / Dokumen:</span>
                  <p className="text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{item.evidenceDocName || 'Sudah diunggah ke Arsip Digital'}</span>
                  </p>
                </div>
              </div>

              {/* Supervisor Feedback Note if exists */}
              {item.supervisorFeedback && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Catatan Verifikasi Kepala Sekolah:</span> {item.supervisorFeedback}
                    {item.verifiedAt && (
                      <span className="text-[10px] text-amber-700 block mt-0.5">
                        Disahkan pada: {item.verifiedAt} oleh {item.verifiedBy || 'Drs. H. Mulyono, M.Pd.'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verification Modal */}
      {verificationModalOpen && selectedRtl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verifikasi Rencana Tindak Lanjut (RTL)
                </h3>
                <span className="text-xs text-slate-500">{selectedRtl.unitName}</span>
              </div>
              <button
                onClick={() => setVerificationModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">{selectedRtl.indicatorName}</p>
                <p className="text-slate-600 mt-1"><strong>Aksi:</strong> {selectedRtl.actionPlan}</p>
                <p className="text-slate-600"><strong>PIC:</strong> {selectedRtl.pic} • Target: {selectedRtl.targetDate}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Evaluasi / Rekomendasi Kepala Sekolah:
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Contoh: Bukti fisik foto dan SOP telah diperiksa dan disetujui. Tindak lanjut dinyatakan tuntas."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Keputusan Verifikasi:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleVerifySubmit('SELESAI')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Sahkan Selesai (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifySubmit('PERLU_PERBAIKAN')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Perlu Perbaikan Lanjutan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
