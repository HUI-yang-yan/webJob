import { Employee, Contract, MeetingReservation, AttendanceRecord, Notice, Dept, Equipment } from './types';

export const API_BASE_URL = 'http://localhost:8080/api';

// TOGGLE THIS TO FALSE TO USE REAL API
export const USE_MOCK_DATA = true;

// Mock Data
export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, empNo: 'EMP001', empName: 'Alice Johnson', gender: 0, mobile: '123-456-7890', email: 'alice@company.com', deptId: 101, deptName: 'IT Dept', position: 'Senior Dev', hireDate: '2021-01-15', status: 1 },
  { id: 2, empNo: 'EMP002', empName: 'Bob Smith', gender: 1, mobile: '098-765-4321', email: 'bob@company.com', deptId: 102, deptName: 'HR Dept', position: 'Manager', hireDate: '2020-03-10', status: 1 },
  { id: 3, empNo: 'EMP003', empName: 'Charlie Brown', gender: 1, mobile: '555-123-4567', email: 'charlie@company.com', deptId: 101, deptName: 'IT Dept', position: 'Junior Dev', hireDate: '2022-06-01', status: 1 },
  { id: 4, empNo: 'EMP004', empName: 'Diana Prince', gender: 0, mobile: '555-987-6543', email: 'diana@company.com', deptId: 103, deptName: 'Sales', position: 'Director', hireDate: '2019-11-20', status: 1 },
  { id: 5, empNo: 'EMP005', empName: 'Evan Wright', gender: 1, mobile: '555-555-5555', email: 'evan@company.com', deptId: 103, deptName: 'Sales', position: 'Associate', hireDate: '2023-01-10', status: 0 },
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 1, contractNo: 'CTR-2023-001', contractName: 'Office Lease 2023', amount: 120000, partyA: 'RealEstate Co', partyB: 'Our Company', signDate: '2023-01-01', endDate: '2024-01-01', contractStatus: 1, approvalStatus: 1 },
  { id: 2, contractNo: 'CTR-2023-002', contractName: 'Server Maintenance', amount: 50000, partyA: 'TechSupport Inc', partyB: 'Our Company', signDate: '2023-02-15', endDate: '2024-02-15', contractStatus: 1, approvalStatus: 1 },
  { id: 3, contractNo: 'CTR-2023-003', contractName: 'Catering Service', amount: 15000, partyA: 'Yummy Foods', partyB: 'Our Company', signDate: '2023-05-01', endDate: '2023-12-31', contractStatus: 2, approvalStatus: 1 },
  { id: 4, contractNo: 'CTR-2023-004', contractName: 'Cleaning Services', amount: 24000, partyA: 'CleanMasters', partyB: 'Our Company', signDate: '2023-06-01', endDate: '2024-06-01', contractStatus: 0, approvalStatus: 0 },
];

export const MOCK_MEETINGS: MeetingReservation[] = [
  { id: 1, meetingTitle: 'Q3 Roadmap Planning', roomId: 1, roomName: 'Conf Room A', startTime: '2023-10-27T10:00:00', endTime: '2023-10-27T12:00:00', organizerName: 'Alice Johnson', status: 1, description: 'Planning the next quarter goals' },
  { id: 2, meetingTitle: 'Client Demo', roomId: 2, roomName: 'Conf Room B', startTime: '2023-10-27T14:00:00', endTime: '2023-10-27T15:00:00', organizerName: 'Diana Prince', status: 0, description: 'Demo for prospective client' },
];

export const MOCK_ATTENDANCE: AttendanceRecord = {
  id: 1,
  userId: 1,
  attendanceDate: new Date().toISOString().split('T')[0],
  checkInTime: '2023-10-27T08:55:00',
  status: 'Normal'
};

export const MOCK_NOTICES: Notice[] = [
  { id: 1, title: 'Holiday Announcement', content: 'Office will be closed next Monday due to public holiday.', publishTime: '2023-10-25T09:00:00', publisherName: 'HR Admin', noticeType: 1 },
  { id: 2, title: 'System Maintenance', content: 'Servers will be down on Sunday night for scheduled updates.', publishTime: '2023-10-26T10:00:00', publisherName: 'IT Admin', noticeType: 2 },
  { id: 3, title: 'New Benefit Plan', content: 'We are rolling out a new health insurance plan starting next month.', publishTime: '2023-10-20T14:30:00', publisherName: 'HR Dept', noticeType: 2 },
];

export const MOCK_DEPTS: Dept[] = [
  { id: 101, deptName: 'IT Dept', deptCode: 'IT01', parentId: 0, managerName: 'Alice Johnson' },
  { id: 102, deptName: 'HR Dept', deptCode: 'HR01', parentId: 0, managerName: 'Bob Smith' },
  { id: 103, deptName: 'Sales', deptCode: 'SL01', parentId: 0, managerName: 'Diana Prince' },
  { id: 104, deptName: 'Marketing', deptCode: 'MK01', parentId: 0, managerName: 'Evan Wright' },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 1, equipmentName: 'MacBook Pro M2', equipmentNo: 'EQ-2023-001', status: 2, categoryName: 'Laptop' },
  { id: 2, equipmentName: 'Dell XPS 15', equipmentNo: 'EQ-2023-002', status: 1, categoryName: 'Laptop' },
  { id: 3, equipmentName: 'Projector 4K', equipmentNo: 'EQ-2023-003', status: 1, categoryName: 'Peripherals' },
  { id: 4, equipmentName: 'Office Chair Ergonomic', equipmentNo: 'EQ-2023-004', status: 1, categoryName: 'Furniture' },
  { id: 5, equipmentName: 'Meeting Room TV', equipmentNo: 'EQ-2023-005', status: 3, categoryName: 'Electronics' },
];

export const MOCK_ATTENDANCE_HISTORY: AttendanceRecord[] = [
  { id: 1, userId: 1, attendanceDate: '2023-10-27', checkInTime: '2023-10-27T08:55:00', checkOutTime: '2023-10-27T18:00:00', status: 'Normal' },
  { id: 2, userId: 1, attendanceDate: '2023-10-26', checkInTime: '2023-10-26T09:10:00', checkOutTime: '2023-10-26T18:05:00', status: 'Late' },
  { id: 3, userId: 1, attendanceDate: '2023-10-25', checkInTime: '2023-10-25T08:50:00', checkOutTime: '2023-10-25T17:55:00', status: 'Normal' },
  { id: 4, userId: 2, attendanceDate: '2023-10-27', checkInTime: '2023-10-27T08:30:00', checkOutTime: '2023-10-27T17:30:00', status: 'Normal' },
];