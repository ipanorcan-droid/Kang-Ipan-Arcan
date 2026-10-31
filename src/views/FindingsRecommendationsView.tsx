import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Lightbulb,
  Search,
  Filter,
  Building2,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  FileText
} from 'lucide-react';

export const FindingsRecommendationsView: React.FC = () => {
  const { supervisionSessions, units, setActiveMenu, setSelectedUnitForSupervision } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('ALL');

  // Collect all indicator-level findings from sessions
  const findingsList: {
    unitId: string;
    unitName: string;
    aspectName: string;
    indicatorCode: string;
    indicatorName: string;
    score: number;
    status: string;
    finding: string;
    recommendation: string;
    physicalEvidence: string;
  }[] = [];

  supervisionSessions.forEach((sess) => {
    if (sess.aspects) {
      sess.aspects.forEach((asp) => {
        asp.indicators.forEach((ind) => {
          if (ind.observerNote || ind.recommendation || ind.score <= 2 || ind.status === 'PARTIAL' || ind.status === 'NOT_MET') {
            findingsList.push({
              unitId: sess.unitId,
              unitName: sess.unitName,
              aspectName: asp.name,
              indicatorCode: ind.code,
              indicatorName: ind.name,
              score: ind.score,
              status: ind.status,
              finding: ind.observerNote || 'Perlu pemenuhan bukti fisik dan verifikasi administrasi.',
              recommendation: ind.recommendation || 'Lengkapi portofolio dan laksanakan tindak lanjut terprogram.',
              physicalEvidence: ind.physicalEvidence,
            });
          }
        });
      });
    }
  });

  const filtered = findingsList.filter((f) => {
    const matchesSearch =
      f.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnitFilter === 'ALL' || f.unitId === selectedUnitFilter;
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Rekapitulasi Catatan Lapangan Kepala Sekolah
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Daftar Temuan dan Rekomendasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kompilasi seluruh temuan hasil supervisi manajerial dan arahan perbaikan untuk tindak lanjut unit kerja.
          </p>
        </div>

        <button
          onClick={() => setActiveMenu('rencana-tindak-lanjut')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
        >
          <span>Buka Rencana Tindak Lanjut (RTL)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari temuan, rekomendasi, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
            />
          </div>

          <select
            value={selectedUnitFilter}
            onChange={(e) => setSelectedUnitFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Unit Kerja</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Total <strong>{filtered.length}</strong> Catatan Temuan &amp; Rekomendasi
        </span>
      </div>

      {/* Findings List Cards */}
      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  {item.unitName} • {item.aspectName}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  [{item.indicatorCode}] {item.indicatorName}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                  Skor: {item.score} / 4
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'NOT_MET'
                    ? 'bg-rose-100 text-rose-800'
                    : item.status === 'PARTIAL'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.status === 'NOT_MET' ? 'Belum Terpenuhi' : item.status === 'PARTIAL' ? 'Sebagian' : 'Terpenuhi'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Temuan &amp; Catatan Pengamatan Supervisi:
                </span>
                <p className="text-slate-800 leading-relaxed">{item.finding}</p>
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Bukti fisik: {item.physicalEvidence}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                  Rekomendasi Pembinaan Kepala Sekolah:
                </span>
                <p className="text-slate-800 leading-relaxed">{item.recommendation}</p>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => {
                  setSelectedUnitForSupervision(item.unitId);
                  setActiveMenu('pelaksanaan');
                }}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
              >
                <span>Buka Formulir Penilaian Unit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-500">
            Tidak ada temuan supervisi yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
};
