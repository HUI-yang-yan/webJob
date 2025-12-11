import React, { useEffect, useState } from 'react';
import { EmployeeService } from '../services/api';
import { Employee } from '../types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const EmployeeList: React.FC = () => {
  const { t } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');

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

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchEmployees();
  };

  const handleDelete = async (id: number) => {
      if(window.confirm(t('delete') + '?')) {
          await EmployeeService.delete(id);
          fetchEmployees();
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{t('employees')}</h1>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
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
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {emp.avatar ? <img src={emp.avatar} alt="" className="h-full w-full rounded-full" /> : emp.empName.charAt(0)}
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
                        <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;