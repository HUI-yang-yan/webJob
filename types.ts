
// Generic API Response Wrapper
export interface Result<T> {
  code: number;
  msg: string;
  data: T;
}

// Pagination DTO
export interface PageDTO {
  page: number;
  size: number;
  keyword?: string;
  status?: number;
}

// User / Auth
export interface LoginDTO {
  username?: string;
  password?: string;
  captcha?: string;
}

export interface User {
  id: number;
  username: string;
  avatar?: string;
  role?: string;
}

// Attendance
export interface AttendanceRecord {
  id: number;
  userId: number;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
}

// Employee
export interface Employee {
  id: number;
  empNo: string;
  empName: string;
  gender: number; // 0: Female, 1: Male
  mobile: string;
  email: string;
  deptId: number;
  deptName?: string;
  position: string;
  hireDate: string;
  status: number; // 1: Active, 0: Inactive
  avatar?: string;
}

// Department
export interface Dept {
  id: number;
  deptName: string;
  parentId: number;
  managerName?: string;
  deptCode: string;
}

// Meeting
export interface MeetingReservation {
  id: number;
  meetingTitle: string;
  roomId: number;
  roomName?: string;
  startTime: string;
  endTime: string;
  organizerName?: string;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  description?: string;
}

// Contract
export interface Contract {
  id: number;
  contractNo: string;
  contractName: string;
  amount: number;
  partyA: string;
  partyB: string;
  signDate: string;
  endDate: string;
  contractStatus: number; // 0: Draft, 1: Active, 2: Expired
  approvalStatus: number;
}

// Equipment
export interface Equipment {
  id: number;
  equipmentName: string;
  equipmentNo: string;
  status: number; // 1: Available, 2: Borrowed, 3: Maintenance
  categoryName?: string;
}

// Notices
export interface Notice {
  id: number;
  title: string;
  content: string;
  publishTime: string;
  publisherName?: string;
  noticeType: number;
}

// Role (New)
export interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: number; // 1: Active, 0: Disabled
  createTime: string;
}

// Permission (New)
export interface Permission {
  id: number;
  permName: string;
  permCode: string;
  parentId: number;
  type: number; // 1: Menu, 2: Button
  path?: string;
}

// Leave (New)
export interface LeaveRecord {
  id: number;
  userId: number;
  userName: string;
  leaveType: number; // 1: Sick, 2: Annual, 3: Personal
  startTime: string;
  endTime: string;
  reason: string;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  approvalRemark?: string;
}

export interface LeaveApplyDTO {
  leaveType: number;
  startTime: string;
  endTime: string;
  reason: string;
}

// Mock Types for UI State
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
