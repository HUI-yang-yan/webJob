import React, { useEffect, useState } from 'react';
import { ContractService } from '../services/api';
import { Contract } from '../types';
import { FileText, Download, Filter } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const ContractList: React.FC = () => {
  const { t } = useLanguage();
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const res = await ContractService.list({ page: 1, size: 20 });
      setContracts(res.data.records);
    };
    fetchContracts();
  }, []);

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
            <button className="flex items-center space-x-2 bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
                <Filter className="h-4 w-4" />
                <span>{t('filter')}</span>
            </button>
            <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <FileText className="h-4 w-4" />
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

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center">
                    <Download className="h-4 w-4 mr-1" /> PDF
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractList;