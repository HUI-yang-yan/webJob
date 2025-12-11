import React, { useEffect, useState } from 'react';
import { DeptService } from '../services/api';
import { Dept } from '../types';
import { Building, Users } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const DepartmentList: React.FC = () => {
  const { t } = useLanguage();
  const [depts, setDepts] = useState<Dept[]>([]);

  useEffect(() => {
    const fetchDepts = async () => {
      const res = await DeptService.list();
      setDepts(res.data);
    };
    fetchDepts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('departments')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((dept) => (
          <div key={dept.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-all">
             <div className="flex items-center space-x-4 mb-4">
                 <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                     <Building className="h-6 w-6" />
                 </div>
                 <div>
                     <h3 className="font-bold text-lg text-slate-800">{dept.deptName}</h3>
                     <span className="text-xs text-slate-400 font-mono">{dept.deptCode}</span>
                 </div>
             </div>
             
             <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between text-sm">
                 <div className="flex flex-col">
                     <span className="text-slate-400 text-xs mb-1">{t('manager')}</span>
                     <span className="font-medium text-slate-700">{dept.managerName || 'N/A'}</span>
                 </div>
                  <div className="flex flex-col items-end">
                     <span className="text-slate-400 text-xs mb-1">{t('employees')}</span>
                     <div className="flex items-center font-medium text-slate-700">
                        <Users className="h-3 w-3 mr-1" />
                        <span>12</span>
                     </div>
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;