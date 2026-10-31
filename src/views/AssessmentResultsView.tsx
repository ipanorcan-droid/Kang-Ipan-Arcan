import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export const AssessmentResultsView: React.FC = () => {
  const {
    units,
    supervisionSessions,
    setActiveMenu,
    setSelectedUnitForSupervision
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorted by score descending
  const sortedUnits = [...units].sort((a, b) => (b.score || 0) - (a.score || 0));

  const filtered = sortedUnits.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.leaderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || u.categoryGrade === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Matriks Evaluasi Kinerja Satuan Pendidikan
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Hasil Penilaian Supervisi Manajerial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Peringkat capaian nilai, predikat mutu, dan rekapitulasi penilaian 15 unit kerja sekolah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMenu('laporan-supervisi')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Unduh Laporan Resmi</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari unit atau pejabat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-60"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Kategori Nilai</option>
            <option value="SANGAT_BAIK">Sangat Baik (91-100)</option>
            <option value="BAIK">Baik (81-90)</option>
            <option value="CUKUP">Cukup (71-80)</option>
            <option value="PERLU_PEMBINAAN">Perlu Pembinaan (&le;70)</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Menampilkan {filtered.length} Unit
        </span>
      </div>

      {/* Results Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-4 w-16 text-center">Peringkat</th>
              <th className="py-3.5 px-4">Unit Kerja &amp; Kode</th>
              <th className="py-3.5 px-4">Penanggung Jawab</th>
              <th className="py-3.5 px-4 text-center">Tanggal Supervisi</th>
              <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
              <th className="py-3.5 px-4">Kategori Predikat</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((unit, index) => {
              const session = supervisionSessions.find((s) => s.unitId === unit.id);
              return (
                <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 text-center font-black text-slate-500">
                    {unit.isSupervised ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : index === 1
                          ? 'bg-slate-200 text-slate-800'
                          : index === 2
                          ? 'bg-amber-50 text-amber-800'
                          : 'text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{unit.name}</div>
                    <div className="text-[11px] text-slate-500">Kode: {unit.code} • {unit.category}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{unit.leaderName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">NIP. {unit.leaderNip}</div>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    {unit.lastSupervisionDate || 'Belum Dilaksanakan'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {unit.isSupervised && unit.score !== undefined ? (
                      <span className="text-lg font-black text-slate-900 font-mono">
                        {unit.score}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {unit.categoryGrade === 'SANGAT_BAIK' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Sangat Baik (91-100)
                      </span>
                    )}
                    {unit.categoryGrade === 'BAIK' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                        Baik (81-90)
                      </span>
                    )}
                    {unit.categoryGrade === 'CUKUP' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Cukup (71-80)
                      </span>
                    )}
                    {unit.categoryGrade === 'PERLU_PEMBINAAN' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        Perlu Pembinaan (&le;70)
                      </span>
                    )}
                    {!unit.isSupervised && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                        Belum Dinilai
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {session?.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Disahkan
                      </span>
                    ) : unit.isSupervised ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Draf Penilaian
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Terjadwal</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedUnitForSupervision(unit.id);
                        setActiveMenu('pelaksanaan');
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                    >
                      Buka Rincian
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
