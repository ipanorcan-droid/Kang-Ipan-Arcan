import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Aspect, Indicator, IndicatorStatus, SupervisionSession, CategoryGrade } from '../types';
import { generateAspectsForUnit } from '../data/initialData';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  Calendar,
  UserCheck,
  Building2,
  FileCheck2,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export const AssessmentExecutionView: React.FC = () => {
  const {
    units,
    supervisionSessions,
    saveSupervisionSession,
    approveSupervision,
    currentUser,
    schoolProfile,
    selectedUnitForSupervision,
    setSelectedUnitForSupervision,
    calculateSupervisionScore,
    showNotification
  } = useApp();

  // Active unit selection
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    selectedUnitForSupervision || 'unit-kurikulum'
  );

  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  // Existing session or initialize new
  const existingSession = supervisionSessions.find((s) => s.unitId === selectedUnitId);

  const [date, setDate] = useState<string>(
    existingSession?.date || new Date().toISOString().split('T')[0]
  );
  const [supervisorName, setSupervisorName] = useState<string>(
    existingSession?.supervisorName || schoolProfile.principalName
  );
  const [supervisorNip, setSupervisorNip] = useState<string>(
    existingSession?.supervisorNip || schoolProfile.principalNip
  );
  const [generalNotes, setGeneralNotes] = useState<string>(
    existingSession?.generalNotes || ''
  );
  const [generalRecommendations, setGeneralRecommendations] = useState<string>(
    existingSession?.generalRecommendations || ''
  );

  const [aspects, setAspects] = useState<Aspect[]>(() => {
    if (existingSession && existingSession.aspects && existingSession.aspects.length > 0) {
      return JSON.parse(JSON.stringify(existingSession.aspects));
    }
    return generateAspectsForUnit(selectedUnitId);
  });

  const [isAiLoading, setIsAiLoading] = useState(false);

  // When unit selection changes, update state
  useEffect(() => {
    const sess = supervisionSessions.find((s) => s.unitId === selectedUnitId);
    if (sess && sess.aspects && sess.aspects.length > 0) {
      setAspects(JSON.parse(JSON.stringify(sess.aspects)));
      setDate(sess.date);
      setSupervisorName(sess.supervisorName);
      setSupervisorNip(sess.supervisorNip);
      setGeneralNotes(sess.generalNotes || '');
      setGeneralRecommendations(sess.generalRecommendations || '');
    } else {
      setAspects(generateAspectsForUnit(selectedUnitId));
      setDate(new Date().toISOString().split('T')[0]);
      setSupervisorName(schoolProfile.principalName);
      setSupervisorNip(schoolProfile.principalNip);
      setGeneralNotes('');
      setGeneralRecommendations('');
    }
  }, [selectedUnitId, supervisionSessions, schoolProfile]);

  // Live Score Calculation
  const liveScores = calculateSupervisionScore(aspects);

  // Update an indicator score
  const handleScoreChange = (aspectIndex: number, indicatorIndex: number, newScore: number) => {
    setAspects((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const ind = copy[aspectIndex].indicators[indicatorIndex];
      ind.score = newScore;
      if (ind.status === 'NA') {
        ind.status = newScore === 4 ? 'FULFILLED' : newScore >= 2 ? 'PARTIAL' : 'NOT_MET';
      }
      return copy;
    });
  };

  // Update status (FULFILLED, PARTIAL, NOT_MET, NA)
  const handleStatusChange = (aspectIndex: number, indicatorIndex: number, status: IndicatorStatus) => {
    setAspects((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const ind = copy[aspectIndex].indicators[indicatorIndex];
      ind.status = status;
      if (status === 'NA') {
        ind.score = 0;
      } else if (status === 'FULFILLED' && ind.score < 3) {
        ind.score = 4;
      } else if (status === 'NOT_MET' && ind.score > 1) {
        ind.score = 1;
      }
      return copy;
    });
  };

  // Update indicator note or recommendation
  const handleIndicatorTextChange = (
    aspectIndex: number,
    indicatorIndex: number,
    field: 'observerNote' | 'recommendation',
    value: string
  ) => {
    setAspects((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[aspectIndex].indicators[indicatorIndex][field] = value;
      return copy;
    });
  };

  // AI Helper: Auto-generate recommendations and notes based on current inputs
  const handleGenerateAiSuggestions = async () => {
    setIsAiLoading(true);
    showNotification('AI sedang menganalisis instrumen dan merumuskan rekomendasi...');

    // Extract low indicators
    const lowList: { indicator: string; score: number }[] = [];
    const highList: { indicator: string; score: number }[] = [];
    aspects.forEach((asp) => {
      asp.indicators.forEach((ind) => {
        if (ind.status !== 'NA') {
          if (ind.score <= 2 || ind.status === 'PARTIAL' || ind.status === 'NOT_MET') {
            lowList.push({ indicator: ind.name, score: ind.score });
          } else {
            highList.push({ indicator: ind.name, score: ind.score });
          }
        }
      });
    });

    try {
      const res = await fetch('/api/ai/analyze-unit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitName: selectedUnit.name,
          score: liveScores.finalScore,
          category: liveScores.categoryGrade,
          aspects: aspects.map((a) => a.name),
          lowIndicators: lowList,
          highIndicators: highList,
          notes: generalNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch AI analysis');
      const data = await res.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setGeneralRecommendations(
          data.recommendations.map((r: string, idx: number) => `${idx + 1}. ${r}`).join('\n')
        );
      }
      if (data.summary) {
        setGeneralNotes((prev) => (prev ? `${prev}\n\n[Catatan Pengamatan AI]: ${data.summary}` : data.summary));
      }
      showNotification('Rekomendasi dan catatan berhasil digenerate oleh AI!');
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneralRecommendations(
        `1. Melengkapi bukti fisik dokumen pendukung pada seluruh indikator yang belum optimal.\n2. Mengagendakan rapat koordinasi internal unit kerja ${selectedUnit.name} untuk menyusun SOP baku.\n3. Melakukan evaluasi progres pelaksanaan rencana tindak lanjut setiap 2 pekan.`
      );
      showNotification('Rekomendasi manajerial terstandar berhasil diisi.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save session
  const handleSave = () => {
    const session: SupervisionSession = {
      id: existingSession?.id || `sup-${selectedUnitId}-${Date.now()}`,
      unitId: selectedUnitId,
      unitName: selectedUnit.name,
      leaderName: selectedUnit.leaderName,
      leaderNip: selectedUnit.leaderNip,
      academicYear: schoolProfile.academicYear,
      semester: schoolProfile.activeSemester,
      date,
      supervisorName,
      supervisorNip,
      aspects,
      totalScoreEarned: liveScores.totalScoreEarned,
      maxPossibleScore: liveScores.maxPossibleScore,
      finalScore: liveScores.finalScore,
      categoryGrade: liveScores.categoryGrade,
      status: existingSession?.isApproved ? 'SELESAI' : 'DALAM_PROSES',
      generalNotes,
      generalRecommendations,
      isApproved: existingSession?.isApproved || false,
      approvedDate: existingSession?.approvedDate,
    };

    saveSupervisionSession(session);
  };

  // Official Approval by Principal
  const handleApprove = () => {
    handleSave();
    if (existingSession) {
      approveSupervision(existingSession.id);
    }
  };

  const getCategoryColor = (grade: CategoryGrade) => {
    switch (grade) {
      case 'SANGAT_BAIK':
        return 'text-emerald-700 bg-emerald-50 border-emerald-300';
      case 'BAIK':
        return 'text-blue-700 bg-blue-50 border-blue-300';
      case 'CUKUP':
        return 'text-amber-700 bg-amber-50 border-amber-300';
      case 'PERLU_PEMBINAAN':
        return 'text-rose-700 bg-rose-50 border-rose-300';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Unit Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Instrumen Penilaian Supervisi Manajerial
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Pelaksanaan Supervisi Unit Kerja
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penilaian objektif berbasis bukti fisik, pengamatan langsung, wawancara, dan verifikasi dokumen.
          </p>
        </div>

        {/* Dropdown 15 Unit */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 shrink-0">Pilih Unit:</label>
          <select
            value={selectedUnitId}
            onChange={(e) => {
              setSelectedUnitId(e.target.value);
              setSelectedUnitForSupervision(e.target.value);
            }}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-sm max-w-xs sm:max-w-md"
          >
            {units.map((u, i) => (
              <option key={u.id} value={u.id}>
                {i + 1}. {u.name} {u.isSupervised ? `✓ (${u.score})` : '(Belum dinilai)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Unit Identity & Live Score Card (Sticky Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unit Info Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                {selectedUnit.code} • {selectedUnit.category}
              </span>
              <h2 className="text-lg font-extrabold text-white mt-1.5">{selectedUnit.name}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{selectedUnit.description}</p>
            </div>
            {existingSession?.isApproved && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disahkan Kepala Sekolah
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Penanggung Jawab:</span>
              <span className="font-semibold text-white">{selectedUnit.leaderName}</span>
              <span className="text-[10px] text-slate-400 block font-mono">NIP. {selectedUnit.leaderNip}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Petugas Supervisi:</span>
              <span className="font-semibold text-amber-300">{supervisorName}</span>
              <span className="text-[10px] text-slate-400 block font-mono">NIP. {supervisorNip}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tanggal Pelaksanaan:</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Live Score Calculator Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Kalkulator Nilai Otomatis
            </span>
            <span className="text-[10px] text-slate-400 font-mono">(Skor / Max) x 100</span>
          </div>

          <div className="my-3 text-center">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {liveScores.finalScore}
              <span className="text-lg font-medium text-slate-400"> / 100</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(liveScores.categoryGrade)}`}>
                Predikat: {liveScores.categoryGrade.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Total Skor Diperoleh:</span>
              <span className="font-bold text-slate-900">{liveScores.totalScoreEarned}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Skor Maksimal:</span>
              <span className="font-bold text-slate-900">{liveScores.maxPossibleScore}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic mt-1">
              *Indikator status N/A diabaikan dari perhitungan pembagi skor.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scoring Form - Aspects & Indicators */}
      <div className="space-y-6">
        {aspects.map((aspect, aspectIndex) => (
          <div
            key={aspect.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
          >
            {/* Aspect Header */}
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                  {aspectIndex + 1}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {aspect.name}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {aspect.indicators.length} Indikator Penilaian
              </span>
            </div>

            {/* Indicators List */}
            <div className="divide-y divide-slate-100">
              {aspect.indicators.map((indicator, indicatorIndex) => (
                <div key={indicator.id} className="p-6 space-y-4 hover:bg-slate-50/40 transition-colors">
                  
                  {/* Indicator Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {indicator.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{indicator.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600">{indicator.description}</p>
                      
                      {/* Physical Evidence info */}
                      <div className="flex items-start gap-1.5 text-[11px] text-blue-900 bg-blue-50/70 p-2 rounded-lg border border-blue-100 mt-2">
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Bukti Fisik / Dokumen Terkait:</strong> {indicator.physicalEvidence}
                        </div>
                      </div>
                    </div>

                    {/* Status Selectors */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(aspectIndex, indicatorIndex, 'FULFILLED')}
                        className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                          indicator.status === 'FULFILLED'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Sudah Terpenuhi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(aspectIndex, indicatorIndex, 'PARTIAL')}
                        className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                          indicator.status === 'PARTIAL'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Sebagian
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(aspectIndex, indicatorIndex, 'NOT_MET')}
                        className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                          indicator.status === 'NOT_MET'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Belum Terpenuhi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(aspectIndex, indicatorIndex, 'NA')}
                        className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                          indicator.status === 'NA'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        N/A (Abaikan)
                      </button>
                    </div>
                  </div>

                  {/* Rubric Score Selector (Skor 4, 3, 2, 1) */}
                  {indicator.status !== 'NA' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                      {/* Skor 4 */}
                      <button
                        type="button"
                        onClick={() => handleScoreChange(aspectIndex, indicatorIndex, 4)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          indicator.score === 4
                            ? 'border-emerald-500 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-emerald-800">Skor 4 • Sangat Baik</span>
                          {indicator.score === 4 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{indicator.criterion4}</p>
                      </button>

                      {/* Skor 3 */}
                      <button
                        type="button"
                        onClick={() => handleScoreChange(aspectIndex, indicatorIndex, 3)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          indicator.score === 3
                            ? 'border-blue-500 bg-blue-50/80 shadow-sm ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-blue-800">Skor 3 • Baik</span>
                          {indicator.score === 3 && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{indicator.criterion3}</p>
                      </button>

                      {/* Skor 2 */}
                      <button
                        type="button"
                        onClick={() => handleScoreChange(aspectIndex, indicatorIndex, 2)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          indicator.score === 2
                            ? 'border-amber-500 bg-amber-50/80 shadow-sm ring-2 ring-amber-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-amber-800">Skor 2 • Cukup</span>
                          {indicator.score === 2 && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{indicator.criterion2}</p>
                      </button>

                      {/* Skor 1 */}
                      <button
                        type="button"
                        onClick={() => handleScoreChange(aspectIndex, indicatorIndex, 1)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          indicator.score === 1
                            ? 'border-rose-500 bg-rose-50/80 shadow-sm ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-rose-800">Skor 1 • Kurang</span>
                          {indicator.score === 1 && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{indicator.criterion1}</p>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 italic">
                      Indikator ini ditandai N/A (Tidak Relevan) dan diabaikan dari perhitungan skor maksimal unit.
                    </div>
                  )}

                  {/* Notes & Recommendations per Indicator */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Catatan Pengamatan Langsung:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Dokumen lengkap, SK telah terbit..."
                        value={indicator.observerNote || ''}
                        onChange={(e) =>
                          handleIndicatorTextChange(aspectIndex, indicatorIndex, 'observerNote', e.target.value)
                        }
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Rekomendasi Spesifik:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Perbarui stiker barcode dan perbaiki berkas..."
                        value={indicator.recommendation || ''}
                        onChange={(e) =>
                          handleIndicatorTextChange(aspectIndex, indicatorIndex, 'recommendation', e.target.value)
                        }
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* General Summary, AI Assistance, & Recommendations Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Kesimpulan, Catatan & Rekomendasi Kepala Sekolah
            </h3>
            <p className="text-xs text-slate-500">
              Catatan resmi ini akan dicetak dalam Laporan Hasil Supervisi Manajerial.
            </p>
          </div>

          <button
            type="button"
            disabled={isAiLoading}
            onClick={handleGenerateAiSuggestions}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAiLoading ? 'Menganalisis...' : 'Bantu dengan AI Gemini'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catatan Hasil Pengamatan Supervisi:
            </label>
            <textarea
              rows={4}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Tuliskan catatan umum mengenai kinerja unit, keterlaksanaan program kerja, atau kendala lapangan..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Rekomendasi Pembinaan Kepala Sekolah:
            </label>
            <textarea
              rows={4}
              value={generalRecommendations}
              onChange={(e) => setGeneralRecommendations(e.target.value)}
              placeholder="Rekomendasi langkah konkret yang wajib ditindaklanjuti (RTL) oleh penanggung jawab unit..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Penilai: <strong>{supervisorName}</strong> • Unit: <strong>{selectedUnit.name}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Simpan Penilaian</span>
            </button>

            {currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPER_ADMIN' ? (
              <button
                type="button"
                onClick={handleApprove}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/30 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sahkan Hasil Supervisi</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
