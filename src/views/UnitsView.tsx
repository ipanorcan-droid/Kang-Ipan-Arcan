import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UnitWork, UnitCategory } from '../types';
import {
  Network,
  Plus,
  Search,
  Filter,
  Building2,
  User,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  ArrowRight,
  ClipboardPen
} from 'lucide-react';

export const UnitsView: React.FC = () => {
  const {
    units,
    addUnit,
    updateUnit,
    deleteUnit,
    setActiveMenu,
    setSelectedUnitForSupervision
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitWork | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<UnitCategory>('BIDANG');
  const [leaderName, setLeaderName] = useState('');
  const [leaderNip, setLeaderNip] = useState('');
  const [leaderPosition, setLeaderPosition] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingUnit(null);
    setCode('UNIT-NEW');
    setName('');
    setCategory('BIDANG');
    setLeaderName('');
    setLeaderNip('');
    setLeaderPosition('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: UnitWork) => {
    setEditingUnit(u);
    setCode(u.code);
    setName(u.name);
    setCategory(u.category);
    setLeaderName(u.leaderName);
    setLeaderNip(u.leaderNip);
    setLeaderPosition(u.leaderPosition);
    setDescription(u.description);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUnit) {
      updateUnit({
        ...editingUnit,
        code,
        name,
        category,
        leaderName,
        leaderNip,
        leaderPosition,
        description,
      });
    } else {
      addUnit({
        code,
        name,
        category,
        leaderName,
        leaderNip,
        leaderPosition,
        description,
      });
    }
    setIsModalOpen(false);
  };

  const filtered = units.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || u.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Struktur Organisasi &amp; Manajemen Sekolah
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Data 15 Unit Kerja Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh unit yang disupervisi manajerial, penanggung jawab, dan instrumen tupoksi.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Unit Kerja Baru</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari unit atau pejabat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Bidang / Kategori</option>
            <option value="PIMPINAN">Pimpinan &amp; Penjaminan Mutu</option>
            <option value="BIDANG">Bidang Wakasek</option>
            <option value="LAYANAN_AKADEMIK">Layanan Akademik &amp; Lab</option>
            <option value="TATA_USAHA">Tata Usaha &amp; Keuangan</option>
            <option value="LAYANAN_KHUSUS">Layanan Khusus &amp; Sarana</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Menampilkan <strong>{filtered.length}</strong> dari 15 Unit Kerja
        </span>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((unit, index) => (
          <div
            key={unit.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {unit.code}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(unit)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                    title="Edit Unit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteUnit(unit.id)}
                    className="p-1 rounded-lg hover:bg-rose-50 text-rose-500"
                    title="Hapus Unit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mt-2 leading-snug">
                {unit.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {unit.description}
              </p>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <div className="text-slate-700 font-semibold truncate">{unit.leaderName}</div>
                <div className="text-[10px] text-slate-400 font-mono">NIP. {unit.leaderNip}</div>
                <div className="text-[11px] text-slate-500 truncate">{unit.leaderPosition}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                {unit.isSupervised ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm font-mono">{unit.score}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {unit.categoryGrade?.replace('_', ' ')}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                    Belum Disupervisi
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedUnitForSupervision(unit.id);
                  setActiveMenu('pelaksanaan');
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                <span>{unit.isSupervised ? 'Lihat Nilai' : 'Nilai Sekarang'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Unit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingUnit ? 'Edit Data Unit Kerja' : 'Tambah Unit Kerja Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Unit:</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="WKS-KUR"
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nama Unit Kerja:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Wakil Kepala Sekolah Bidang..."
                    className="w-full p-2 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori / Bidang:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="PIMPINAN">Pimpinan &amp; Penjaminan Mutu</option>
                  <option value="BIDANG">Bidang Wakasek</option>
                  <option value="LAYANAN_AKADEMIK">Layanan Akademik &amp; Lab</option>
                  <option value="TATA_USAHA">Tata Usaha &amp; Keuangan</option>
                  <option value="LAYANAN_KHUSUS">Layanan Khusus &amp; Sarana</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Penanggung Jawab:</label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="Nama lengkap & gelar"
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP Penanggung Jawab:</label>
                  <input
                    type="text"
                    required
                    value={leaderNip}
                    onChange={(e) => setLeaderNip(e.target.value)}
                    placeholder="19800101 200501 1 001"
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jabatan Resmi / Tugas Tambahan:</label>
                <input
                  type="text"
                  value={leaderPosition}
                  onChange={(e) => setLeaderPosition(e.target.value)}
                  placeholder="Koordinator TPMPS / Kepala Bagian..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Tugas Pokok &amp; Fungsi:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ringkasan tupoksi manajerial unit..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
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
                  Simpan Unit Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
