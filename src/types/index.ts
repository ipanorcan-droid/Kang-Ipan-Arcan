export type UserRole = 'SUPER_ADMIN' | 'KEPALA_SEKOLAH' | 'WAKASEK_UNIT' | 'STAF';

export interface User {
  id: string;
  username: string;
  fullName: string;
  nip: string;
  role: UserRole;
  unitId?: string;
  unitName?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  schoolLevel: string; // SMA / SMK / SMP / SD
  governmentDept: string; // Dinas Pendidikan Provinsi / Kabupaten
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  accreditation: string;
  academicYear: string; // e.g. "2024/2025"
  activeSemester: '1' | '2'; // 1 = Ganjil, 2 = Genap
  principalName: string;
  principalNip: string;
  principalRank: string; // Pembina Utama Muda, IV/c
  supervisorName: string; // Pengawas Pembina
  supervisorNip: string;
  logoUrl?: string;
  governmentLogoUrl?: string; // Logo Dinas Pendidikan / Pemprov (Kiri Kop Surat)
  schoolLogoUrl?: string; // Logo Resmi Sekolah (Kanan Kop Surat)
}

export type UnitCategory = 'PIMPINAN' | 'BIDANG' | 'LAYANAN_AKADEMIK' | 'TATA_USAHA' | 'LAYANAN_KHUSUS';

export interface UnitWork {
  id: string;
  code: string;
  name: string;
  category: UnitCategory;
  leaderName: string;
  leaderNip: string;
  leaderPosition: string;
  description: string;
  totalIndicators: number;
  isSupervised: boolean;
  lastSupervisionDate?: string;
  score?: number;
  categoryGrade?: 'SANGAT_BAIK' | 'BAIK' | 'CUKUP' | 'PERLU_PEMBINAAN';
  pendingRtlCount: number;
  supervisorName?: string;
}

export type IndicatorStatus = 'FULFILLED' | 'PARTIAL' | 'NOT_MET' | 'NA';

export interface Indicator {
  id: string;
  code: string;
  aspectName: string;
  name: string;
  description: string;
  criterion4: string; // Sangat Baik
  criterion3: string; // Baik
  criterion2: string; // Cukup
  criterion1: string; // Kurang
  physicalEvidence: string; // Bukti fisik yang harus diperiksa
  score: number; // 1-4, or 0 if unrated
  status: IndicatorStatus;
  observerNote?: string;
  recommendation?: string;
}

export interface Aspect {
  id: string;
  name: string;
  weight?: number;
  indicators: Indicator[];
}

export type CategoryGrade = 'SANGAT_BAIK' | 'BAIK' | 'CUKUP' | 'PERLU_PEMBINAAN';

export interface SupervisionSession {
  id: string;
  unitId: string;
  unitName: string;
  leaderName: string;
  leaderNip: string;
  academicYear: string;
  semester: '1' | '2';
  date: string;
  supervisorName: string;
  supervisorNip: string;
  aspects: Aspect[];
  totalScoreEarned: number;
  maxPossibleScore: number;
  finalScore: number;
  categoryGrade: CategoryGrade;
  status: 'BELUM_DISUPERVISI' | 'DALAM_PROSES' | 'MENUNGGU_PERSETUJUAN' | 'SELESAI';
  generalNotes?: string;
  generalRecommendations?: string;
  isApproved: boolean;
  approvedDate?: string;
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    rootCauses: string[];
    recommendations: string[];
  };
}

export type RTLStatus = 'BELUM_DIMULAI' | 'SEDANG_DILAKSANAKAN' | 'MENUNGGU_VERIFIKASI' | 'SELESAI' | 'PERLU_PERBAIKAN';

export interface RTLItem {
  id: string;
  supervisionId?: string;
  unitId: string;
  unitName: string;
  indicatorCode?: string;
  indicatorName: string;
  finding: string;
  rootCause: string;
  recommendation: string;
  actionPlan: string;
  pic: string;
  targetDate: string;
  resources: string;
  evidenceDocName?: string;
  evidenceDocUrl?: string;
  status: RTLStatus;
  supervisorFeedback?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  progressPercent: number;
}

export interface DigitalArchive {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  category: 'BUKTI_SUPERVISI' | 'BUKTI_RTL' | 'SOP' | 'LAPORAN_UNIT' | 'SK_TUGAS' | 'LAINNYA';
  fileType: 'PDF' | 'IMAGE' | 'EXCEL' | 'WORD';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  academicYear: string;
  semester: '1' | '2';
  uploadedBy: string;
  downloadUrl?: string;
  notes?: string;
}

export interface SupervisionSchedule {
  id: string;
  unitId: string;
  unitName: string;
  leaderName: string;
  plannedDate: string;
  time: string;
  venue: string;
  supervisorName: string;
  status: 'TERJADWAL' | 'SELESAI' | 'DITUNDA';
  notes?: string;
}

export interface SupervisionProgram {
  id: string;
  title: string;
  academicYear: string;
  semester: '1' | '2';
  startDate: string;
  endDate: string;
  objective: string;
  targetUnitCount: number;
  status: 'AKTIF' | 'SELESAI' | 'DRAF';
}
