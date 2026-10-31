import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  School,
  Users,
  Network,
  CalendarDays,
  Clock,
  BookOpenCheck,
  ClipboardPen,
  Award,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  FolderArchive,
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeMenu, setActiveMenu, rtlItems, units } = useApp();

  const pendingRtl = rtlItems.filter((r) => r.status !== 'SELESAI').length;
  const uncompletedUnits = units.filter((u) => !u.isSupervised).length;

  const menuSections: MenuSection[] = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
        {
          id: 'profil-sekolah',
          label: '2. Profil & Logo Sekolah',
          icon: School,
          badge: 'Logo Kop',
          badgeColor: 'bg-amber-400 text-slate-950 font-bold',
        },
      ],
    },
    {
      title: 'MASTER DATA',
      items: [
        { id: 'data-pengguna', label: '3. Data Pengguna', icon: Users },
        { id: 'data-unit', label: '4. Data Unit Kerja', icon: Network, badge: '15' },
        { id: 'program-supervisi', label: '5. Program Supervisi', icon: CalendarDays },
        { id: 'jadwal-supervisi', label: '6. Jadwal Supervisi', icon: Clock },
        { id: 'instrumen-supervisi', label: '7. Instrumen Supervisi', icon: BookOpenCheck },
      ],
    },
    {
      title: 'PELAKSANAAN & PENILAIAN',
      items: [
        {
          id: 'pelaksanaan',
          label: '8. Pelaksanaan Supervisi',
          icon: ClipboardPen,
          badge: uncompletedUnits > 0 ? `${uncompletedUnits} Sisa` : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        },
        { id: 'hasil-penilaian', label: '9. Hasil Penilaian', icon: Award },
        {
          id: 'analisis-ai',
          label: '10. Analisis Hasil Supervisi',
          icon: Sparkles,
          highlight: true,
        },
        { id: 'temuan-rekomendasi', label: '11. Temuan & Rekomendasi', icon: AlertTriangle },
      ],
    },
    {
      title: 'TINDAK LANJUT & LAPORAN',
      items: [
        { id: 'rencana-tindak-lanjut', label: '12. Rencana Tindak Lanjut', icon: RotateCcw },
        {
          id: 'monitoring-rtl',
          label: '13. Monitoring RTL',
          icon: CheckCircle2,
          badge: pendingRtl > 0 ? `${pendingRtl} Aktif` : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
        },
        { id: 'laporan-supervisi', label: '14. Laporan Supervisi', icon: FileSpreadsheet },
        { id: 'arsip-digital', label: '15. Arsip Digital', icon: FolderArchive },
      ],
    },
    {
      title: 'SISTEM',
      items: [
        { id: 'pengaturan', label: '16. Pengaturan & Cadangan', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    setActiveMenu(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 text-slate-300
        flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}
    >
      {/* Brand Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
            SUPERVISI MANAJERIAL
          </span>
          <span className="text-sm font-semibold text-white">15 Unit Kerja Sekolah</span>
        </div>
        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          v2.5
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border-l-4 border-amber-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }
                    ${item.highlight ? 'relative overflow-hidden' : ''}
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-amber-400'
                          : item.highlight
                          ? 'text-amber-300'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && !item.badge && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="truncate">SMAN 1 Teladan</span>
        <span className="text-amber-500 font-medium">Akreditasi A</span>
      </div>
    </aside>
  );
};
