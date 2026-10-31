import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Database,
  Info,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    schoolProfile,
    exportBackupJson,
    importBackupJson,
    resetToDefaultData,
    units,
    supervisionSessions,
    rtlItems,
    showNotification
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importBackupJson(content);
          if (success) {
            e.target.value = '';
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        'PERINGATAN: Apakah Anda yakin ingin mereset seluruh data ke setelan awal pabrikan (percontohan)? Seluruh perubahan terbaru akan dikembalikan ke data percontohan standar.'
      )
    ) {
      resetToDefaultData();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Konfigurasi Sistem &amp; Keamanan Data
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Pengaturan &amp; Pencadangan Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencadangan berkas JSON, pemulihan database, setelan default, dan informasi regulasi supervisi manajerial.
          </p>
        </div>
      </div>

      {/* Backup & Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Backup Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Cadangkan Data (Export JSON)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unduh salinan lengkap seluruh basis data (profil sekolah, 15 unit kerja, instrumen, hasil supervisi, RTL, dan arsip) ke dalam berkas JSON mandiri.
            </p>
          </div>

          <button
            onClick={exportBackupJson}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Unduh File Cadangan JSON</span>
          </button>
        </div>

        {/* Import Backup Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Pulihkan Data (Import JSON)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pulihkan database aplikasi dari berkas cadangan JSON yang telah disimpan sebelumnya. Sistem akan memperbarui data secara instan.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Pilih File Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Reset Default Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Reset Data Percontohan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mengembalikan seluruh data ke setelan bawaan simulasi (15 unit, 10 supervisi selesai, nilai kurikulum 94, sarpras 76, dsb).
            </p>
          </div>

          <button
            onClick={handleResetConfirm}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Setelan Bawaan</span>
          </button>
        </div>
      </div>

      {/* System Architecture & Regulation Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-200 pb-3">
          <ShieldCheck className="w-5 h-5 text-blue-700" />
          Landasan Hukum &amp; Standar Supervisi Manajerial Sekolah di Indonesia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-300 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Undang-Undang RI</span>
            <h4 className="font-bold text-slate-900 text-xs">UU Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional (Sisdiknas)</h4>
            <p className="text-[11px] text-slate-600">
              Landasan yuridis tertinggi sistem pendidikan nasional, khususnya Pasal 51 ayat (1) mengenai tata kelola satuan pendidikan anak usia dini, pendidikan dasar, dan menengah berbasis Manajemen Berbasis Sekolah (MBS) yang berprinsip pada kemandirian, kemitraan, partisipasi, keterbukaan, dan akuntabilitas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-300 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Peraturan Pemerintah RI</span>
            <h4 className="font-bold text-slate-900 text-xs">PP Nomor 4 Tahun 2022 tentang Perubahan atas PP Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan</h4>
            <p className="text-[11px] text-slate-600">
              Landasan penyempurnaan 8 Standar Nasional Pendidikan (SNP) dalam tata kelola manajerial, perencanaan berbasis data (Rapor Pendidikan), pemenuhan sarana prasarana, kompetensi pendidik dan tenaga kependidikan, transparansi pembiayaan, serta penjaminan mutu internal sekolah.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-300 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Peraturan Menteri</span>
            <h4 className="font-bold text-slate-900 text-xs">Permendikbud No. 15 Tahun 2018</h4>
            <p className="text-[11px] text-slate-600">
              Tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas Sekolah, yang menegaskan fungsi pokok Kepala Sekolah sepenuhnya dalam tugas manajerial, pengembangan kewirausahaan, dan supervisi kepada guru serta tenaga kependidikan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-300 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Peraturan Menteri</span>
            <h4 className="font-bold text-slate-900 text-xs">Permendikbudristek No. 46 Tahun 2023</h4>
            <p className="text-[11px] text-slate-600">
              Tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP), menjadi dasar wajib pengawasan dan instrumen supervisi Bidang Kesiswaan melalui pembentukan, keaktifan kanal aduan, dan program Tim TPPK.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-300 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Standar Pengelolaan</span>
            <h4 className="font-bold text-slate-900 text-xs">Siklus Penjaminan Mutu &amp; Standar Pengelolaan</h4>
            <p className="text-[11px] text-slate-600">
              Pelaksanaan penjaminan mutu internal satuan pendidikan mencakup siklus perencanaan program kerja (RKAS/KOSP), pelaksanaan terukur, supervisi objektif berbasis bukti fisik, evaluasi diri, dan tindak lanjut terukur (RTL).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-blue-300 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Arsitektur Sistem</span>
            <h4 className="font-bold text-slate-900 text-xs">Arsitektur Full-Stack &amp; AI Integration</h4>
            <p className="text-[11px] text-slate-600">
              Aplikasi ASKIA dikembangkan menggunakan Express.js, TypeScript, React 19, Tailwind CSS, LocalStorage persistence, dan Google Gemini 3.8 Flash SDK untuk analisis manajerial otomatis serta perumusan rekomendasi perbaikan berbasis data empiris.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
