import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupervisionProgram } from '../types';
import {
  CalendarDays,
  Target,
  Clock,
  CheckCircle,
  FileText,
  Save,
  Building2,
  Calendar
} from 'lucide-react';

export const ProgramsView: React.FC = () => {
  const { program, updateProgram, units, schoolProfile, showNotification } = useApp();

  const [formData, setFormData] = useState<SupervisionProgram>({ ...program });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProgram(formData);
  };

  const completedCount = units.filter((u) => u.isSupervised).length;
  const progressPercent = Number(((completedCount / units.length) * 100).toFixed(1));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Perencanaan Supervisi Manajerial
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Program Kerja Supervisi Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumen rencana pengawasan mutu, linimasa pelaksanaan, dan sasaran 15 unit kerja semesteran.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>Simpan Program</span>
        </button>
      </div>

      {/* Progress Metric Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              {formData.status} • T.A. {formData.academicYear}
            </span>
            <h2 className="text-xl font-extrabold mt-2 text-white">{formData.title}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {formData.objective}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center shrink-0">
            <span className="text-[11px] text-slate-400 block">Ketercapaian Target Supervisi:</span>
            <span className="text-3xl font-black text-amber-300">{progressPercent}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{completedCount} dari {units.length} Unit Selesai</span>
          </div>
        </div>
      </div>

      {/* Form Editor */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Judul Program Supervisi Manajerial:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tahun Pelajaran:</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Semester:</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            >
              <option value="1">Semester 1 (Ganjil)</option>
              <option value="2">Semester 2 (Genap)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Status Program:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
            >
              <option value="AKTIF">AKTIF - Sedang Berjalan</option>
              <option value="SELESAI">SELESAI</option>
              <option value="DRAF">DRAF</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tanggal Mulai Pelaksanaan:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Batas Akhir Selesai:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Tujuan &amp; Sasaran Strategis Supervisi:</label>
          <textarea
            rows={4}
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
          >
            Simpan Perubahan Program
          </button>
        </div>
      </form>
    </div>
  );
};
