
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import RoleList from './pages/RoleList';
import LeaveList from './pages/LeaveList';
import { LanguageProvider, useLanguage } from './utils/i18n';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { Globe, User as UserIcon } from 'lucide-react';

// Route Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const MainLayout: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { user } = useAuth();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'zh' : 'en');
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64 transition-all duration-300">
             {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
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
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : (user?.username.charAt(0).toUpperCase() || 'U')}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 leading-tight">{user?.username || 'User'}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user?.role || 'Guest'}</span>
                        </div>
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
                <Route path="/roles" element={<RoleList />} />
                <Route path="/leaves" element={<LeaveList />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
