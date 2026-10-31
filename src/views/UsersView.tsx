import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Trash2,
  Edit2,
  Key,
  Building2
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, units, switchUserRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<UserRole>('WAKASEK_UNIT');
  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const openAddModal = () => {
    setEditingUser(null);
    setFullName('');
    setUsername('');
    setNip('');
    setRole('WAKASEK_UNIT');
    setUnitId(units[0]?.id || '');
    setEmail('');
    setPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFullName(u.fullName);
    setUsername(u.username);
    setNip(u.nip);
    setRole(u.role);
    setUnitId(u.unitId || units[0]?.id || '');
    setEmail(u.email);
    setPhone(u.phone);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find((x) => x.id === unitId);

    if (editingUser) {
      updateUser({
        ...editingUser,
        fullName,
        username,
        nip,
        role,
        unitId: role === 'WAKASEK_UNIT' || role === 'STAF' ? unitId : undefined,
        unitName: role === 'WAKASEK_UNIT' || role === 'STAF' ? targetUnit?.name : undefined,
        email,
        phone,
      });
    } else {
      addUser({
        fullName,
        username,
        nip,
        role,
        unitId: role === 'WAKASEK_UNIT' || role === 'STAF' ? unitId : undefined,
        unitName: role === 'WAKASEK_UNIT' || role === 'STAF' ? targetUnit?.name : undefined,
        email,
        phone,
      });
    }
    setIsModalOpen(false);
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Super Admin</span>;
      case 'KEPALA_SEKOLAH':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Kepala Sekolah</span>;
      case 'WAKASEK_UNIT':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Wakasek / Kepala Unit</span>;
      case 'STAF':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Staf Tenaga Kependidikan</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Manajemen Akun &amp; Hak Akses (RBAC)
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Data Pengguna Aplikasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan 4 level otorisasi: Super Admin, Kepala Sekolah, Wakasek/Kepala Unit, dan Staf.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Akun Pengguna</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, NIP, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">Semua Tingkat Peran</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
            <option value="WAKASEK_UNIT">Wakasek / Kepala Unit</option>
            <option value="STAF">Staf</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Total <strong>{filtered.length}</strong> Akun Terdaftar
        </span>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((user) => {
          const isMe = currentUser.id === user.id;
          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                isMe ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20' : 'border-slate-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm shadow">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{user.fullName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">@{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Edit Data"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                    title="Hapus Akun"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                {getRoleBadge(user.role)}
                {user.unitName && (
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Unit: {user.unitName}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="font-semibold text-slate-700">NIP:</span> {user.nip}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.phone}</span>
                </p>
              </div>

              <div className="mt-4 pt-2">
                <button
                  onClick={() => switchUserRole(user.role)}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isMe
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isMe ? '✓ Akun Aktif Saat Ini' : 'Masuk sebagai Pengguna Ini'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap &amp; Gelar:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Dra. Hj. Siti Fatimah, M.Pd."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username Login:</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP / NUPTK:</label>
                  <input
                    type="text"
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tingkat Peran (Role):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN - Akses Pengaturan Penuh</option>
                  <option value="KEPALA_SEKOLAH">KEPALA SEKOLAH - Pelaksana Supervisi &amp; Pengesahan</option>
                  <option value="WAKASEK_UNIT">WAKASEK / KEPALA UNIT - Mengunggah Bukti &amp; RTL</option>
                  <option value="STAF">STAF - Tenaga Kependidikan</option>
                </select>
              </div>

              {(role === 'WAKASEK_UNIT' || role === 'STAF') && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Kerja yang Dibidangi:</label>
                  <select
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
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
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
