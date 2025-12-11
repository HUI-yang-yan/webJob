import React, { useEffect, useState } from 'react';
import { ContractService } from '../services/api';
import { Contract } from '../types';
import { FileText, Download, Filter, Plus, Edit2 } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { Modal } from '../components/Modal';

const ContractList: React.FC = () => {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [statusFilter, setStatusFilter] = useState<number>(-1); // -1: All
  
  // Add/Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Contract>>({
      contractName: '',
      amount: 0,
      partyB: '',
      endDate: ''
  });

  const fetchContracts = async () => {
    const res = await ContractService.list({ page: 1, size: 20, status: statusFilter });
    setContracts(res.data.records);
  };

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleAddClick = () => {
      setFormData({
          id: undefined,
          contractName: '',
          amount: 0,
          partyB: '',
          endDate: ''
      });
      setIsModalOpen(true);
  };

  const handleEditClick = (contract: Contract) => {
      setFormData({
          id: contract.id,
          contractName: contract.contractName,
          amount: contract.amount,
          partyB: contract.partyB,
          endDate: contract.endDate
      });
      setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.id) {
          await ContractService.update(formData.id, formData);
      } else {
          await ContractService.add(formData);
      }
      setIsModalOpen(false);
      fetchContracts();
  };

  const getStatusColor = (status: number) => {
    switch(status) {
        case 0: return 'bg-yellow-100 text-yellow-700'; // Draft
        case 1: return 'bg-green-100 text-green-700'; // Active
        case 2: return 'bg-red-100 text-red-700'; // Expired
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: number) => {
      switch(status) {
          case 0: return t('draft');
          case 1: return t('active');
          case 2: return t('expired');
          default: return 'Unknown';
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{t('contracts')}</h1>
        <div className="flex gap-2">
            <div className="relative">
                <select 
                    className="appearance-none bg-white border border-slate-300 px-4 py-2 pr-8 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(Number(e.target.value))}
                >
                    <option value="-1">{t('filter')}: All</option>
                    <option value="1">{t('active')}</option>
                    <option value="0">{t('draft')}</option>
                    <option value="2">{t('expired')}</option>
                </select>
                <Filter className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            
            <button 
                onClick={handleAddClick}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>{t('add')} {t('contracts')}</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <FileText className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getStatusColor(contract.contractStatus)}`}>
                    {getStatusText(contract.contractStatus)}
                </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{contract.contractName}</h3>
            <p className="text-xs text-slate-400 font-mono mb-4">{contract.contractNo}</p>
            
            <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                    <span className="text-slate-400">{t('amount')}:</span>
                    <span className="font-semibold">${contract.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">{t('partyB')}:</span>
                    <span>{contract.partyB}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">{t('ends')}:</span>
                    <span>{new Date(contract.endDate).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <button 
                    onClick={() => handleEditClick(contract)}
                    className="text-slate-500 hover:text-indigo-600 p-1 rounded transition-colors"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center">
                    <Download className="h-4 w-4 mr-1" /> PDF
                </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${formData.id ? t('edit') : t('add')} ${t('contracts')}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('contractName')}</label>
                  <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.contractName} onChange={e => setFormData({...formData, contractName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('amount')}</label>
                      <input type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('ends')}</label>
                      <input type="date" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('partyB')}</label>
                  <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={formData.partyB} onChange={e => setFormData({...formData, partyB: e.target.value})} />
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

export default ContractList;