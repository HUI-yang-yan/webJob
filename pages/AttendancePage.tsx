import React, { useEffect, useState } from 'react';
import { AttendanceService } from '../services/api';
import { AttendanceRecord } from '../types';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const AttendancePage: React.FC = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      // Assuming api has a list method or we use mock
      const res = await AttendanceService.list({ page: 1, size: 20 });
      setRecords(res.data.records);
    };
    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('attendance')}</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">{t('date')}</th>
                        <th className="px-6 py-4">{t('checkIn')}</th>
                        <th className="px-6 py-4">{t('checkOut')}</th>
                        <th className="px-6 py-4">{t('status')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium">{record.attendanceDate}</td>
                            <td className="px-6 py-4">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                            <td className="px-6 py-4">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    record.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {record.status === 'Normal' ? t('normal') : t('late')}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No records found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;