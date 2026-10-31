import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SchoolProfile,
  UnitWork,
  SupervisionSession,
  RTLItem,
  DigitalArchive,
  SupervisionSchedule,
  SupervisionProgram,
  Aspect,
  CategoryGrade,
} from '../types';
import {
  initialSchoolProfile,
  initialUsers,
  initialUnits,
  initialSupervisionSessions,
  initialRTLItems,
  initialArchives,
  initialSchedules,
  initialProgram,
  generateAspectsForUnit,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  schoolProfile: SchoolProfile;
  units: UnitWork[];
  supervisionSessions: SupervisionSession[];
  rtlItems: RTLItem[];
  digitalArchives: DigitalArchive[];
  schedules: SupervisionSchedule[];
  program: SupervisionProgram;
  activeMenu: string;
  selectedUnitForSupervision: string | null;
  notificationMessage: string | null;

  // Actions
  setActiveMenu: (menu: string) => void;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;
  setSelectedUnitForSupervision: (unitId: string | null) => void;
  showNotification: (msg: string) => void;

  updateSchoolProfile: (profile: SchoolProfile) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  addUnit: (unit: Omit<UnitWork, 'id' | 'totalIndicators' | 'isSupervised' | 'pendingRtlCount'>) => void;
  updateUnit: (unit: UnitWork) => void;
  deleteUnit: (id: string) => void;

  saveSupervisionSession: (session: SupervisionSession) => void;
  approveSupervision: (sessionId: string) => void;

  addRTLItem: (item: Omit<RTLItem, 'id'>) => void;
  updateRTLItem: (item: RTLItem) => void;
  verifyRTLItem: (id: string, feedback: string, newStatus: RTLItem['status']) => void;
  deleteRTLItem: (id: string) => void;

  addArchive: (archive: Omit<DigitalArchive, 'id' | 'uploadDate'>) => void;
  deleteArchive: (id: string) => void;

  addSchedule: (sch: Omit<SupervisionSchedule, 'id'>) => void;
  updateSchedule: (sch: SupervisionSchedule) => void;
  deleteSchedule: (id: string) => void;

  updateProgram: (prog: SupervisionProgram) => void;

  resetToDefaultData: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonString: string) => boolean;

  // Utility scoring
  calculateSupervisionScore: (aspects: Aspect[]) => {
    totalScoreEarned: number;
    maxPossibleScore: number;
    finalScore: number;
    categoryGrade: CategoryGrade;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'askia_supervisi_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to initial
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUser`);
    return saved ? JSON.parse(saved) : initialUsers[1]; // Default to Kepala Sekolah (Drs. H. Mulyono, M.Pd.)
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}schoolProfile`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialSchoolProfile,
          ...parsed,
          governmentLogoUrl: parsed.governmentLogoUrl || initialSchoolProfile.governmentLogoUrl,
          schoolLogoUrl:
            parsed.schoolLogoUrl ||
            (parsed.logoUrl && !parsed.logoUrl.includes('images.unsplash.com')
              ? parsed.logoUrl
              : initialSchoolProfile.schoolLogoUrl),
        };
      } catch {
        return initialSchoolProfile;
      }
    }
    return initialSchoolProfile;
  });

  const [units, setUnits] = useState<UnitWork[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}units`);
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [supervisionSessions, setSupervisionSessions] = useState<SupervisionSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}supervisionSessions`);
    return saved ? JSON.parse(saved) : initialSupervisionSessions;
  });

  const [rtlItems, setRtlItems] = useState<RTLItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}rtlItems`);
    return saved ? JSON.parse(saved) : initialRTLItems;
  });

  const [digitalArchives, setDigitalArchives] = useState<DigitalArchive[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}digitalArchives`);
    return saved ? JSON.parse(saved) : initialArchives;
  });

  const [schedules, setSchedules] = useState<SupervisionSchedule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}schedules`);
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [program, setProgram] = useState<SupervisionProgram>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}program`);
    return saved ? JSON.parse(saved) : initialProgram;
  });

  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [selectedUnitForSupervision, setSelectedUnitForSupervision] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}schoolProfile`, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}units`, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}supervisionSessions`, JSON.stringify(supervisionSessions));
  }, [supervisionSessions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}rtlItems`, JSON.stringify(rtlItems));
  }, [rtlItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}digitalArchives`, JSON.stringify(digitalArchives));
  }, [digitalArchives]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}schedules`, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}program`, JSON.stringify(program));
  }, [program]);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || {
      id: `usr-${Date.now()}`,
      username: role.toLowerCase(),
      fullName: `Pengguna Simulasi (${role})`,
      nip: '19800101 200501 1 001',
      role,
      email: `${role.toLowerCase()}@sekolah.sch.id`,
      phone: '08123456789',
    };
    setCurrentUser(targetUser);
    showNotification(`Beralih peran ke: ${targetUser.fullName}`);
  };

  // Score Calculator
  const calculateSupervisionScore = (aspects: Aspect[]) => {
    let totalScoreEarned = 0;
    let validIndicatorCount = 0;

    aspects.forEach((asp) => {
      asp.indicators.forEach((ind) => {
        if (ind.status !== 'NA') {
          totalScoreEarned += Number(ind.score) || 0;
          validIndicatorCount += 1;
        }
      });
    });

    const maxPossibleScore = validIndicatorCount * 4;
    let finalScore = 0;
    if (maxPossibleScore > 0) {
      finalScore = Number(((totalScoreEarned / maxPossibleScore) * 100).toFixed(1));
    }

    let categoryGrade: CategoryGrade = 'PERLU_PEMBINAAN';
    if (finalScore >= 91) {
      categoryGrade = 'SANGAT_BAIK';
    } else if (finalScore >= 81) {
      categoryGrade = 'BAIK';
    } else if (finalScore >= 71) {
      categoryGrade = 'CUKUP';
    } else {
      categoryGrade = 'PERLU_PEMBINAAN';
    }

    return { totalScoreEarned, maxPossibleScore, finalScore, categoryGrade };
  };

  const updateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    showNotification('Profil sekolah berhasil diperbarui.');
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    setUsers((prev) => [...prev, newUser]);
    showNotification(`Pengguna ${newUser.fullName} berhasil ditambahkan.`);
  };

  const updateUser = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
    showNotification('Data pengguna berhasil diperbarui.');
  };

  const deleteUser = (id: string) => {
    if (currentUser.id === id) {
      showNotification('Tidak dapat menghapus akun yang sedang aktif digunakan.');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showNotification('Pengguna berhasil dihapus.');
  };

  const addUnit = (unitData: Omit<UnitWork, 'id' | 'totalIndicators' | 'isSupervised' | 'pendingRtlCount'>) => {
    const defaultAspects = generateAspectsForUnit(`unit-custom-${Date.now()}`);
    let count = 0;
    defaultAspects.forEach((a) => (count += a.indicators.length));

    const newUnit: UnitWork = {
      ...unitData,
      id: `unit-${Date.now()}`,
      totalIndicators: count,
      isSupervised: false,
      pendingRtlCount: 0,
    };

    setUnits((prev) => [...prev, newUnit]);
    showNotification(`Unit kerja "${newUnit.name}" berhasil ditambahkan.`);
  };

  const updateUnit = (updated: UnitWork) => {
    setUnits((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification(`Data unit "${updated.name}" diperbarui.`);
  };

  const deleteUnit = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
    showNotification('Unit kerja berhasil dihapus.');
  };

  const saveSupervisionSession = (session: SupervisionSession) => {
    const scores = calculateSupervisionScore(session.aspects);
    const updatedSession: SupervisionSession = {
      ...session,
      totalScoreEarned: scores.totalScoreEarned,
      maxPossibleScore: scores.maxPossibleScore,
      finalScore: scores.finalScore,
      categoryGrade: scores.categoryGrade,
    };

    setSupervisionSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === updatedSession.id || s.unitId === updatedSession.unitId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedSession;
        return copy;
      }
      return [...prev, updatedSession];
    });

    // Update Unit record
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === updatedSession.unitId) {
          return {
            ...u,
            isSupervised: true,
            score: updatedSession.finalScore,
            categoryGrade: updatedSession.categoryGrade,
            lastSupervisionDate: updatedSession.date,
            supervisorName: updatedSession.supervisorName,
          };
        }
        return u;
      })
    );

    // Auto-create RTL entries for indicators with low score (1 or 2, or partial/not met) if not already created
    const lowIndicators: { ind: Aspect['indicators'][0]; aspectName: string }[] = [];
    updatedSession.aspects.forEach((asp) => {
      asp.indicators.forEach((ind) => {
        if (ind.status !== 'NA' && (ind.score <= 2 || ind.status === 'NOT_MET' || ind.status === 'PARTIAL')) {
          lowIndicators.push({ ind, aspectName: asp.name });
        }
      });
    });

    if (lowIndicators.length > 0) {
      setRtlItems((prevRtls) => {
        const newRtls = [...prevRtls];
        let addedCount = 0;
        lowIndicators.forEach(({ ind }) => {
          const alreadyExists = newRtls.some((r) => r.unitId === updatedSession.unitId && r.indicatorCode === ind.code);
          if (!alreadyExists) {
            newRtls.push({
              id: `rtl-auto-${Date.now()}-${ind.code}`,
              supervisionId: updatedSession.id,
              unitId: updatedSession.unitId,
              unitName: updatedSession.unitName,
              indicatorCode: ind.code,
              indicatorName: ind.name,
              finding: ind.observerNote || `Kriteria indikator "${ind.name}" belum terpenuhi secara optimal.`,
              rootCause: 'Perlu peningkatan koordinasi dan pemenuhan administrasi berkas pendukung.',
              recommendation: ind.recommendation || 'Lengkapi dokumen fisik pendukung dan laksanakan evaluasi terprogram.',
              actionPlan: `Penyusunan portofolio dan pemenuhan bukti fisik indikator ${ind.name}`,
              pic: updatedSession.leaderName,
              targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              resources: 'Perangkat administrasi sekolah dan panduan teknis',
              status: 'BELUM_DIMULAI',
              progressPercent: 0,
            });
            addedCount++;
          }
        });
        if (addedCount > 0) {
          // Update unit pending RTL count
          setUnits((currentUnits) =>
            currentUnits.map((u) => {
              if (u.id === updatedSession.unitId) {
                return { ...u, pendingRtlCount: (u.pendingRtlCount || 0) + addedCount };
              }
              return u;
            })
          );
        }
        return newRtls;
      });
    }

    showNotification(`Penilaian supervisi ${updatedSession.unitName} berhasil disimpan. Nilai: ${updatedSession.finalScore} (${updatedSession.categoryGrade}).`);
  };

  const approveSupervision = (sessionId: string) => {
    setSupervisionSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            isApproved: true,
            approvedDate: new Date().toISOString().split('T')[0],
            status: 'SELESAI',
          };
        }
        return s;
      })
    );
    showNotification('Hasil supervisi berhasil disahkan resmi oleh Kepala Sekolah.');
  };

  const addRTLItem = (itemData: Omit<RTLItem, 'id'>) => {
    const newItem: RTLItem = { ...itemData, id: `rtl-${Date.now()}` };
    setRtlItems((prev) => [...prev, newItem]);
    setUnits((prev) =>
      prev.map((u) => (u.id === newItem.unitId ? { ...u, pendingRtlCount: (u.pendingRtlCount || 0) + 1 } : u))
    );
    showNotification('Rencana Tindak Lanjut baru berhasil ditambahkan.');
  };

  const updateRTLItem = (updated: RTLItem) => {
    setRtlItems((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    // If status became SELESAI, adjust pending count
    if (updated.status === 'SELESAI') {
      setUnits((prev) =>
        prev.map((u) => {
          if (u.id === updated.unitId && u.pendingRtlCount > 0) {
            return { ...u, pendingRtlCount: Math.max(0, u.pendingRtlCount - 1) };
          }
          return u;
        })
      );
    }
    showNotification('RTL berhasil diperbarui.');
  };

  const verifyRTLItem = (id: string, feedback: string, newStatus: RTLItem['status']) => {
    setRtlItems((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            supervisorFeedback: feedback,
            status: newStatus,
            verifiedAt: new Date().toISOString().split('T')[0],
            verifiedBy: currentUser.fullName,
            progressPercent: newStatus === 'SELESAI' ? 100 : r.progressPercent,
          };
        }
        return r;
      })
    );
    showNotification(`Verifikasi RTL disimpan dengan status: ${newStatus}`);
  };

  const deleteRTLItem = (id: string) => {
    const target = rtlItems.find((r) => r.id === id);
    setRtlItems((prev) => prev.filter((r) => r.id !== id));
    if (target && target.status !== 'SELESAI') {
      setUnits((prev) =>
        prev.map((u) => {
          if (u.id === target.unitId && u.pendingRtlCount > 0) {
            return { ...u, pendingRtlCount: u.pendingRtlCount - 1 };
          }
          return u;
        })
      );
    }
    showNotification('Item RTL berhasil dihapus.');
  };

  const addArchive = (archiveData: Omit<DigitalArchive, 'id' | 'uploadDate'>) => {
    const newArc: DigitalArchive = {
      ...archiveData,
      id: `arc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDigitalArchives((prev) => [newArc, ...prev]);
    showNotification(`Berkas "${newArc.title}" berhasil diarsipkan.`);
  };

  const deleteArchive = (id: string) => {
    setDigitalArchives((prev) => prev.filter((a) => a.id !== id));
    showNotification('Arsip berhasil dihapus.');
  };

  const addSchedule = (schData: Omit<SupervisionSchedule, 'id'>) => {
    const newSch: SupervisionSchedule = { ...schData, id: `sch-${Date.now()}` };
    setSchedules((prev) => [...prev, newSch]);
    showNotification(`Jadwal supervisi untuk ${newSch.unitName} ditambahkan.`);
  };

  const updateSchedule = (updated: SupervisionSchedule) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showNotification('Jadwal supervisi diperbarui.');
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    showNotification('Jadwal supervisi dihapus.');
  };

  const updateProgram = (prog: SupervisionProgram) => {
    setProgram(prog);
    showNotification('Program supervisi diperbarui.');
  };

  const resetToDefaultData = () => {
    setCurrentUser(initialUsers[1]);
    setUsers(initialUsers);
    setSchoolProfile(initialSchoolProfile);
    setUnits(initialUnits);
    setSupervisionSessions(initialSupervisionSessions);
    setRtlItems(initialRTLItems);
    setDigitalArchives(initialArchives);
    setSchedules(initialSchedules);
    setProgram(initialProgram);
    localStorage.clear();
    showNotification('Seluruh data aplikasi telah direset ke setelan bawaan percontohan.');
  };

  const exportBackupJson = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolProfile,
      users,
      units,
      supervisionSessions,
      rtlItems,
      digitalArchives,
      schedules,
      program,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASKIA_Supervisi_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('File pencadangan data JSON berhasil diunduh.');
  };

  const importBackupJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
      if (Array.isArray(data.users)) setUsers(data.users);
      if (Array.isArray(data.units)) setUnits(data.units);
      if (Array.isArray(data.supervisionSessions)) setSupervisionSessions(data.supervisionSessions);
      if (Array.isArray(data.rtlItems)) setRtlItems(data.rtlItems);
      if (Array.isArray(data.digitalArchives)) setDigitalArchives(data.digitalArchives);
      if (Array.isArray(data.schedules)) setSchedules(data.schedules);
      if (data.program) setProgram(data.program);
      showNotification('Pencadangan data berhasil dipulihkan!');
      return true;
    } catch (e) {
      console.error('Error importing backup JSON:', e);
      showNotification('Format file JSON tidak valid!');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        schoolProfile,
        units,
        supervisionSessions,
        rtlItems,
        digitalArchives,
        schedules,
        program,
        activeMenu,
        selectedUnitForSupervision,
        notificationMessage,
        setActiveMenu,
        setCurrentUser,
        switchUserRole,
        setSelectedUnitForSupervision,
        showNotification,
        updateSchoolProfile,
        addUser,
        updateUser,
        deleteUser,
        addUnit,
        updateUnit,
        deleteUnit,
        saveSupervisionSession,
        approveSupervision,
        addRTLItem,
        updateRTLItem,
        verifyRTLItem,
        deleteRTLItem,
        addArchive,
        deleteArchive,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        updateProgram,
        resetToDefaultData,
        exportBackupJson,
        importBackupJson,
        calculateSupervisionScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
