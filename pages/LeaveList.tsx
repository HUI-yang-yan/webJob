
import React, { useEffect, useState } from 'react';
import { LeaveService } from '../services/api';
import { LeaveRecord } from '../types';
import { Plus, Check, X as XIcon, Clock } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { Modal } from '../components/Modal';

const LeaveList: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'my' | 'todo'>('my');
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ leaveType: 2, startTime: '', endTime: '', reason: '' });

  useEffect(() => {
    fetchLeaves();
  }, [activeTab]);

  const fetchLeaves = async () => {
    const res = activeTab === 'my' ? await LeaveService.my({ page: 1, size: 20 }) : await LeaveService.todo({ page: 1, size: 20 });
    setLeaves(res.data.records);
  };

  const handleApply = async (e: React.FormEvent) => {
      e.preventDefault();
      await LeaveService.apply(formData);
      setIsModalOpen(false);
      fetchLeaves();
  };

  const handleApprove = async (id: number, approved: boolean) => {
      await LeaveService.approve(id, approved, 'Processed via Quick Action');
      fetchLeaves();
  };

  const getStatusBadge = (status: number) => {
      if (status === 0) return <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs"><Clock className="h-3 w-3 mr-1"/>{t('pending')}</span>;
      if (status === 1) return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs"><Check className="h-3 w-3 mr-1"/>{t('confirmed')}</span>;
      return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs"><XIcon className="h-3 w-3 mr-1"/>{t('rejected')}</span>;
  };

  const getTypeName = (type: number) => {
      switch(type) {
          case 1: return t('sick');
          case 2: return t('annual');
          case 3: return t('personal');
          default: return 'Other';
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{t('leaves')}</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>{t('applyLeave')}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('my')}
                className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'my' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {t('myLeaves')}
              </button>
              <button 
                onClick={() => setActiveTab('todo')}
                className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'todo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {t('todoApprovals')}
              </button>
          </div>

          <div className="p-0">
             <table className="w-full text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">{activeTab === 'todo' ? t('employeeName') : t('leaveType')}</th>
                        <th className="px-6 py-4">{t('date')}</th>
                        <th className="px-6 py-4">{t('reason')}</th>
                        <th className="px-6 py-4">{t('status')}</th>
                        {activeTab === 'todo' && <th className="px-6 py-4 text-right">{t('actions')}</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {leaves.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-8 text-slate-400">No records found</td></tr>
                    ) : leaves.map((leave) => (
                        <tr key={leave.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium">
                                {activeTab === 'todo' ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">{leave.userName?.charAt(0)}</div>
                                        <div>
                                            <div className="text-slate-900">{leave.userName}</div>
                                            <div className="text-xs text-slate-500 font-normal">{getTypeName(leave.leaveType)}</div>
                                        </div>
                                    </div>
                                ) : getTypeName(leave.leaveType)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <div>{new Date(leave.startTime).toLocaleDateString()}</div>
                                <div className="text-xs text-slate-400">to {new Date(leave.endTime).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 text-sm max-w-xs truncate">{leave.reason}</td>
                            <td className="px-6 py-4">{getStatusBadge(leave.status)}</td>
                            {activeTab === 'todo' && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleApprove(leave.id, true)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title={t('approve')}>
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleApprove(leave.id, false)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title={t('reject')}>
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('applyLeave')}>
          <form onSubmit={handleApply} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('leaveType')}</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.leaveType} onChange={e => setFormData({...formData, leaveType: Number(e.target.value)})}>
                      <option value={1}>{t('sick')}</option>
                      <option value={2}>{t('annual')}</option>
                      <option value={3}>{t('personal')}</option>
                  </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('startTime')}</label>
                      <input type="datetime-local" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('endTime')}</label>
                      <input type="datetime-local" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('reason')}</label>
                  <textarea required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-24"
                    value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
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

export default LeaveList;
