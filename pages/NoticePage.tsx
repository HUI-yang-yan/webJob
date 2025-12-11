import React, { useEffect, useState } from 'react';
import { NoticeService } from '../services/api';
import { Notice } from '../types';
import { Bell } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const NoticePage: React.FC = () => {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const res = await NoticeService.list({ page: 1, size: 20 });
      setNotices(res.data.records);
    };
    fetchNotices();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('notices')}</h1>
      
      <div className="space-y-4">
        {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center space-x-2">
                        <Bell className={`h-5 w-5 ${notice.noticeType === 1 ? 'text-red-500' : 'text-blue-500'}`} />
                        <h3 className="text-lg font-bold text-slate-800">{notice.title}</h3>
                     </div>
                     <span className="text-sm text-slate-500">{new Date(notice.publishTime).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 ml-7 mb-3">{notice.content}</p>
                <div className="ml-7 flex items-center text-xs text-slate-400 space-x-4">
                    <span>{t('publisher')}: {notice.publisherName}</span>
                    <span className={`px-2 py-0.5 rounded ${notice.noticeType === 1 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {notice.noticeType === 1 ? t('important') : t('general')}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default NoticePage;