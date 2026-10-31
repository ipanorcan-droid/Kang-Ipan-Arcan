import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  Building2,
  Calendar,
  Sparkles,
  ClipboardCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    schoolProfile,
    activeMenu,
    setActiveMenu,
    setSelectedUnitForSupervision,
    rtlItems,
    supervisionSessions,
    notificationMessage
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Count pending verifications for RTL
  const pendingVerifications = rtlItems.filter((r) => r.status === 'MENUNGGU_VERIFIKASI').length;

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', bg: 'bg-purple-100', text: 'text-purple-800' },
    KEPALA_SEKOLAH: { label: 'Kepala Sekolah', bg: 'bg-amber-100', text: 'text-amber-900 border border-amber-300' },
    WAKASEK_UNIT: { label: 'Wakasek / Kepala Unit', bg: 'bg-blue-100', text: 'text-blue-800' },
    STAF: { label: 'Staf Tenaga Kependidikan', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  };

  return (
    <>
      {/* Toast Notification */}
      {notificationMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-amber-500 animate-bounce duration-300">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-sm font-medium">{notificationMessage}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl tracking-wider">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-white">ASKIA</span>
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    Manajerial
                  </span>
                </div>
                <p className="text-xs text-slate-300 hidden sm:block truncate max-w-xs md:max-w-md">
                  Supervisi Manajerial Sekolah • {schoolProfile.schoolName}
                </p>
              </div>
            </div>

            {/* Quick Stats & Action Badges */}
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>T.A. {schoolProfile.academicYear} - Sem. {schoolProfile.activeSemester === '1' ? 'Ganjil' : 'Genap'}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedUnitForSupervision(null);
                  setActiveMenu('pelaksanaan');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-sm shadow-amber-500/30"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Mulai Penilaian</span>
              </button>

              <button
                onClick={() => setActiveMenu('analisis-ai')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Supervisi</span>
              </button>
            </div>

            {/* Right Side: Role Switcher & User Profile */}
            <div className="flex items-center gap-3">
              {/* Notification icon for pending RTL verifications */}
              <button
                onClick={() => setActiveMenu('monitoring-rtl')}
                title={`${pendingVerifications} RTL menunggu verifikasi`}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                {pendingVerifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingVerifications}
                  </span>
                )}
              </button>

              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                      {currentUser.fullName}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${roleLabels[currentUser.role]?.bg} ${roleLabels[currentUser.role]?.text}`}>
                      {roleLabels[currentUser.role]?.label}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Simulasi Hak Akses</p>
                      <p className="text-[11px] text-slate-400">Pilih peran untuk menguji alur kerja</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          switchUserRole('KEPALA_SEKOLAH');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                          currentUser.role === 'KEPALA_SEKOLAH' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                        }`}
                      >
                        <div>
                          <p className="font-semibold">Kepala Sekolah</p>
                          <p className="text-[10px] text-slate-400">Akses penuh supervisi & pengesahan</p>
                        </div>
                        {currentUser.role === 'KEPALA_SEKOLAH' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => {
                          switchUserRole('SUPER_ADMIN');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                          currentUser.role === 'SUPER_ADMIN' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                        }`}
                      >
                        <div>
                          <p className="font-semibold">Super Admin</p>
                          <p className="text-[10px] text-slate-400">Kelola master instrumen & pengguna</p>
                        </div>
                        {currentUser.role === 'SUPER_ADMIN' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => {
                          switchUserRole('WAKASEK_UNIT');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                          currentUser.role === 'WAKASEK_UNIT' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                        }`}
                      >
                        <div>
                          <p className="font-semibold">Wakasek / Kepala Unit</p>
                          <p className="text-[10px] text-slate-400">Unggah bukti fisik & laporan RTL</p>
                        </div>
                        {currentUser.role === 'WAKASEK_UNIT' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => {
                          switchUserRole('STAF');
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                          currentUser.role === 'STAF' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                        }`}
                      >
                        <div>
                          <p className="font-semibold">Staf Tata Usaha</p>
                          <p className="text-[10px] text-slate-400">Akses terbatas pengisian dokumen</p>
                        </div>
                        {currentUser.role === 'STAF' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1 px-4 py-2 text-[11px] text-slate-400">
                      NIP: {currentUser.nip}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
