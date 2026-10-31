import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAspectsForUnit } from '../data/initialData';
import {
  BookOpenCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  FileCheck2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const InstrumentsView: React.FC = () => {
  const { units, showNotification } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-kurikulum');
  const [aspects, setAspects] = useState(() => generateAspectsForUnit('unit-kurikulum'));

  const handleUnitChange = (id: string) => {
    setSelectedUnitId(id);
    setAspects(generateAspectsForUnit(id));
  };

  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Standar Mutu &amp; Rubrik Penilaian
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Instrumen Supervisi Manajerial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Katalog aspek, indikator penilaian tupoksi, kriteria ketercapaian skor 1-4, dan checklist bukti fisik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedUnitId}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Unit Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
            Instrumen Aktif: {selectedUnit.code}
          </span>
          <h2 className="text-lg font-extrabold text-white">{selectedUnit.name}</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Penanggung Jawab: {selectedUnit.leaderName} (NIP. {selectedUnit.leaderNip})
          </p>
        </div>
        <div className="text-right text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700 font-bold">
            Skala 1 - 4 &amp; Opsi N/A
          </span>
        </div>
      </div>

      {/* Aspects List */}
      <div className="space-y-6">
        {aspects.map((aspect, aIdx) => (
          <div key={aspect.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                  {aIdx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {aspect.name}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {aspect.indicators.length} Indikator Terstandar
              </span>
            </div>

            <div className="divide-y divide-slate-100 p-6 space-y-6">
              {aspect.indicators.map((ind, iIdx) => (
                <div key={ind.id} className="space-y-3 pt-4 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {ind.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{ind.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ind.description}</p>
                    </div>
                  </div>

                  {/* Physical Evidence */}
                  <div className="flex items-start gap-2 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-xs text-blue-950">
                    <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Bukti Fisik / Dokumen Verifikasi:</strong> {ind.physicalEvidence}
                    </div>
                  </div>

                  {/* Rubric Criteria 4, 3, 2, 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-800 text-[11px] block mb-1">
                        Skor 4 • Sangat Baik
                      </span>
                      <p className="text-slate-700 text-[11px] leading-snug">{ind.criterion4}</p>
                    </div>

                    <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200">
                      <span className="font-bold text-blue-800 text-[11px] block mb-1">
                        Skor 3 • Baik
                      </span>
                      <p className="text-slate-700 text-[11px] leading-snug">{ind.criterion3}</p>
                    </div>

                    <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200">
                      <span className="font-bold text-amber-800 text-[11px] block mb-1">
                        Skor 2 • Cukup
                      </span>
                      <p className="text-slate-700 text-[11px] leading-snug">{ind.criterion2}</p>
                    </div>

                    <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200">
                      <span className="font-bold text-rose-800 text-[11px] block mb-1">
                        Skor 1 • Kurang
                      </span>
                      <p className="text-slate-700 text-[11px] leading-snug">{ind.criterion1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
