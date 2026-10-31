import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RTLItem, RTLStatus } from '../types';
import {
  RotateCcw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Calendar,
  User,
  Trash2,
  Edit3,
  Check,
  ChevronRight
} from 'lucide-react';

export const RTLView: React.FC = () => {
  const {
    rtlItems,
    units,
    addRTLItem,
    updateRTLItem,
    deleteRTLItem,
    currentUser,
    setActiveMenu,
    showNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [unitFilter, setUnitFilter] = useState<string>('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RTLItem | null>(null);

  // Form State
  const [formUnitId, setFormUnitId] = useState(units[0]?.id || '');
  const [formIndicator, setFormIndicator] = useState('');
  const [formFinding, setFormFinding] = useState('');
  const [formRootCause, setFormRootCause] = useState('');
  const [formRecommendation, setFormRecommendation] = useState('');
  const [formActionPlan, setFormActionPlan] = useState('');
  const [formPic, setFormPic] = useState('');
  const [formTargetDate, setFormTargetDate] = useState('');
  const [formResources, setFormResources] = useState('');
  const [formStatus, setFormStatus] = useState<RTLStatus>('BELUM_DIMULAI');
  const [formProgressPercent, setFormProgressPercent] = useState<number>(0);
  const [formEvidenceName, setFormEvidenceName] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setFormUnitId(units[0]?.id || '');
    setFormIndicator('');
    setFormFinding('');
    setFormRootCause('');
    setFormRecommendation('');
    setFormActionPlan('');
    setFormPic(units[0]?.leaderName || '');
    setFormTargetDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setFormResources('ATK, komputer, panduan manajerial');
    setFormStatus('BELUM_DIMULAI');
    setFormProgressPercent(0);
    setFormEvidenceName('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: RTLItem) => {
    setEditingItem(item);
    setFormUnitId(item.unitId);
    setFormIndicator(item.indicatorName);
    setFormFinding(item.finding);
    setFormRootCause(item.rootCause);
    setFormRecommendation(item.recommendation);
    setFormActionPlan(item.actionPlan);
    setFormPic(item.pic);
    setFormTargetDate(item.targetDate);
    setFormResources(item.resources);
    setFormStatus(item.status);
    setFormProgressPercent(item.progressPercent);
    setFormEvidenceName(item.evidenceDocName || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find((u) => u.id === formUnitId) || units[0];

    if (editingItem) {
      updateRTLItem({
        ...editingItem,
        unitId: formUnitId,
        unitName: targetUnit.name,
        indicatorName: formIndicator,
        finding: formFinding,
        rootCause: formRootCause,
        recommendation: formRecommendation,
        actionPlan: formActionPlan,
        pic: formPic,
        targetDate: formTargetDate,
        resources: formResources,
        status: formStatus,
        progressPercent: formProgressPercent,
        evidenceDocName: formEvidenceName,
      });
    } else {
      addRTLItem({
        unitId: formUnitId,
        unitName: targetUnit.name,
        indicatorName: formIndicator,
        finding: formFinding,
        rootCause: formRootCause,
        recommendation: formRecommendation,
        actionPlan: formActionPlan,
        pic: formPic,
        targetDate: formTargetDate,
        resources: formResources,
        status: formStatus,
        progressPercent: formProgressPercent,
        evidenceDocName: formEvidenceName,
      });
    }
    setIsModalOpen(false);
  };

  const filteredItems = rtlItems.filter((item) => {
    const matchesSearch =
      item.indicatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesUnit = unitFilter === 'ALL' || item.unitId === unitFilter;
    return matchesSearch && matchesStatus && matchesUnit;
  });

  const getStatusBadge = (status: RTLStatus) => {
    switch (status) {
      case 'BELUM_DIMULAI':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">Belum Dimulai</span>;
      case 'SEDANG_DILAKSANAKAN':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">Sedang Berjalan</span>;
      case 'MENUNGGU_VERIFIKASI':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">Menunggu Verifikasi</span>;
      case 'SELESAI':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Selesai</span>;
      case 'PERLU_PERBAIKAN':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">Perlu Perbaikan Lanjutan</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Manajemen Tindak Lanjut Pasca Supervisi
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Rencana Tindak Lanjut (RTL)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulasi perbaikan indikator, temuan, akar masalah, target waktu, dan sumber daya per unit kerja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMenu('monitoring-rtl')}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all"
          >
            Buka Monitoring RTL
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rencana Tindak Lanjut</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari indikator, unit, temuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-56 sm:w-72"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="BELUM_DIMULAI">Belum Dimulai</option>
            <option value="SEDANG_DILAKSANAKAN">Sedang Dilaksanakan</option>
            <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
            <option value="SELESAI">Selesai</option>
            <option value="PERLU_PERBAIKAN">Perlu Perbaikan</option>
          </select>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Unit (15)</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Menampilkan <strong>{filteredItems.length}</strong> item RTL
        </span>
      </div>

      {/* RTL Items Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  {item.unitName}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {item.indicatorName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                  title="Edit RTL"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteRTLItem(item.id)}
                  className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                  title="Hapus RTL"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Matrix Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Temuan Supervisi:
                </span>
                <p className="text-slate-800 leading-relaxed">{item.finding}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Akar Permasalahan:
                </span>
                <p className="text-slate-800 leading-relaxed">{item.rootCause}</p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-[10px] text-blue-800 uppercase font-bold block mb-1">
                  Bentuk Kegiatan Tindak Lanjut:
                </span>
                <p className="text-blue-950 font-medium leading-relaxed">{item.actionPlan}</p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-800 uppercase font-bold block mb-1">
                  Target &amp; Penanggung Jawab:
                </span>
                <p className="font-semibold text-slate-900">PIC: {item.pic}</p>
                <p className="text-slate-600 mt-1">Batas Waktu: {item.targetDate}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Sumber Daya: {item.resources}</p>
              </div>
            </div>

            {/* Progress Bar & Evidence */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Progres Pelaksanaan:</span>
                  <span className="font-bold text-slate-900">{item.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.progressPercent === 100
                        ? 'bg-emerald-500'
                        : item.progressPercent > 50
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              {item.supervisorFeedback && (
                <div className="text-[11px] text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <strong>Catatan Verifikasi Kepsek:</strong> {item.supervisorFeedback}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm text-slate-500 text-xs">
            Tidak ada rencana tindak lanjut yang cocok dengan filter pencarian.
          </div>
        )}
      </div>

      {/* Modal Add / Edit RTL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Rencana Tindak Lanjut' : 'Tambah Rencana Tindak Lanjut (RTL)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Kerja:</label>
                  <select
                    value={formUnitId}
                    onChange={(e) => {
                      setFormUnitId(e.target.value);
                      const u = units.find((x) => x.id === e.target.value);
                      if (u) setFormPic(u.leaderName);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Indikator yang Diperbaiki:</label>
                  <input
                    type="text"
                    required
                    value={formIndicator}
                    onChange={(e) => setFormIndicator(e.target.value)}
                    placeholder="Contoh: Pembaruan Kartu Inventaris Ruang (KIR)"
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Temuan Supervisi:</label>
                <textarea
                  rows={2}
                  required
                  value={formFinding}
                  onChange={(e) => setFormFinding(e.target.value)}
                  placeholder="Kelemahan atau bukti yang belum terpenuhi saat supervisi..."
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Akar Permasalahan:</label>
                <input
                  type="text"
                  required
                  value={formRootCause}
                  onChange={(e) => setFormRootCause(e.target.value)}
                  placeholder="Penyebab utama kendala tersebut muncul..."
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bentuk Kegiatan Tindak Lanjut:</label>
                <textarea
                  rows={2}
                  required
                  value={formActionPlan}
                  onChange={(e) => setFormActionPlan(e.target.value)}
                  placeholder="Langkah terukur yang akan dilaksanakan..."
                  className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Penanggung Jawab (PIC):</label>
                  <input
                    type="text"
                    required
                    value={formPic}
                    onChange={(e) => setFormPic(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Batas Waktu:</label>
                  <input
                    type="date"
                    required
                    value={formTargetDate}
                    onChange={(e) => setFormTargetDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Penyelesaian:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="BELUM_DIMULAI">Belum Dimulai</option>
                    <option value="SEDANG_DILAKSANAKAN">Sedang Dilaksanakan</option>
                    <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="PERLU_PERBAIKAN">Perlu Perbaikan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sumber Daya yang Diperlukan:</label>
                  <input
                    type="text"
                    value={formResources}
                    onChange={(e) => setFormResources(e.target.value)}
                    placeholder="Contoh: Format buku, kertas label, scanner"
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Progres Penyelesaian (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formProgressPercent}
                    onChange={(e) => setFormProgressPercent(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                >
                  Simpan RTL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
