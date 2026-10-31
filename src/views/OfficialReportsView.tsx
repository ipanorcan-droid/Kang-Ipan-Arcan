import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Building2,
  Calendar,
  CheckCircle,
  Award,
  Download,
  Filter,
  Eye,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';

const DEFAULT_GOV_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="%23fff" stroke="%231e3a8a" stroke-width="4"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23d97706" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M50 16 L53 26 L64 26 L55 33 L58 43 L50 37 L42 43 L45 33 L36 26 L47 26 Z" fill="%23d97706"/><path d="M50 35 C38 42 30 54 28 68 C35 66 45 68 50 78 C55 68 65 66 72 68 C70 54 62 42 50 35 Z" fill="%231e3a8a"/><path d="M50 48 L46 62 L50 60 L54 62 Z" fill="%23f59e0b"/><text x="50" y="87" font-size="7" font-weight="bold" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">TUT WURI</text><text x="50" y="94" font-size="6" font-weight="bold" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">HANDAYANI</text></svg>';

const DEFAULT_SCHOOL_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><path d="M50 8 L84 22 L84 56 C84 74 69 88 50 94 C31 88 16 74 16 56 L16 22 Z" fill="%231e3a8a" stroke="%23d97706" stroke-width="3"/><path d="M50 14 L78 26 L78 54 C78 69 66 81 50 86 C34 81 22 69 22 54 L22 26 Z" fill="%23ffffff"/><path d="M50 24 L52 30 L58 30 L53 34 L55 40 L50 36 L45 40 L47 34 L42 30 L48 30 Z" fill="%23d97706"/><path d="M30 64 C38 56 46 58 50 63 C54 58 62 56 70 64 C62 60 54 62 50 68 C46 62 38 60 30 64 Z" fill="%231e3a8a"/><rect x="48" y="44" width="4" height="16" fill="%23d97706"/><circle cx="50" cy="42" r="4" fill="%23ef4444"/><text x="50" y="78" font-size="7" font-weight="900" fill="%231e3a8a" text-anchor="middle" font-family="sans-serif">SMAN 1</text></svg>';

