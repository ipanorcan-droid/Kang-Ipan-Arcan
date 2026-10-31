import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ClipboardPen,
  FileSpreadsheet,
  Building2,
  Calendar,
  Search,
  Filter,
  BarChart3,
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    schoolProfile,
    units,
    supervisionSessions,
    rtlItems,
    setActiveMenu,
    setSelectedUnitForSupervision
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Statistics calculation
  const totalUnits = units.length; // 15
  const completedUnits = units.filter((u) => u.isSupervised).length; // 10
  const uncompletedUnits = totalUnits - completedUnits; // 5
  const progressPercent = Number(((completedUnits / totalUnits) * 100).toFixed(1)); // 66.7%

  // RTL Stats
  const unfinishedRtl = rtlItems.filter((r) => r.status !== 'SELESAI').length; // 8
  const finishedRtl = rtlItems.filter((r) => r.status === 'SELESAI').length;
  const totalRtl = rtlItems.length;
  const rtlCompletionPercent = totalRtl > 0 ? Number(((finishedRtl / totalRtl) * 100).toFixed(1)) : 0;

  // Grade Breakdown
  const gradeCounts = {
    SANGAT_BAIK: units.filter((u) => u.categoryGrade === 'SANGAT_BAIK').length,
    BAIK: units.filter((u) => u.categoryGrade === 'BAIK').length,
    CUKUP: units.filter((u) => u.categoryGrade === 'CUKUP').length,
    PERLU_PEMBINAAN: units.filter((u) => u.categoryGrade === 'PERLU_PEMBINAAN').length,
  };

  // Average score among completed
  const supervisedUnits = units.filter((u) => u.isSupervised && u.score !== undefined);
  const averageScore =
    supervisedUnits.length > 0
      ? Number((supervisedUnits.reduce((acc, curr) => acc + (curr.score || 0), 0) / supervisedUnits.length).toFixed(1))
      : 0;

  // Priority attention units (Score < 80 or status Cukup/Perlu Pembinaan)
  const priorityUnits = units.filter((u) => u.isSupervised && (u.categoryGrade === 'CUKUP' || u.categoryGrade === 'PERLU_PEMBINAAN'));

  // Filtered recap list
  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === 'ALL' ||
      (filterCategory === 'SUPERVISED' && u.isSupervised) ||
      (filterCategory === 'UNSUPERVISED' && !u.isSupervised) ||
      u.categoryGrade === filterCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryBadge = (grade?: string) => {
    switch (grade) {
      case 'SANGAT_BAIK':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Sangat Baik (91-100)</span>;
      case 'BAIK':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Baik (81-90)</span>;
      case 'CUKUP':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">Cukup (71-80)</span>;
      case 'PERLU_PEMBINAAN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">Perlu Pembinaan (&le;70)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">Belum Disupervisi</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & School Identity Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Dashboard Kepala Sekolah
              </span>
              <span className="text-xs text-slate-400">
                • {schoolProfile.academicYear} - Semester {schoolProfile.activeSemester === '1' ? 'Ganjil' : 'Genap'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              ASKIA – Supervisi Manajerial Sekolah
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Sistem Pengawasan dan Penjaminan Mutu Manajerial 15 Unit Kerja Satuan Pendidikan secara Objektif, Terukur, Transparan, dan Berkelanjutan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedUnitForSupervision(null);
                setActiveMenu('pelaksanaan');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] text-xs sm:text-sm"
            >
              <ClipboardPen className="w-4 h-4" />
              <span>Input Penilaian Supervisi</span>
            </button>

            <button
              onClick={() => setActiveMenu('analisis-ai')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold transition-all text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Analisis AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards matching User Brief */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Unit Kerja */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Unit Kerja</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalUnits}</span>
            <span className="text-xs text-slate-500">Unit Lengkap</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mencakup seluruh tupoksi sekolah</span>
          </p>
        </div>

        {/* Card 2: Sudah Disupervisi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Sudah Disupervisi</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{completedUnits}</span>
            <span className="text-xs text-slate-500">dari {totalUnits} unit</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Belum Disupervisi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Belum Disupervisi</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{uncompletedUnits}</span>
            <span className="text-xs text-slate-500">unit terjadwal</span>
          </div>
          <button
            onClick={() => setActiveMenu('jadwal-supervisi')}
            className="mt-2 text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
          >
            <span>Lihat jadwal supervisi</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: RTL Belum Selesai */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">RTL Belum Selesai</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700">{unfinishedRtl}</span>
            <span className="text-xs text-slate-500">butuh perbaikan</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Selesai: {finishedRtl} RTL</span>
            <span className="font-semibold text-slate-700">{rtlCompletionPercent}%</span>
          </div>
        </div>
      </div>

      {/* Progress & Category Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Progres Pelaksanaan Supervisi</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">
                {progressPercent}%
              </span>
            </div>

            <div className="flex items-center gap-6 my-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#1e3a8a"
                    strokeWidth="10"
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Realisasi</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-900" />
                  <span className="text-slate-600">Selesai: <strong>{completedUnits} Unit</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <span className="text-slate-600">Sisa: <strong>{uncompletedUnits} Unit</strong></span>
                </div>
                <div className="pt-2 text-[11px] text-slate-500">
                  Target Tuntas: <strong>30 November 2024</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">Rata-rata Nilai Manajerial:</span>
            <span className="text-base font-extrabold text-blue-900">{averageScore} / 100</span>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Distribusi Kategori Predikat Supervisi</h2>
            <span className="text-xs text-slate-500">Standar Permendikbudristek</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">Sangat Baik</span>
              <span className="text-2xl font-black text-emerald-700">{gradeCounts.SANGAT_BAIK}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Nilai 91–100</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[11px] font-bold text-blue-800 uppercase block">Baik</span>
              <span className="text-2xl font-black text-blue-700">{gradeCounts.BAIK}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Nilai 81–90</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-800 uppercase block">Cukup</span>
              <span className="text-2xl font-black text-amber-700">{gradeCounts.CUKUP}</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Nilai 71–80</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] font-bold text-rose-800 uppercase block">Perlu Pembinaan</span>
              <span className="text-2xl font-black text-rose-700">{gradeCounts.PERLU_PEMBINAAN}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Nilai 0–70</span>
            </div>
          </div>

          {/* Priority Attention Alert Box */}
          {priorityUnits.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Unit Membutuhkan Perhatian Prioritas Kepala Sekolah:</p>
                <div className="mt-1 space-y-1">
                  {priorityUnits.map((u) => (
                    <div key={u.id} className="flex items-center justify-between">
                      <span>• <strong>{u.name}</strong> (Nilai: {u.score} - {u.categoryGrade})</span>
                      <button
                        onClick={() => {
                          setSelectedUnitForSupervision(u.id);
                          setActiveMenu('pelaksanaan');
                        }}
                        className="text-amber-800 underline font-semibold hover:text-amber-950"
                      >
                        Tinjau Catatan &amp; RTL &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rekapitulasi Hasil Supervisi Table (matching prompt table) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Hasil Supervisi Manajerial</h2>
            <p className="text-xs text-slate-500">
              Daftar capaian nilai dan kategori seluruh unit kerja sekolah T.A. {schoolProfile.academicYear}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari unit atau pejabat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="ALL">Semua Unit (15)</option>
              <option value="SUPERVISED">Sudah Disupervisi (10)</option>
              <option value="UNSUPERVISED">Belum Disupervisi (5)</option>
              <option value="SANGAT_BAIK">Sangat Baik</option>
              <option value="BAIK">Baik</option>
              <option value="CUKUP">Cukup</option>
              <option value="PERLU_PEMBINAAN">Perlu Pembinaan</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Unit Kerja</th>
                <th className="py-3 px-4">Penanggung Jawab</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4">Kategori Predikat</th>
                <th className="py-3 px-4 text-center">RTL Aktif</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUnits.map((unit, index) => {
                const session = supervisionSessions.find((s) => s.unitId === unit.id);
                return (
                  <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{unit.name}</div>
                      <div className="text-[11px] text-slate-500">Kode: {unit.code} • Kategori: {unit.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{unit.leaderName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIP. {unit.leaderNip}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {unit.isSupervised ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>Selesai</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>Terjadwal</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {unit.isSupervised && unit.score !== undefined ? (
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          {unit.score}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getCategoryBadge(unit.categoryGrade)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {unit.pendingRtlCount > 0 ? (
                        <button
                          onClick={() => setActiveMenu('monitoring-rtl')}
                          className="px-2 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-800 hover:bg-rose-200"
                        >
                          {unit.pendingRtlCount} RTL
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUnitForSupervision(unit.id);
                            setActiveMenu('pelaksanaan');
                          }}
                          title="Lakukan / Edit Penilaian"
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                        >
                          {unit.isSupervised ? 'Detail Penilaian' : 'Nilai Unit'}
                        </button>
                        {unit.isSupervised && (
                          <button
                            onClick={() => {
                              setSelectedUnitForSupervision(unit.id);
                              setActiveMenu('laporan-supervisi');
                            }}
                            title="Cetak Laporan Resmi"
                            className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Menampilkan {filteredUnits.length} dari {totalUnits} unit kerja</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Sangat Baik (91-100)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Baik (81-90)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Cukup (71-80)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart Comparison: Multi-Semester & Unit Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit Scores Bar Visual */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Perbandingan Skor Antar Unit</h2>
              <p className="text-xs text-slate-500">Hasil Penilaian Supervisi Semester 1</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {units.filter((u) => u.isSupervised).map((u) => {
              const score = u.score || 0;
              let barColor = 'bg-blue-600';
              if (score >= 91) barColor = 'bg-emerald-500';
              else if (score >= 81) barColor = 'bg-blue-600';
              else if (score >= 71) barColor = 'bg-amber-500';
              else barColor = 'bg-rose-500';

              return (
                <div key={u.id} className="text-xs">
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span className="truncate max-w-[200px]">{u.name}</span>
                    <span className="font-mono font-bold text-slate-900">{score}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${barColor} transition-all duration-700`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Semester Comparison Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tren Perkembangan Supervisi</h2>
                <p className="text-xs text-slate-500">Perbandingan Semester Ganjil vs Semester Genap</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-semibold text-slate-500">Semester Lalu (Genap 23/24)</span>
                <p className="text-3xl font-extrabold text-slate-700 mt-1">81.8</p>
                <span className="text-[11px] text-blue-600 font-medium">Predikat Baik</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs font-semibold text-blue-800">Semester Ini (Ganjil 24/25)</span>
                <p className="text-3xl font-extrabold text-blue-900 mt-1">{averageScore}</p>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +3.6 Poin Peningkatan
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Analisis Peningkatan Mutu Berkelanjutan:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
                <li>Digitalisasi e-rapor dan administrasi kurikulum naik signifikan (+7%).</li>
                <li>Pengelolaan keuangan BOS melalui ARKAS semakin akuntabel dan tepat waktu.</li>
                <li>Fokus perbaikan semester ini ditujukan pada pembaruan KIR Sarpras dan APAR.</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Laporan disiapkan untuk Pengawas Sekolah</span>
            <button
              onClick={() => setActiveMenu('analisis-ai')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Buka Analisis Mendalam AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Landasan Hukum & Standar Supervisi Manajerial Sekolah di Indonesia */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <span>Landasan Hukum &amp; Standar Supervisi Manajerial Sekolah di Indonesia</span>
          </h3>
          <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 w-fit">
            Regulasi Nasional Resmi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. UU No. 20 Tahun 2003 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-400 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Undang-Undang RI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">UU 20/2003</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              UU Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional (Sisdiknas)
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Landasan yuridis tertinggi sistem pendidikan nasional, khususnya Pasal 51 ayat (1) mengenai tata kelola satuan pendidikan anak usia dini, pendidikan dasar, dan menengah berbasis Manajemen Berbasis Sekolah (MBS) yang berprinsip pada kemandirian, kemitraan, partisipasi, keterbukaan, dan akuntabilitas.
            </p>
          </div>

          {/* 2. PP No. 4 Tahun 2022 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-400 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Peraturan Pemerintah RI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">PP 4/2022</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              PP Nomor 4 Tahun 2022 tentang Perubahan atas PP Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Landasan penyempurnaan 8 Standar Nasional Pendidikan (SNP) dalam tata kelola manajerial, perencanaan berbasis data (Rapor Pendidikan), pemenuhan sarana prasarana, kompetensi pendidik dan tenaga kependidikan, transparansi pembiayaan, serta penjaminan mutu internal sekolah.
            </p>
          </div>

          {/* 3. Permendikbud No. 15 Tahun 2018 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-400 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Peraturan Menteri</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold">Permendikbud 15/2018</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Permendikbud No. 15 Tahun 2018</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas Sekolah, yang menegaskan fungsi pokok Kepala Sekolah sepenuhnya dalam tugas manajerial, pengembangan kewirausahaan, dan supervisi kepada guru serta tenaga kependidikan.
            </p>
          </div>

          {/* 4. Permendikbudristek No. 46 Tahun 2023 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-400 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Peraturan Menteri</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold">Permendikbud 46/2023</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Permendikbudristek No. 46 Tahun 2023</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP), menjadi dasar wajib pengawasan dan instrumen supervisi Bidang Kesiswaan melalui pembentukan, keaktifan kanal aduan, dan program Tim TPPK.
            </p>
          </div>

          {/* 5. Standar Pengelolaan Pendidikan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-400 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Standar Pengelolaan</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">SPMI Sekolah</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Standar Pengelolaan &amp; Siklus Penjaminan Mutu</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pelaksanaan penjaminan mutu internal mencakup perencanaan (RKAS/KOSP), pelaksanaan terukur, supervisi objektif berbasis bukti fisik, evaluasi diri, dan penyusunan tindak lanjut (RTL) terintegrasi pada 8 SNP.
            </p>
          </div>

          {/* 6. Arsitektur Full-Stack & AI Integration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-400 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Arsitektur Sistem</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold">AI Studio &amp; Gemini</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Arsitektur Full-Stack &amp; AI Integration</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Aplikasi ASKIA dikembangkan menggunakan Express.js, TypeScript, React 19, Tailwind CSS, LocalStorage persistence, dan Google Gemini 3.8 Flash SDK untuk analisis manajerial otomatis serta rekomendasi perbaikan berbasis data empiris.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
