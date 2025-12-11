import React, { useEffect, useState } from 'react';
import { EmployeeService, DeptService } from '../services/api';
import { Employee, Dept } from '../types';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { Modal } from '../components/Modal';

const EmployeeList: React.FC = () => {
  const { t } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  
  // Add/Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depts, setDepts] = useState<Dept[]>([]);
  const [formData, setFormData] = useState<Partial<Employee>>({
      empName: '',
      email: '',
      mobile: '',
      position: '',
      deptId: 0,
      gender: 1
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await EmployeeService.list({ page: 1, size: 10, keyword });
      setEmployees(res.data.records);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepts = async () => {
      const res = await DeptService.list();
      setDepts(res.data);
      if(res.data.length > 0 && !formData.deptId) {
          setFormData(prev => ({ ...prev, deptId: res.data[0].id }));
      }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchEmployees();
  };

  const handleAddClick = () => {
      setFormData({
          id: undefined,
          empName: '',
          email: '',
          mobile: '',
          position: '',
          deptId: depts[0]?.id || 0,
          gender: 1
      });
      setIsModalOpen(true);
  };

  const handleEditClick = (emp: Employee) => {
      setFormData({
          id: emp.id,
          empName: emp.empName,
          email: emp.email,
          mobile: emp.mobile,
          position: emp.position,
          deptId: emp.deptId,
          gender: emp.gender
      });
      setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.id) {
          await EmployeeService.update(formData.id, formData);
      } else {
          await EmployeeService.add(formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
  };

  const handleDelete = async (id: number) => {
      if(window.confirm(t('delete') + '?')) {
          await EmployeeService.delete(id);
          fetchEmployees();
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{t('employees')}</h1>
        <button 
            onClick={handleAddClick}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>{t('add')} {t('employees')}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">{t('employeeName')}</th>
                <th className="px-6 py-4">{t('departments')}</th>
                <th className="px-6 py-4">{t('position')}</th>
                <th className="px-6 py-4">{t('contact')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                    <td colSpan={6} className="text-center py-8">Loading...</td>
                </tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                        {emp.avatar ? <img src={emp.avatar} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{emp.empName}</div>
                        <div className="text-xs text-slate-500">{emp.empNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{emp.deptName}</td>
                  <td className="px-6 py-4">{emp.position}</td>
                  <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                          <span>{emp.email}</span>
                          <span className="text-slate-400 text-xs">{emp.mobile}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.status === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {emp.status === 1 ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button 
                            onClick={() => handleEditClick(emp)}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-500"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-2 hover:bg-red-50 rounded-full text-red-500"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && employees.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${formData.id ? t('edit') : t('add')} ${t('employees')}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('employeeName')}</label>
                  <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.empName} onChange={e => setFormData({...formData, empName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('departments')}</label>
                      <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.deptId} onChange={e => setFormData({...formData, deptId: Number(e.target.value)})}>
                          {depts.map(d => (
                              <option key={d.id} value={d.id}>{d.deptName}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('position')}</label>
                      <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact')}</label>
                  <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t('cancel')}</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{t('submit')}</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default EmployeeList;