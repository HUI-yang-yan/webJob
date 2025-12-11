import React, { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle,
  FileText,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AttendanceService, NoticeService, ContractService } from '../services/api';
import { AttendanceRecord, Notice } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../utils/i18n';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [contractData, setContractData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      const attRes = await AttendanceService.getToday();
      setAttendance(attRes.data);

      const noticeRes = await NoticeService.getLatest();
      setNotices(noticeRes.data);

      const contractRes = await ContractService.getStats();
      if (Array.isArray(contractRes.data)) {
          setContractData(contractRes.data);
      } else {
           setContractData([
             { name: 'Q1', value: 12 },
             { name: 'Q2', value: 19 },
             { name: 'Q3', value: 8 },
             { name: 'Q4', value: 15 },
           ]);
      }

    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckIn = async () => {
    await AttendanceService.checkIn();
    loadDashboardData();
  };

  const handleCheckOut = async () => {
    await AttendanceService.checkOut();
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('overview')}</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{t('totalEmployees')}</p>
            <h3 className="text-2xl font-bold text-slate-800">142</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{t('activeContracts')}</p>
            <h3 className="text-2xl font-bold text-slate-800">28</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{t('meetingsToday')}</p>
            <h3 className="text-2xl font-bold text-slate-800">5</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{t('pendingApprovals')}</p>
            <h3 className="text-2xl font-bold text-slate-800">12</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">{t('attendance')}</h3>
                <span className="text-sm text-slate-500">{new Date().toDateString()}</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <Clock className="h-24 w-24 text-indigo-500 opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-xl font-bold text-indigo-700">
                             {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                    </div>
                </div>

                <div className="w-full space-y-3">
                    {attendance?.checkInTime ? (
                         <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {t('checkedInAt')} {new Date(attendance.checkInTime).toLocaleTimeString()}
                         </div>
                    ) : (
                        <button
                            onClick={handleCheckIn}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                            {t('checkIn')}
                        </button>
                    )}

                    {attendance?.checkInTime && !attendance?.checkOutTime && (
                         <button
                         onClick={handleCheckOut}
                         className="w-full py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                     >
                         {t('checkOut')}
                     </button>
                    )}
                    
                     {attendance?.checkOutTime && (
                         <div className="p-3 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {t('checkedOutAt')} {new Date(attendance.checkOutTime).toLocaleTimeString()}
                         </div>
                    )}
                </div>
            </div>
        </div>

        {/* Charts Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{t('contractValueTrends')}</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contractData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('latestNotices')}</h3>
        <div className="space-y-4">
            {notices.map((notice) => (
                <div key={notice.id} className="flex items-start p-4 border rounded-lg border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{notice.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{notice.content}</p>
                    </div>
                    <div className="text-right whitespace-nowrap ml-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${notice.noticeType === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {notice.noticeType === 1 ? t('important') : t('general')}
                        </span>
                        <p className="text-xs text-slate-400 mt-2">{new Date(notice.publishTime).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
            {notices.length === 0 && <p className="text-slate-400 text-center py-4">No new notices</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;