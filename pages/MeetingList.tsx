import React, { useEffect, useState } from 'react';
import { MeetingService } from '../services/api';
import { MeetingReservation } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const MeetingList: React.FC = () => {
  const { t } = useLanguage();
  const [meetings, setMeetings] = useState<MeetingReservation[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const res = await MeetingService.getMy({ page: 1, size: 10 });
      setMeetings(res.data.records);
    };
    fetchMeetings();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('meetings')}</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        {meetings.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled meetings.</p>
            </div>
        ) : (
            meetings.map((meeting) => (
                <div key={meeting.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-lg">
                            <span className="text-xs font-bold uppercase">{new Date(meeting.startTime).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-xl font-bold">{new Date(meeting.startTime).getDate()}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{meeting.meetingTitle}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {new Date(meeting.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(meeting.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {meeting.roomName}
                                </span>
                            </div>
                            {meeting.description && <p className="text-sm text-slate-400 mt-2">{meeting.description}</p>}
                        </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                             meeting.status === 1 ? 'bg-green-100 text-green-700' : 
                             meeting.status === 2 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                             {meeting.status === 1 ? t('confirmed') : meeting.status === 2 ? t('rejected') : t('pending')}
                         </span>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MeetingList;