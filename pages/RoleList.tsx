
import React, { useEffect, useState } from 'react';
import { RoleService } from '../services/api';
import { Role } from '../types';
import { Plus, Search, Edit2, Trash2, Shield } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { Modal } from '../components/Modal';

const RoleList: React.FC = () => {
  const { t } = useLanguage();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Role>>({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await RoleService.list({ page: 1, size: 20 });
    setRoles(res.data.records);
  };

  const handleAdd = () => {
      setFormData({});
      setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await RoleService.add(formData);
      setIsModalOpen(false);
      fetchRoles();
  };

  const handleDelete = async (id: number) => {
      if(window.confirm(t('delete') + '?')) {
          await RoleService.delete(id);
          fetchRoles();
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{t('roles')}</h1>
        <button onClick={handleAdd} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>{t('add')} {t('roles')}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider">
                <tr>
                    <th className="px-6 py-4">{t('roleName')}</th>
                    <th className="px-6 py-4">{t('roleCode')}</th>
                    <th className="px-6 py-4">{t('description')}</th>
                    <th className="px-6 py-4">{t('status')}</th>
                    <th className="px-6 py-4 text-right">{t('actions')}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium flex items-center space-x-2">
                             <Shield className="h-4 w-4 text-indigo-500" />
                             <span>{role.roleName}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">{role.roleCode}</td>
                        <td className="px-6 py-4 text-sm">{role.description}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${role.status === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                {role.status === 1 ? t('active') : t('inactive')}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                                <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(role.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${t('add')} ${t('roles')}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('roleName')}</label>
                  <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    value={formData.roleName || ''} onChange={e => setFormData({...formData, roleName: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('roleCode')}</label>
                  <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    value={formData.roleCode || ''} onChange={e => setFormData({...formData, roleCode: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')}</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                    value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t('cancel')}</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{t('save')}</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default RoleList;
