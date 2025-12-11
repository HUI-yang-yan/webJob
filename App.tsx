import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import ContractList from './pages/ContractList';
import MeetingList from './pages/MeetingList';
import DepartmentList from './pages/DepartmentList';
import AttendancePage from './pages/AttendancePage';
import EquipmentList from './pages/EquipmentList';
import NoticePage from './pages/NoticePage';
import { LanguageProvider, useLanguage } from './utils/i18n';
import { Globe } from 'lucide-react';

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'zh' : 'en');
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar onLogout={onLogout} />
          <div className="flex-1 ml-64">
             {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                 <h2 className="text-lg font-semibold text-slate-700">Enterprise Portal</h2>
                 <div className="flex items-center space-x-4">
                     <button 
                        onClick={toggleLanguage}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
                     >
                        <Globe className="h-4 w-4" />
                        <span>{language === 'en' ? 'EN' : '中文'}</span>
                     </button>
                     <div className="h-6 w-px bg-slate-200 mx-2"></div>
                     <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                            A
                        </div>
                        <span className="text-sm font-medium text-slate-600">Admin User</span>
                     </div>
                 </div>
            </header>

            {/* Main Content */}
            <main className="p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/contracts" element={<ContractList />} />
                <Route path="/meetings" element={<MeetingList />} />
                <Route path="/departments" element={<DepartmentList />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/equipment" element={<EquipmentList />} />
                <Route path="/notices" element={<NoticePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
    );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <LanguageProvider>
        <Router>
        {!isAuthenticated ? (
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        ) : (
            <MainLayout onLogout={handleLogout} />
        )}
        </Router>
    </LanguageProvider>
  );
};

export default App;