export const OfficialReportsView: React.FC = () => {
  const {
    schoolProfile,
    updateSchoolProfile,
    units,
    supervisionSessions,
    rtlItems,
    selectedUnitForSupervision,
    setSelectedUnitForSupervision,
    showNotification
  } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    selectedUnitForSupervision || 'unit-kurikulum'
  );
  const [reportType, setReportType] = useState<'PER_UNIT' | 'REKAP_SEMUA' | 'RTL_REKAP'>('PER_UNIT');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const govLogoInputRef = useRef<HTMLInputElement | null>(null);
  const schoolLogoInputRef = useRef<HTMLInputElement | null>(null);

  const handleGovLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showNotification('Ukuran berkas melebihi 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateSchoolProfile({ ...schoolProfile, governmentLogoUrl: result });
          showNotification('Logo Dinas Pendidikan berhasil diperbarui di Kop Surat!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showNotification('Ukuran berkas melebihi 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateSchoolProfile({ ...schoolProfile, schoolLogoUrl: result, logoUrl: result });
          showNotification('Logo Sekolah berhasil diperbarui di Kop Surat!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const session = supervisionSessions.find((s) => s.unitId === selectedUnitId);
  const unitRtls = rtlItems.filter((r) => r.unitId === selectedUnitId);

  // Print PDF trigger
  const handlePrint = () => {
    window.print();
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'REKAP_SEMUA') {
      csvContent += `LAPORAN REKAPITULASI HASIL SUPERVISI MANAJERIAL\n`;
      csvContent += `SEKOLAH: ${schoolProfile.schoolName}\n`;
      csvContent += `TAHUN AJARAN: ${schoolProfile.academicYear} - SEMESTER ${schoolProfile.activeSemester}\n\n`;
      csvContent += `No,Kode,Unit Kerja,Kategori,Penanggung Jawab,NIP,Status,Nilai,Predikat,RTL Pending\n`;

      units.forEach((u, idx) => {
        csvContent += `"${idx + 1}","${u.code}","${u.name}","${u.category}","${u.leaderName}","'${u.leaderNip}'","${
          u.isSupervised ? 'Selesai' : 'Belum'
        }","${u.score || '-'}","${u.categoryGrade || '-'}","${u.pendingRtlCount}"\n`;
      });
    } else {
      csvContent += `LAPORAN HASIL SUPERVISI MANAJERIAL UNIT KERJA\n`;
      csvContent += `UNIT: ${selectedUnit.name}\n`;
      csvContent += `PENANGGUNG JAWAB: ${selectedUnit.leaderName} (NIP: '${selectedUnit.leaderNip}')\n`;
      csvContent += `NILAI AKHIR: ${session?.finalScore || selectedUnit.score || 0}\n`;
      csvContent += `PREDIKAT: ${session?.categoryGrade || selectedUnit.categoryGrade || '-'}\n\n`;
      csvContent += `Aspek,Kode Indikator,Nama Indikator,Skor (1-4),Status,Catatan Pengamatan,Rekomendasi\n`;

      if (session && session.aspects) {
        session.aspects.forEach((asp) => {
          asp.indicators.forEach((ind) => {
            csvContent += `"${asp.name}","${ind.code}","${ind.name}","${ind.score}","${ind.status}","${
              ind.observerNote || ''
            }","${ind.recommendation || ''}"\n`;
          });
        });
      }
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Laporan_Supervisi_${reportType}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Data laporan berhasil diekspor ke format Excel (CSV)!');
  };

  // Export to Word (.doc formatted)
  const handleExportWord = () => {
    const reportHtml = document.getElementById('official-report-document')?.innerHTML || '';
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>Laporan Supervisi Manajerial</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; }
      th, td { border: 1px solid #000; padding: 6pt; text-align: left; }
      th { background-color: #f2f2f2; font-weight: bold; }
      .kop-table { border: none !important; margin-bottom: 15pt; }
      .kop-table td { border: none !important; }
      .text-center { text-align: center; }
      .font-bold { font-weight: bold; }
    </style>
    </head><body>`;
    const footer = `</body></html>`;
    const sourceHtml = header + reportHtml + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHtml);
    const fileDownload = document.createElement('a');
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Laporan_Supervisi_${selectedUnit.code}_${new Date().toISOString().split('T')[0]}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    showNotification('Laporan resmi berhasil diekspor ke format dokumen Word (.doc)!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Controls Bar (Hidden during print) */}
      <div className="print:hidden bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Format Pelaporan Resmi Sekolah
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Laporan Hasil Supervisi Manajerial
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumen resmi lengkap dengan Kop Sekolah, Rubrik Penilaian, Rekomendasi, RTL, dan Lembar Pengesahan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Report Type Selector */}
          <div className="flex items-center gap-2">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="PER_UNIT">Laporan Per Unit Kerja</option>
              <option value="REKAP_SEMUA">Rekapitulasi Seluruh 15 Unit</option>
              <option value="RTL_REKAP">Laporan Rencana Tindak Lanjut (RTL)</option>
            </select>

            {reportType === 'PER_UNIT' && (
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  setSelectedUnitId(e.target.value);
                  setSelectedUnitForSupervision(e.target.value);
                }}
                className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.isSupervised ? `(Nilai: ${u.score})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Logo Kop Surat Button & Export Buttons */}
          <button
            onClick={() => setIsLogoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Logo Kop Surat</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Ekspor Word</span>
          </button>
        </div>
      </div>

      {/* Official Printable Document Container */}
      <div
        id="official-report-document"
        className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/80 shadow-lg text-slate-900 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {/* Kop Surat Resmi Sekolah (Kemdikbudristek style) */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Kiri: Dinas Pendidikan / Pemprov */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {schoolProfile.governmentLogoUrl ? (
                <img
                  src={schoolProfile.governmentLogoUrl}
                  alt="Logo Dinas Pendidikan"
                  className="w-18 h-18 object-contain"
                />
              ) : (
                <div
                  onClick={() => setIsLogoModalOpen(true)}
                  className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-[10px] text-center p-1 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors"
                  title="Klik untuk unggah Logo Dinas Pendidikan"
                >
                  TUT WURI HANDAYANI
                </div>
              )}
            </div>

            <div className="text-center flex-1">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-800">
                PEMERINTAH PROVINSI • {schoolProfile.governmentDept.toUpperCase()}
              </p>
              <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight">
                {schoolProfile.schoolName}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5">
                NPSN: {schoolProfile.npsn} • Status Akreditasi: {schoolProfile.accreditation}
              </p>
              <p className="text-[11px] text-slate-600">
                Alamat: {schoolProfile.address}, {schoolProfile.city} {schoolProfile.postalCode} • Telp: {schoolProfile.phone}
              </p>
              <p className="text-[11px] text-slate-600">
                Website: {schoolProfile.website} • Pos-el: {schoolProfile.email}
              </p>
            </div>

            {/* Logo Kanan: Sekolah */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {schoolProfile.schoolLogoUrl || schoolProfile.logoUrl ? (
                <img
                  src={schoolProfile.schoolLogoUrl || schoolProfile.logoUrl}
                  alt="Logo Sekolah"
                  className="w-18 h-18 object-contain"
                />
              ) : (
                <div
                  onClick={() => setIsLogoModalOpen(true)}
                  className="w-14 h-14 rounded-xl border border-slate-400 flex items-center justify-center text-[10px] text-center font-bold text-slate-700 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                  title="Klik untuk unggah Logo Sekolah"
                >
                  LOGO SEKOLAH
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center my-6 space-y-1">
          <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 underline decoration-slate-900 underline-offset-4">
            {reportType === 'REKAP_SEMUA'
              ? 'REKAPITULASI HASIL SUPERVISI MANAJERIAL SEKOLAH'
              : reportType === 'RTL_REKAP'
              ? 'LAPORAN REKAPITULASI RENCANA TINDAK LANJUT (RTL) SUPERVISI'
              : 'LAPORAN HASIL SUPERVISI MANAJERIAL UNIT KERJA'}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Nomor: 421.3 / {selectedUnit.code} / SM / {schoolProfile.academicYear.replace('/', '-')}
          </p>
          <p className="text-xs text-slate-700 font-semibold">
            Tahun Ajaran {schoolProfile.academicYear} • Semester {schoolProfile.activeSemester === '1' ? 'Ganjil' : 'Genap'}
          </p>
        </div>

          {/* Content depending on report type */}
        {reportType === 'REKAP_SEMUA' ? (
          /* Rekap Seluruh Unit */
          <div className="space-y-6 text-xs text-slate-800">
            <p className="leading-relaxed">
              Berdasarkan amanat <strong>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional (Sisdiknas)</strong> dan <strong>Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan atas PP Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan</strong>, serta Program Pengawasan Manajerial Satuan Pendidikan Tahun Ajaran {schoolProfile.academicYear},
              berikut adalah rekapitulasi capaian kinerja manajerial terhadap 15 (lima belas) unit kerja di lingkungan {schoolProfile.schoolName}:
            </p>

            <table className="w-full border-collapse border border-slate-900 text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 text-center font-bold">
                  <th className="border border-slate-900 p-2 w-8">No</th>
                  <th className="border border-slate-900 p-2">Unit Kerja</th>
                  <th className="border border-slate-900 p-2">Penanggung Jawab</th>
                  <th className="border border-slate-900 p-2 w-16">Nilai</th>
                  <th className="border border-slate-900 p-2 w-28">Kategori</th>
                  <th className="border border-slate-900 p-2 w-20">RTL Aktif</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => (
                  <tr key={u.id} className="border-b border-slate-400">
                    <td className="border border-slate-900 p-2 text-center">{i + 1}</td>
                    <td className="border border-slate-900 p-2 font-semibold">{u.name}</td>
                    <td className="border border-slate-900 p-2">{u.leaderName}</td>
                    <td className="border border-slate-900 p-2 text-center font-bold font-mono">
                      {u.isSupervised ? u.score : '-'}
                    </td>
                    <td className="border border-slate-900 p-2 text-center">
                      {u.isSupervised ? u.categoryGrade?.replace('_', ' ') : 'Belum Disupervisi'}
                    </td>
                    <td className="border border-slate-900 p-2 text-center">{u.pendingRtlCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === 'RTL_REKAP' ? (
          /* Rekap RTL */
          <div className="space-y-6 text-xs text-slate-800">
            <p className="leading-relaxed">
              Daftar komitmen Rencana Tindak Lanjut (RTL) hasil supervisi manajerial yang wajib dituntaskan oleh masing-masing penanggung jawab unit:
            </p>

            <table className="w-full border-collapse border border-slate-900 text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 text-center font-bold">
                  <th className="border border-slate-900 p-2 w-8">No</th>
                  <th className="border border-slate-900 p-2">Unit Kerja</th>
                  <th className="border border-slate-900 p-2">Temuan &amp; Masalah</th>
                  <th className="border border-slate-900 p-2">Bentuk Tindak Lanjut</th>
                  <th className="border border-slate-900 p-2 w-20">Target Waktu</th>
                  <th className="border border-slate-900 p-2 w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {rtlItems.map((r, i) => (
                  <tr key={r.id} className="border-b border-slate-400">
                    <td className="border border-slate-900 p-2 text-center">{i + 1}</td>
                    <td className="border border-slate-900 p-2 font-semibold">{r.unitName}</td>
                    <td className="border border-slate-900 p-2">{r.finding}</td>
                    <td className="border border-slate-900 p-2">{r.actionPlan}</td>
                    <td className="border border-slate-900 p-2 text-center">{r.targetDate}</td>
                    <td className="border border-slate-900 p-2 text-center font-semibold">
                      {r.status.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Laporan Per Unit Lengkap */
          <div className="space-y-6 text-xs text-slate-800">
            {/* Section A: Identitas Supervisi */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">
                A. IDENTITAS UNIT KERJA DAN PELAKSANAAN
              </h4>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1 w-44 font-semibold">1. Unit Kerja</td>
                    <td className="py-1">: <strong>{selectedUnit.name}</strong> ({selectedUnit.code})</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">2. Penanggung Jawab / Pejabat</td>
                    <td className="py-1">: {selectedUnit.leaderName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">3. NIP / NUPTK</td>
                    <td className="py-1 font-mono">: {selectedUnit.leaderNip}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">4. Jabatan / Tugas Tambahan</td>
                    <td className="py-1">: {selectedUnit.leaderPosition}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">5. Tanggal Pelaksanaan</td>
                    <td className="py-1">: {session?.date || selectedUnit.lastSupervisionDate || 'Terjadwal'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">6. Petugas Supervisi</td>
                    <td className="py-1">: {session?.supervisorName || schoolProfile.principalName} (Kepala Sekolah)</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold align-top">7. Landasan Hukum</td>
                    <td className="py-1 leading-relaxed text-[11px] text-slate-700">
                      : 1. UU No. 20 Tahun 2003 tentang Sisdiknas (Pasal 51 ayat 1 tentang MBS)<br />
                      &nbsp;&nbsp;2. PP No. 4 Tahun 2022 jo. PP No. 57 Tahun 2021 tentang Standar Nasional Pendidikan<br />
                      &nbsp;&nbsp;3. Permendikbud No. 15 Tahun 2018 tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section B: Hasil Penilaian Instrumen */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">
                B. REKAPITULASI HASIL PENILAIAN MANAJERIAL
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-center">
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Total Skor Diperoleh</span>
                  <span className="text-base font-extrabold text-slate-900">{session?.totalScoreEarned || '-'}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Skor Maksimal Valid</span>
                  <span className="text-base font-extrabold text-slate-900">{session?.maxPossibleScore || '-'}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Nilai Akhir (0-100)</span>
                  <span className="text-lg font-black text-blue-900">{session?.finalScore || selectedUnit.score || '-'}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Predikat Kategori</span>
                  <span className="text-xs font-black uppercase text-slate-900">
                    {session?.categoryGrade?.replace('_', ' ') || selectedUnit.categoryGrade || '-'}
                  </span>
                </div>
              </div>

              {/* Aspects and Indicators Table */}
              {session?.aspects && session.aspects.length > 0 && (
                <table className="w-full border-collapse border border-slate-900 text-[11px] mt-2">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-900 font-bold text-center">
                      <th className="border border-slate-900 p-2 w-8">No</th>
                      <th className="border border-slate-900 p-2">Aspek dan Indikator Penilaian</th>
                      <th className="border border-slate-900 p-2 w-14">Skor</th>
                      <th className="border border-slate-900 p-2 w-20">Keterpenuhan</th>
                      <th className="border border-slate-900 p-2">Catatan Pengamatan &amp; Bukti Fisik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.aspects.map((asp, aIdx) => (
                      <React.Fragment key={asp.id}>
                        <tr className="bg-slate-50 font-bold border-b border-slate-800">
                          <td colSpan={5} className="border border-slate-900 p-1.5 text-slate-900">
                            {String.fromCharCode(65 + aIdx)}. {asp.name}
                          </td>
                        </tr>
                        {asp.indicators.map((ind, iIdx) => (
                          <tr key={ind.id} className="border-b border-slate-300">
                            <td className="border border-slate-900 p-1.5 text-center">{iIdx + 1}</td>
                            <td className="border border-slate-900 p-1.5">
                              <span className="font-semibold">{ind.name}</span>
                              <p className="text-[10px] text-slate-600 mt-0.5">{ind.description}</p>
                            </td>
                            <td className="border border-slate-900 p-1.5 text-center font-bold">
                              {ind.status === 'NA' ? 'N/A' : ind.score}
                            </td>
                            <td className="border border-slate-900 p-1.5 text-center text-[10px]">
                              {ind.status === 'FULFILLED'
                                ? 'Terpenuhi'
                                : ind.status === 'PARTIAL'
                                ? 'Sebagian'
                                : ind.status === 'NOT_MET'
                                ? 'Belum'
                                : 'N/A'}
                            </td>
                            <td className="border border-slate-900 p-1.5 text-[10px]">
                              {ind.observerNote || ind.physicalEvidence}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Section C: Temuan & Catatan Supervisi */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">
                C. CATATAN PENGAMATAN DAN TEMUAN KHUSUS
              </h4>
              <p className="p-3 bg-slate-50 border border-slate-300 rounded leading-relaxed text-xs">
                {session?.generalNotes ||
                  'Secara umum tata kelola unit kerja telah berjalan sesuai mekanisme standar. Terdapat beberapa hal yang perlu ditingkatkan terkait kerapian pelaporan digital dan pemenuhan sarana penunjang.'}
              </p>
            </div>

            {/* Section D: Rekomendasi Kepala Sekolah */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">
                D. REKOMENDASI KEPALA SEKOLAH
              </h4>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded leading-relaxed text-xs whitespace-pre-line">
                {session?.generalRecommendations ||
                  '1. Segera laksanakan rapat koordinasi internal untuk menyusun rencana tindak lanjut terukur.\n2. Lengkapi berkas portofolio bukti fisik yang masih berstatus sebagian.\n3. Laporkan progres penyelesaian paling lambat 14 hari kerja.'}
              </div>
            </div>

            {/* Section E: Rencana Tindak Lanjut Unit Ini */}
            {unitRtls.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  E. MATRIKS RENCANA TINDAK LANJUT (RTL) UNIT
                </h4>
                <table className="w-full border-collapse border border-slate-900 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-900 text-center font-bold">
                      <th className="border border-slate-900 p-1.5">Indikator</th>
                      <th className="border border-slate-900 p-1.5">Temuan / Masalah</th>
                      <th className="border border-slate-900 p-1.5">Kegiatan Tindak Lanjut</th>
                      <th className="border border-slate-900 p-1.5 w-20">Target Waktu</th>
                      <th className="border border-slate-900 p-1.5 w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitRtls.map((r) => (
                      <tr key={r.id} className="border-b border-slate-300">
                        <td className="border border-slate-900 p-1.5 font-semibold">{r.indicatorName}</td>
                        <td className="border border-slate-900 p-1.5">{r.finding}</td>
                        <td className="border border-slate-900 p-1.5">{r.actionPlan}</td>
                        <td className="border border-slate-900 p-1.5 text-center">{r.targetDate}</td>
                        <td className="border border-slate-900 p-1.5 text-center font-semibold">
                          {r.status.replace('_', ' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Lembar Pengesahan / Tanda Tangan Resmi (2 Kolom) */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-xs text-slate-900">
          <div className="text-right mb-6">
            <p>
              {schoolProfile.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center">
            {/* Penanggung Jawab Unit */}
            <div>
              <p className="text-slate-600">Penanggung Jawab Unit Kerja,</p>
              <div className="h-20 flex items-center justify-center font-serif italic text-slate-400">
                [Tanda Tangan Digital]
              </div>
              <p className="font-bold underline text-slate-900">{selectedUnit.leaderName}</p>
              <p className="font-mono text-[11px] text-slate-700">NIP. {selectedUnit.leaderNip}</p>
              <p className="text-[10px] text-slate-500">{selectedUnit.leaderPosition}</p>
            </div>

            {/* Kepala Sekolah */}
            <div>
              <p className="text-slate-600">Kepala Satuan Pendidikan,</p>
              <div className="h-20 flex items-center justify-center relative">
                {/* Simulated Official Seal Stamp */}
                <div className="absolute left-6 sm:left-12 w-20 h-20 rounded-full border-2 border-dashed border-blue-800/35 flex items-center justify-center text-[9px] text-blue-900 font-bold uppercase rotate-12 pointer-events-none select-none">
                  CAP SEKOLAH
                </div>
                <span className="font-serif italic text-slate-400 text-xs">
                  [Tanda Tangan Digital]
                </span>
              </div>
              <p className="font-bold underline text-slate-900">{schoolProfile.principalName}</p>
              <p className="font-mono text-[11px] text-slate-700">NIP. {schoolProfile.principalNip}</p>
              <p className="text-[10px] text-slate-500">{schoolProfile.principalRank}</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-500">
            Dokumen ini diterbitkan secara otomatis oleh Aplikasi ASKIA (Supervisi Manajerial Sekolah) dan memiliki kekuatan bukti penjaminan mutu satuan pendidikan.
          </div>
        </div>
      </div>

      {/* Modal Unggah Logo Kop Surat */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">Unggah Logo Kop Surat Resmi</h3>
                  <p className="text-[11px] text-slate-300">Sesuaikan Logo Dinas Pendidikan (Kiri) dan Logo Sekolah (Kanan)</p>
                </div>
              </div>
              <button
                onClick={() => setIsLogoModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns for 2 Logos */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Preview Kop Saat Ini */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Pratinjau Kop Surat Langsung</span>
                <div className="flex items-center justify-between gap-4 p-3 bg-white border border-slate-200 rounded-lg">
                  {/* Logo Kiri */}
                  <div className="w-16 h-16 flex items-center justify-center p-1 border border-slate-200 rounded bg-slate-50 shrink-0">
                    {schoolProfile.governmentLogoUrl ? (
                      <img
                        src={schoolProfile.governmentLogoUrl}
                        alt="Logo Dinas"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] text-slate-400 text-center font-bold">TIDAK ADA LOGO</span>
                    )}
                  </div>

                  {/* Header Teks Mini */}
                  <div className="text-center flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-slate-600 truncate">{schoolProfile.governmentDept.toUpperCase()}</p>
                    <p className="text-[11px] font-black text-slate-900 truncate">{schoolProfile.schoolName.toUpperCase()}</p>
                    <p className="text-[8px] text-slate-500 truncate">NPSN: {schoolProfile.npsn} • Akreditasi: {schoolProfile.accreditation}</p>
                  </div>

                  {/* Logo Kanan */}
                  <div className="w-16 h-16 flex items-center justify-center p-1 border border-slate-200 rounded bg-slate-50 shrink-0">
                    {schoolProfile.schoolLogoUrl || schoolProfile.logoUrl ? (
                      <img
                        src={schoolProfile.schoolLogoUrl || schoolProfile.logoUrl}
                        alt="Logo Sekolah"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] text-slate-400 text-center font-bold">TIDAK ADA LOGO</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid 2 Upload Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Logo Dinas Pendidikan (Kiri) */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center text-center space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>1. Logo Dinas Pendidikan (Kiri)</span>
                  </div>

                  <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                    {schoolProfile.governmentLogoUrl ? (
                      <img
                        src={schoolProfile.governmentLogoUrl}
                        alt="Logo Dinas"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={govLogoInputRef}
                    onChange={handleGovLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="w-full space-y-1.5">
                    <button
                      type="button"
                      onClick={() => govLogoInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Berkas Logo Dinas</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          updateSchoolProfile({ ...schoolProfile, governmentLogoUrl: DEFAULT_GOV_LOGO });
                          showNotification('Logo Tut Wuri Handayani bawaan diterapkan!');
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Tut Wuri Standar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateSchoolProfile({ ...schoolProfile, governmentLogoUrl: '' });
                          showNotification('Logo Dinas dihapus dari Kop Surat.');
                        }}
                        className="py-1.5 px-2 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-[10px] font-semibold text-rose-600 flex items-center justify-center gap-1 transition-colors"
                        title="Hapus Logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Logo Sekolah (Kanan) */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center text-center space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>2. Logo Satuan Pendidikan (Kanan)</span>
                  </div>

                  <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                    {schoolProfile.schoolLogoUrl || schoolProfile.logoUrl ? (
                      <img
                        src={schoolProfile.schoolLogoUrl || schoolProfile.logoUrl}
                        alt="Logo Sekolah"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={schoolLogoInputRef}
                    onChange={handleSchoolLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="w-full space-y-1.5">
                    <button
                      type="button"
                      onClick={() => schoolLogoInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Berkas Logo Sekolah</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          updateSchoolProfile({
                            ...schoolProfile,
                            schoolLogoUrl: DEFAULT_SCHOOL_LOGO,
                            logoUrl: DEFAULT_SCHOOL_LOGO
                          });
                          showNotification('Logo Sekolah standar diterapkan!');
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Logo SMAN Standar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateSchoolProfile({
                            ...schoolProfile,
                            schoolLogoUrl: '',
                            logoUrl: ''
                          });
                          showNotification('Logo Sekolah dihapus dari Kop Surat.');
                        }}
                        className="py-1.5 px-2 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-[10px] font-semibold text-rose-600 flex items-center justify-center gap-1 transition-colors"
                        title="Hapus Logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  Petunjuk Format Logo Kop Surat:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-800 text-[10px]">
                  <li>Format gambar yang didukung: PNG (transparan disarankan), JPG, SVG, WebP. Maksimal 3MB.</li>
                  <li>Logo Dinas Pendidikan ditempatkan di sisi kiri atas, sedangkan Logo Sekolah di sisi kanan atas kop.</li>
                  <li>Perubahan logo otomatis tersimpan permanen dan diterapkan pada cetak PDF serta ekspor Word.</li>
                </ul>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                Selesai &amp; Terapkan ke Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
