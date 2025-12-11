
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    appTitle: 'OA System',
    dashboard: 'Dashboard',
    workspace: 'Workspace',
    assets: 'Assets',
    system: 'System Management',
    employees: 'Employees',
    departments: 'Departments',
    roles: 'Roles & Permissions',
    attendance: 'Attendance',
    meetings: 'Meetings',
    leaves: 'Leave Management',
    contracts: 'Contracts',
    equipment: 'Equipment',
    notices: 'Notices',
    signOut: 'Sign Out',
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to your account to continue',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    username: 'Username',
    password: 'Password',
    totalEmployees: 'Total Employees',
    activeContracts: 'Active Contracts',
    meetingsToday: 'Meetings Today',
    pendingApprovals: 'Pending Approvals',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    checkedInAt: 'Checked In at',
    checkedOutAt: 'Checked Out at',
    overview: 'Overview',
    latestNotices: 'Latest Notices',
    contractValueTrends: 'Contract Value Trends',
    searchPlaceholder: 'Search...',
    actions: 'Actions',
    status: 'Status',
    add: 'Add',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    filter: 'Filter',
    view: 'View',
    submit: 'Submit',
    approve: 'Approve',
    reject: 'Reject',
    comment: 'Comment',
    // Entity specific
    employeeName: 'Employee Name',
    position: 'Position',
    contact: 'Contact',
    deptName: 'Dept Name',
    manager: 'Manager',
    code: 'Code',
    date: 'Date',
    time: 'Time',
    title: 'Title',
    content: 'Content',
    type: 'Type',
    category: 'Category',
    contractName: 'Contract Name',
    amount: 'Amount',
    partyB: 'Party B',
    ends: 'Ends',
    room: 'Room',
    organizer: 'Organizer',
    description: 'Description',
    roleName: 'Role Name',
    roleCode: 'Role Code',
    leaveType: 'Leave Type',
    startTime: 'Start Time',
    endTime: 'End Time',
    reason: 'Reason',
    myLeaves: 'My Leaves',
    todoApprovals: 'Pending Approvals',
    applyLeave: 'Apply for Leave',
    // Statuses
    active: 'Active',
    inactive: 'Inactive',
    normal: 'Normal',
    late: 'Late',
    absent: 'Absent',
    draft: 'Draft',
    expired: 'Expired',
    available: 'Available',
    borrowed: 'Borrowed',
    maintenance: 'Maintenance',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    pending: 'Pending',
    important: 'Important',
    general: 'General',
    // Leave types
    annual: 'Annual Leave',
    sick: 'Sick Leave',
    personal: 'Personal Leave'
  },
  zh: {
    appTitle: '企业OA系统',
    dashboard: '仪表盘',
    workspace: '工作台',
    assets: '资产管理',
    system: '系统管理',
    employees: '员工管理',
    departments: '部门管理',
    roles: '角色权限',
    attendance: '考勤管理',
    meetings: '会议管理',
    leaves: '请假审批',
    contracts: '合同管理',
    equipment: '资产管理',
    notices: '公告通知',
    signOut: '退出登录',
    welcomeBack: '欢迎回来',
    loginSubtitle: '请登录您的账号以继续',
    signIn: '登录',
    signingIn: '登录中...',
    username: '用户名',
    password: '密码',
    totalEmployees: '员工总数',
    activeContracts: '执行中合同',
    meetingsToday: '今日会议',
    pendingApprovals: '待审批',
    checkIn: '打卡上班',
    checkOut: '打卡下班',
    checkedInAt: '已打卡于',
    checkedOutAt: '已下班于',
    overview: '概览',
    latestNotices: '最新公告',
    contractValueTrends: '合同金额趋势',
    searchPlaceholder: '搜索...',
    actions: '操作',
    status: '状态',
    add: '新增',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    cancel: '取消',
    filter: '筛选',
    view: '查看',
    submit: '提交',
    approve: '通过',
    reject: '拒绝',
    comment: '审批意见',
    // Entity specific
    employeeName: '员工姓名',
    position: '职位',
    contact: '联系方式',
    deptName: '部门名称',
    manager: '负责人',
    code: '编号',
    date: '日期',
    time: '时间',
    title: '标题',
    content: '内容',
    type: '类型',
    category: '分类',
    contractName: '合同名称',
    amount: '金额',
    partyB: '乙方',
    ends: '截止日期',
    room: '会议室',
    organizer: '组织者',
    description: '描述',
    roleName: '角色名称',
    roleCode: '角色编码',
    leaveType: '请假类型',
    startTime: '开始时间',
    endTime: '结束时间',
    reason: '请假事由',
    myLeaves: '我的申请',
    todoApprovals: '待办审批',
    applyLeave: '申请请假',
    // Statuses
    active: '正常',
    inactive: '禁用',
    normal: '正常',
    late: '迟到',
    absent: '缺勤',
    draft: '草稿',
    expired: '已过期',
    available: '空闲',
    borrowed: '已借出',
    maintenance: '维修中',
    confirmed: '已确认',
    rejected: '已拒绝',
    pending: '待处理',
    important: '重要',
    general: '普通',
    // Leave types
    annual: '年假',
    sick: '病假',
    personal: '事假'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    // Safety check: if saved value is not 'en' or 'zh', fallback to 'en'
    if (saved === 'en' || saved === 'zh') {
        return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    // Safety check: fallback to English if current language dictionary is missing
    const dict = translations[language] || translations['en'];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
