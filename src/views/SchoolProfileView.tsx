import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolProfile } from '../types';
import {
  School,
  Save,
  CheckCircle,
  Building,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Award,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  FileCheck,
  Sparkles
} from 'lucide-react';

const DEFAULT_GOV_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="%23fff" stroke="%231e3a8a" stroke-width="4"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23d97706" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M50 16 L53 26 L64 26 L55 33 L58 43 L50 37 L42 43 L45 33 L36 26 L47 26 Z" fill="%23d97706"/><path d="M50 35 C38 42 30 54 28 68 C35 66 45 68 50 78 C55 68 65 66 72 68 C70 54 62 42 50 35 Z" fill="%231e3a8a"/><path d="M50 48 L46 62 L50 60 L54 62 Z" fill="%23f59e0b"/><text x="50" y="87" font-size="7" font-weight="bold" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">TUT WURI</text><text x="50" y="94" font-size="6" font-weight="bold" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">HANDAYANI</text></svg>';

const DEFAULT_SCHOOL_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><path d="M50 8 L84 22 L84 56 C84 74 69 88 50 94 C31 88 16 74 16 56 L16 22 Z" fill="%231e3a8a" stroke="%23d97706" stroke-width="3"/><path d="M50 14 L78 26 L78 54 C78 69 66 81 50 86 C34 81 22 69 22 54 L22 26 Z" fill="%23ffffff"/><path d="M50 24 L52 30 L58 30 L53 34 L55 40 L50 36 L45 40 L47 34 L42 30 L48 30 Z" fill="%23d97706"/><path d="M30 64 C38 56 46 58 50 63 C54 58 62 56 70 64 C62 60 54 62 50 68 C46 62 38 60 30 64 Z" fill="%231e3a8a"/><rect x="48" y="44" width="4" height="16" fill="%23d97706"/><circle cx="50" cy="42" r="4" fill="%23ef4444"/><text x="50" y="78" font-size="7" font-weight="900" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">SMAN 1</text></svg>';

