import React, { useEffect, useState } from 'react';
import { EquipmentService } from '../services/api';
import { Equipment } from '../types';
import { Monitor } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const EquipmentList: React.FC = () => {
  const { t } = useLanguage();
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const res = await EquipmentService.list({ page: 1, size: 20 });
      setEquipment(res.data.records);
    };
    fetchEquipment();
  }, []);

  const getStatusBadge = (status: number) => {
      if (status === 1) return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{t('available')}</span>;
      if (status === 2) return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">{t('borrowed')}</span>;
      return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{t('maintenance')}</span>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('equipment')}</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider">
                <tr>
                    <th className="px-6 py-4">{t('title')}</th>
                    <th className="px-6 py-4">{t('code')}</th>
                    <th className="px-6 py-4">{t('category')}</th>
                    <th className="px-6 py-4">{t('status')}</th>
                    <th className="px-6 py-4 text-right">{t('actions')}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                                <Monitor className="h-5 w-5 text-slate-400" />
                                <span className="font-medium text-slate-800">{item.equipmentName}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">{item.equipmentNo}</td>
                        <td className="px-6 py-4">{item.categoryName}</td>
                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">{t('edit')}</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;