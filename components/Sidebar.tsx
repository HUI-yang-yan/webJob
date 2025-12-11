
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  ClipboardList,
  Monitor,
  Building,
  Bell,
  LogOut,
  Shield,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { useAuth } from '../utils/AuthContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { logout, hasRole } = useAuth();

  // Define menu items with required roles
  // 'admin' sees everything usually. 'user' sees basic stuff.
  const groups = [
      {
          title: t('workspace'),
          items: [
              { name: t('dashboard'), path: '/', icon: LayoutDashboard, roles: ['*'] },
              { name: t('attendance'), path: '/attendance', icon: ClipboardList, roles: ['*'] },
              { name: t('leaves'), path: '/leaves', icon: FileCheck, roles: ['*'] },
              { name: t('meetings'), path: '/meetings', icon: Calendar, roles: ['*'] },
              { name: t('notices'), path: '/notices', icon: Bell, roles: ['*'] },
          ]
      },
      {
          title: t('assets'),
          items: [
              { name: t('contracts'), path: '/contracts', icon: FileText, roles: ['admin', 'manager'] },
              { name: t('equipment'), path: '/equipment', icon: Monitor, roles: ['admin', 'manager', 'user'] },
          ]
      },
      {
          title: t('system'),
          items: [
              { name: t('employees'), path: '/employees', icon: Users, roles: ['admin', 'hr'] },
              { name: t('departments'), path: '/departments', icon: Building, roles: ['admin'] },
              { name: t('roles'), path: '/roles', icon: Shield, roles: ['admin'] },
          ]
      }
  ];

  // Filter groups based on permissions
  const visibleGroups = groups.map(group => ({
      ...group,
      items: group.items.filter(item => hasRole(item.roles))
  })).filter(group => group.items.length > 0);

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-10 transition-all duration-300">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <Briefcase className="h-8 w-8 text-indigo-500" />
        <span className="text-xl font-bold tracking-wider truncate">{t('appTitle')}</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-6">
        {visibleGroups.map((group, idx) => (
            <div key={idx}>
                <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h3>
                <div className="space-y-1">
                    {group.items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                            isActive
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                        }
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium truncate">{item.name}</span>
                    </NavLink>
                    ))}
                </div>
            </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
