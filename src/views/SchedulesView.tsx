import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupervisionSchedule } from '../types';
import {
  Clock,
  Calendar,
  Plus,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  ArrowRight
} from 'lucide-react';

export const SchedulesView: React.FC = () => {
  const {
    schedules,
    units,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    schoolProfile,
    setActiveMenu,
    setSelectedUnitForSupervision
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<SupervisionSchedule | null>(null);

  const [unitId, setUnitId] = useState(units[10]?.id || units[0]?.id || '');
  const [plannedDate, setPlannedDate] = useState('');
  const [time, setTime] = useState('08:30 - 10:30 WIB');
  const [venue, setVenue] = useState('Ruang Kerja Unit / Lab');
  const [supervisorName, setSupervisorName] = useState(schoolProfile.principalName);
  const [status, setStatus] = useState<SupervisionSchedule['status']>('TERJADWAL');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingSchedule(null);
    setUnitId(units[10]?.id || units[0]?.id || '');
    setPlannedDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setTime('09:00 - 11:00 WIB');
    setVenue('Ruang Kerja Unit Terkait');
    setSupervisorName(schoolProfile.principalName);
    setStatus('TERJADWAL');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (sch: SupervisionSchedule) => {
    setEditingSchedule(sch);
    setUnitId(sch.unitId);
    setPlannedDate(sch.plannedDate);
    setTime(sch.time);
    setVenue(sch.venue);
    setSupervisorName(sch.supervisorName);
    setStatus(sch.status);
    setNotes(sch.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find((u) => u.id === unitId) || units[0];

    if (editingSchedule) {
      updateSchedule({
        ...editingSchedule,
        unitId,
        unitName: targetUnit.name,
        leaderName: targetUnit.leaderName,
        plannedDate,
        time,
        venue,
        supervisorName,
        status,
        notes,
      });
    } else {
      addSchedule({
        unitId,
        unitName: targetUnit.name,
        leaderName: targetUnit.leaderName,
        plannedDate,
        time,
        venue,
        supervisorName,
        status,
        notes,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Agenda Kegiatan Pengawasan
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Jadwal Supervisi Manajerial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penetapan tanggal, waktu, ruangan, dan pembagian penugasan supervisi seluruh unit kerja.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* Schedules List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                    Unit Yang Disupervisi:
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                    {sch.unitName}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      sch.status === 'SELESAI'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : sch.status === 'DITUNDA'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-blue-50 text-blue-700 border-blue-300'
                    }`}
                  >
                    {sch.status}
                  </span>

                  <button
                    onClick={() => openEditModal(sch)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSchedule(sch.id)}
                    className="p-1 rounded-lg hover:bg-rose-50 text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{sch.plannedDate}</span>
                  <span className="text-slate-400 font-mono">({sch.time})</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{sch.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Petugas: <strong>{sch.supervisorName}</strong></span>
                </div>

                {sch.notes && (
                  <p className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 italic mt-2 border border-slate-100">
                    "{sch.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">PIC: {sch.leaderName}</span>
              <button
                onClick={() => {
                  setSelectedUnitForSupervision(sch.unitId);
                  setActiveMenu('pelaksanaan');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                <span>Mulai Penilaian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSchedule ? 'Edit Jadwal Supervisi' : 'Tambah Jadwal Supervisi Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Unit Kerja:</label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Kegiatan:</label>
                  <input
                    type="date"
                    required
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Waktu Pelaksanaan:</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:30 - 10:30 WIB"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi / Ruangan:</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Ruang Rapat / Ruang Unit Kerja"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Petugas Supervisi:</label>
                <input
                  type="text"
                  required
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status Jadwal:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="TERJADWAL">TERJADWAL</option>
                  <option value="SELESAI">SELESAI</option>
                  <option value="DITUNDA">DITUNDA</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Khusus / Fokus Bukti Fisik:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Fokus pemeriksaan pada buku agenda, kelengkapan SOP..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
