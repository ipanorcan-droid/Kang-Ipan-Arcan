import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigitalArchive } from '../types';
import {
  FolderArchive,
  Upload,
  Search,
  Filter,
  FileText,
  Image,
  FileSpreadsheet,
  FileCode,
  Trash2,
  Download,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const DigitalArchivesView: React.FC = () => {
  const { digitalArchives, addArchive, deleteArchive, units, schoolProfile, currentUser, showNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DigitalArchive['category']>('BUKTI_SUPERVISI');
  const [fileType, setFileType] = useState<DigitalArchive['fileType']>('PDF');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [notes, setNotes] = useState('');

  const handleOpenUpload = () => {
    setTitle('');
    setUnitId(units[0]?.id || '');
    setCategory('BUKTI_SUPERVISI');
    setFileType('PDF');
    setFileName('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSimulatedFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);

      if (file.name.endsWith('.pdf')) setFileType('PDF');
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) setFileType('EXCEL');
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) setFileType('WORD');
      else if (file.type.startsWith('image/')) setFileType('IMAGE');

      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find((u) => u.id === unitId) || units[0];

    addArchive({
      unitId,
      unitName: targetUnit.name,
      title: title || 'Dokumen Bukti Fisik',
      category,
      fileType,
      fileName: fileName || `${title.replace(/\s+/g, '_')}.${fileType.toLowerCase()}`,
      fileSize: fileSize || '1.8 MB',
      academicYear: schoolProfile.academicYear,
      semester: schoolProfile.activeSemester,
      uploadedBy: currentUser.fullName,
      notes,
    });
    setIsModalOpen(false);
  };

  const filtered = digitalArchives.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = unitFilter === 'ALL' || a.unitId === unitFilter;
    const matchesType = typeFilter === 'ALL' || a.fileType === typeFilter;
    return matchesSearch && matchesUnit && matchesType;
  });

  const getFileIcon = (type: DigitalArchive['fileType']) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'EXCEL':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'WORD':
        return <FileCode className="w-5 h-5 text-blue-600" />;
      case 'IMAGE':
        return <Image className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Repositori Dokumen &amp; Portofolio Mutu
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Arsip Digital Bukti Fisik Supervisi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyimpanan terpusat dokumen SK, KOSP, SOP, foto kegiatan, SPJ keuangan, dan bukti tindak lanjut.
          </p>
        </div>

        <button
          onClick={handleOpenUpload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Unggah Berkas Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama berkas, judul, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
            />
          </div>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Unit Kerja</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Format File</option>
            <option value="PDF">Dokumen PDF</option>
            <option value="EXCEL">Spreadsheet Excel</option>
            <option value="WORD">Dokumen Word</option>
            <option value="IMAGE">Foto / Gambar Bukti Fisik</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Total <strong>{filtered.length}</strong> Arsip Tersimpan
        </span>
      </div>

      {/* Archives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((arc) => (
          <div
            key={arc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getFileIcon(arc.fileType)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase block tracking-wider">
                      {arc.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                      {arc.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => deleteArchive(arc.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <p className="text-slate-700 font-semibold truncate">{arc.unitName}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{arc.fileName}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Ukuran: {arc.fileSize}</span>
                  <span>Diunggah: {arc.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                Oleh: {arc.uploadedBy}
              </span>

              <button
                onClick={() => showNotification(`Mengunduh berkas "${arc.fileName}"...`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Unggah Dokumen Bukti Fisik Digital
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* File Drop Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-amber-500 transition-colors bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Pilih Berkas Komputer / Smartphone</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Mendukung PDF, Foto JPG/PNG, Excel (.xlsx), Word (.docx)</p>
                <input
                  type="file"
                  onChange={handleSimulatedFileSelect}
                  className="mt-3 block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Keterangan Dokumen:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kalender Pendidikan Resmi T.A. 2024/2025"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Pemilik Berkas:</label>
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Bukti Fisik:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="BUKTI_SUPERVISI">Bukti Fisik Supervisi</option>
                    <option value="BUKTI_RTL">Bukti Pelaksanaan RTL</option>
                    <option value="SOP">Standar Operasional (SOP)</option>
                    <option value="SK_TUGAS">Surat Keputusan (SK)</option>
                    <option value="LAPORAN_UNIT">Laporan Kinerja Unit</option>
                  </select>
                </div>
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
                  Simpan ke Arsip Digital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