export const SchoolProfileView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, showNotification } = useApp();

  const [formData, setFormData] = useState<SchoolProfile>({
    ...schoolProfile,
    governmentLogoUrl: schoolProfile.governmentLogoUrl || DEFAULT_GOV_LOGO,
    schoolLogoUrl: schoolProfile.schoolLogoUrl || DEFAULT_SCHOOL_LOGO,
  });

  const govLogoInputRef = useRef<HTMLInputElement | null>(null);
  const schoolLogoInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGovLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showNotification('Ukuran berkas melebihi 3MB. Gunakan berkas gambar yang lebih kecil.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, governmentLogoUrl: result }));
          showNotification('Logo Dinas Pendidikan berhasil dimuat!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showNotification('Ukuran berkas melebihi 3MB. Gunakan berkas gambar yang lebih kecil.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, schoolLogoUrl: result, logoUrl: result }));
          showNotification('Logo Sekolah berhasil dimuat!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Konfigurasi Satuan Pendidikan
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Profil Sekolah &amp; Kop Surat Resmi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Data identitas sekolah, unggah logo resmi, legalitas NPSN, pimpinan satuan pendidikan, dan pengawas pembina.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>Simpan Profil &amp; Logo</span>
        </button>
      </div>

      {/* Real-time Kop Surat Preview with Both Logos */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Pratinjau Kop Surat Resmi Sekolah (Format Standar Kemdikbudristek):
          </span>
          <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Otomatis terpasang di Laporan Cetak, PDF, dan Word
          </span>
        </div>

        <div className="border-b-4 border-double border-slate-900 pb-4 pt-2">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Kiri: Dinas Pendidikan */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {formData.governmentLogoUrl ? (
                <img
                  src={formData.governmentLogoUrl}
                  alt="Logo Dinas Pendidikan"
                  className="w-18 h-18 object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-[10px] text-center p-1 bg-amber-50">
                  TUT WURI HANDAYANI
                </div>
              )}
            </div>

            {/* Teks Kop Surat Tengah */}
            <div className="text-center flex-1">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-800">
                PEMERINTAH PROVINSI • {formData.governmentDept.toUpperCase()}
              </p>
              <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight mt-0.5">
                {formData.schoolName}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5">
                NPSN: {formData.npsn} • Status Akreditasi: {formData.accreditation}
              </p>
              <p className="text-[11px] text-slate-600">
                Alamat: {formData.address}, {formData.city} {formData.postalCode} • Telp: {formData.phone}
              </p>
              <p className="text-[11px] text-slate-600">
                Website: {formData.website} • Pos-el: {formData.email}
              </p>
            </div>

            {/* Logo Kanan: Sekolah */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {formData.schoolLogoUrl || formData.logoUrl ? (
                <img
                  src={formData.schoolLogoUrl || formData.logoUrl}
                  alt="Logo Sekolah"
                  className="w-18 h-18 object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl border border-slate-400 flex items-center justify-center text-[10px] text-center font-bold text-slate-700 bg-slate-50">
                  LOGO SEKOLAH
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Khusus Unggah Logo Dinas Pendidikan & Logo Sekolah */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-500" />
            Fitur Unggah Logo Kop Surat Kedinasan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah logo Dinas Pendidikan (posisi kiri) dan Logo Resmi Sekolah (posisi kanan) dengan format gambar PNG, JPG, JPEG, SVG, atau WebP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: Unggah Logo Dinas Pendidikan */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Logo Dinas Pendidikan (Kiri Kop)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Posisi Kiri</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center p-2 shadow-inner shrink-0">
                  {formData.governmentLogoUrl ? (
                    <img
                      src={formData.governmentLogoUrl}
                      alt="Logo Dinas"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-800">
                    {formData.governmentLogoUrl ? 'Logo Dinas Terpasang' : 'Belum Ada Logo Dinas'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Format: PNG, JPG, SVG transparan. Maks. 3MB.
                  </p>
                  <p className="text-[10px] text-blue-700 font-medium">
                    Digunakan untuk Lambang Pemprov / Tut Wuri Handayani.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <input
                type="file"
                ref={govLogoInputRef}
                accept="image/*"
                onChange={handleGovLogoUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => govLogoInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unggah Logo Dinas</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, governmentLogoUrl: DEFAULT_GOV_LOGO }));
                    showNotification('Logo Dinas dikembalikan ke Tut Wuri Handayani default.');
                  }}
                  title="Gunakan Preset Tut Wuri Handayani"
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {formData.governmentLogoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, governmentLogoUrl: '' }));
                      showNotification('Logo Dinas dihapus.');
                    }}
                    title="Hapus Logo Dinas"
                    className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Unggah Logo Sekolah */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Logo Resmi Sekolah (Kanan Kop)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Posisi Kanan</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center p-2 shadow-inner shrink-0">
                  {formData.schoolLogoUrl || formData.logoUrl ? (
                    <img
                      src={formData.schoolLogoUrl || formData.logoUrl}
                      alt="Logo Sekolah"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-800">
                    {formData.schoolLogoUrl || formData.logoUrl ? 'Logo Sekolah Terpasang' : 'Belum Ada Logo Sekolah'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Format: PNG, JPG, SVG transparan. Maks. 3MB.
                  </p>
                  <p className="text-[10px] text-amber-700 font-medium">
                    Digunakan untuk Lambang resmi satuan pendidikan Anda.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <input
                type="file"
                ref={schoolLogoInputRef}
                accept="image/*"
                onChange={handleSchoolLogoUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => schoolLogoInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unggah Logo Sekolah</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, schoolLogoUrl: DEFAULT_SCHOOL_LOGO, logoUrl: DEFAULT_SCHOOL_LOGO }));
                    showNotification('Logo Sekolah dikembalikan ke Lambang Sekolah default.');
                  }}
                  title="Gunakan Preset Lambang Sekolah"
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {(formData.schoolLogoUrl || formData.logoUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, schoolLogoUrl: '', logoUrl: '' }));
                      showNotification('Logo Sekolah dihapus.');
                    }}
                    title="Hapus Logo Sekolah"
                    className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-xs">
        {/* Section 1: Data Identitas Sekolah */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            1. Identitas Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Resmi Sekolah:</label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nomor Pokok Sekolah Nasional (NPSN):</label>
              <input
                type="text"
                name="npsn"
                value={formData.npsn}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Jenjang Sekolah:</label>
              <select
                name="schoolLevel"
                value={formData.schoolLevel}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                <option value="SD">Sekolah Dasar (SD)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dinas Pembina / Lembaga:</label>
              <input
                type="text"
                name="governmentDept"
                value={formData.governmentDept}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Peringkat Akreditasi BAN-PDM:</label>
              <input
                type="text"
                name="accreditation"
                value={formData.accreditation}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran Aktif:</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Alamat & Kontak */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            2. Alamat dan Saluran Komunikasi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kota / Kabupaten:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nomor Telepon Kantor:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Pos-el / Email Dinas:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Alamat Website Sekolah:</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pimpinan & Pengawas */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            3. Pimpinan Satuan Pendidikan &amp; Pengawas Sekolah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Kepala Sekolah:</label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">NIP Kepala Sekolah:</label>
              <input
                type="text"
                name="principalNip"
                value={formData.principalNip}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Pangkat / Golongan Ruang:</label>
              <input
                type="text"
                name="principalRank"
                value={formData.principalRank}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Pengawas Pembina:</label>
              <input
                type="text"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">NIP Pengawas Pembina:</label>
              <input
                type="text"
                name="supervisorNip"
                value={formData.supervisorNip}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Simpan Perubahan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
};
