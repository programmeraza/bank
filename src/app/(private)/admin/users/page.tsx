'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminUser, Branch } from '@/features/users/types';
import { Role } from '@/features/auth/types/rbac';
import UserModal from '@/features/users/components/UserModal';
import { UserFormInput } from '@/features/users/schemas/user.schema';

// Статические справочники филиалов и ролей
const MOCK_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Центральный офис', code: 'HQ' },
  { id: 'b2', name: 'Филиал Север', code: 'NORTH' },
  { id: 'b3', name: 'Филиал Юг', code: 'SOUTH' },
];

const AVAILABLE_ROLES: Role[] = ['Admin', 'Manager', 'Operator', 'Viewer'];

// Демонстрационный набор пользователей
const INITIAL_USERS: AdminUser[] = [
  { id: '1', name: 'Константин Смирнов', email: 'k.smirnov@platform.ru', role: 'Admin', branch: MOCK_BRANCHES[0], status: 'active', createdAt: '10.01.2025' },
  { id: '2', name: 'Ольга Кузнецова', email: 'o.kuznecova@platform.ru', role: 'Manager', branch: MOCK_BRANCHES[1], status: 'active', createdAt: '12.01.2025' },
  { id: '3', name: 'Дмитрий Иванов', email: 'd.ivanov@platform.ru', role: 'Operator', branch: MOCK_BRANCHES[2], status: 'suspended', createdAt: '14.01.2025' },
  { id: '4', name: 'Анна Соколова', email: 'a.sokolova@platform.ru', role: 'Viewer', branch: MOCK_BRANCHES[0], status: 'active', createdAt: '15.01.2025' },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  // Состояния модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Логика фильтрации и поиска
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesBranch = filterBranch ? user.branch.id === filterBranch : true;
    return matchesSearch && matchesRole && matchesBranch;
  });

  // Открытие модального окна для создания / редактирования
  const handleOpenCreateModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  // Удаление пользователя
  const handleDeleteUser = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success('Пользователь успешно удален');
    }
  };

  // Обработка данных формы после отправки
  const handleFormSubmit = (data: UserFormInput) => {
    const branch = MOCK_BRANCHES.find((b) => b.id === data.branchId) || MOCK_BRANCHES[0];

    if (currentUser) {
      // Редактирование
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, name: data.name, email: data.email, role: data.role, branch, status: data.status }
            : u
        )
      );
      toast.success('Профиль пользователя обновлен');
    } else {
      // Создание нового
      const newUser: AdminUser = {
        id: Math.random().toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        branch,
        status: data.status,
        createdAt: new Date().toLocaleDateString('ru-RU'),
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success('Пользователь успешно добавлен');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Шапка раздела с действиями */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-zinc-950">Сотрудники системы</h2>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Добавить пользователя
        </button>
      </div>

      {/* Панель фильтров */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        {/* Поиск */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ФИО или Email..."
            className="w-full rounded border border-zinc-300 pl-10 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Фильтр по роли */}
        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все роли</option>
            {AVAILABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по филиалам */}
        <div className="relative">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="">Все филиалы</option>
            {MOCK_BRANCHES.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-zinc-700">ФИО / Email</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Роль</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Филиал</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Статус</th>
              <th className="px-6 py-3 font-semibold text-zinc-700">Дата создания</th>
              <th className="px-6 py-3 text-right font-semibold text-zinc-700">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{user.name}</div>
                    <div className="text-xs text-zinc-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{user.branch.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{user.createdAt}</td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="inline-flex rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-indigo-600 transition-colors"
                      title="Редактировать"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                  Ни одного пользователя не найдено по вашему запросу.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Простая Пагинация */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <span className="text-xs text-zinc-500">
            Показано {filteredUsers.length} из {users.length} записей
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="inline-flex items-center justify-center rounded border p-1 text-zinc-400 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled
              className="inline-flex items-center justify-center rounded border p-1 text-zinc-400 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно CRUD */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        branches={MOCK_BRANCHES}
        roles={AVAILABLE_ROLES}
        initialData={currentUser}
      />
    </div>
  );
}