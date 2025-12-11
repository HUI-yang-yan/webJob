
import { API_BASE_URL, USE_MOCK_DATA, MOCK_EMPLOYEES, MOCK_CONTRACTS, MOCK_MEETINGS, MOCK_ATTENDANCE, MOCK_NOTICES, MOCK_DEPTS, MOCK_EQUIPMENT, MOCK_ATTENDANCE_HISTORY, MOCK_ROLES, MOCK_LEAVES } from '../constants';
import { LoginDTO, Result, PageDTO, Employee, Contract, MeetingReservation, AttendanceRecord, Notice, Dept, Equipment, Role, Permission, LeaveRecord, LeaveApplyDTO } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function request<T>(endpoint: string, options?: RequestInit): Promise<Result<T>> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.hash = '/login'; // Redirect to login
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

// Auth Service
export const AuthService = {
  login: async (data: LoginDTO): Promise<Result<{ token: string, user: any }>> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return { code: 200, msg: 'Success', data: { token: 'mock-token-123', user: { id: 1, username: 'admin', role: 'admin' } } };
    }
    return request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  },
  logout: async () => {
    if (USE_MOCK_DATA) return { code: 200, msg: 'Success', data: null };
    return request('/auth/logout', { method: 'POST' });
  }
};

// Employee Service
export const EmployeeService = {
  list: async (page: PageDTO): Promise<Result<{ total: number, records: Employee[] }>> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { code: 200, msg: 'Success', data: { total: MOCK_EMPLOYEES.length, records: MOCK_EMPLOYEES } };
    }
    const query = new URLSearchParams({ page: page.page.toString(), size: page.size.toString() }).toString();
    return request(`/employee/list?${query}`);
  },
  add: async (data: Partial<Employee>) => {
    return request('/employee', { method: 'POST', body: JSON.stringify(data) });
  },
  delete: async (id: number) => {
    return request(`/employee/${id}`, { method: 'DELETE' });
  }
};

// Department Service
export const DeptService = {
  list: async (): Promise<Result<Dept[]>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { code: 200, msg: 'Success', data: MOCK_DEPTS };
    }
    return request('/dept/all');
  }
};

// Contract Service
export const ContractService = {
  list: async (page: PageDTO): Promise<Result<{ total: number, records: Contract[] }>> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return { code: 200, msg: 'Success', data: { total: MOCK_CONTRACTS.length, records: MOCK_CONTRACTS } };
    }
    const query = new URLSearchParams({ page: page.page.toString(), size: page.size.toString() }).toString();
    return request(`/contract/list?${query}`);
  },
  getStats: async () => {
     if (USE_MOCK_DATA) {
        return { code: 200, msg: 'Success', data: [ { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 2000 }, { name: 'Apr', value: 2780 } ]}
     }
     return request('/contract/statistics');
  }
};

// Meeting Service
export const MeetingService = {
  getMy: async (page: PageDTO): Promise<Result<{ total: number, records: MeetingReservation[] }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { code: 200, msg: 'Success', data: { total: MOCK_MEETINGS.length, records: MOCK_MEETINGS } };
    }
    const query = new URLSearchParams({ page: page.page.toString(), size: page.size.toString() }).toString();
    return request(`/meeting/my?${query}`);
  }
};

// Attendance Service
export const AttendanceService = {
  getToday: async (): Promise<Result<AttendanceRecord>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { code: 200, msg: 'Success', data: MOCK_ATTENDANCE };
    }
    return request('/api/attendance/today');
  },
  list: async (page: PageDTO): Promise<Result<{total: number, records: AttendanceRecord[]}>> => {
     if (USE_MOCK_DATA) {
        await delay(300);
        return { code: 200, msg: 'Success', data: { total: MOCK_ATTENDANCE_HISTORY.length, records: MOCK_ATTENDANCE_HISTORY }};
     }
     return request(`/api/attendance/list`); 
  },
  checkIn: async () => request('/api/attendance/check-in', { method: 'POST' }),
  checkOut: async () => request('/api/attendance/check-out', { method: 'POST' })
};

// Equipment Service
export const EquipmentService = {
    list: async (page: PageDTO): Promise<Result<{total: number, records: Equipment[]}>> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            return { code: 200, msg: 'Success', data: { total: MOCK_EQUIPMENT.length, records: MOCK_EQUIPMENT }};
        }
        return request(`/equipment/list`);
    }
}

// Notice Service
export const NoticeService = {
  getLatest: async (limit: number = 5): Promise<Result<Notice[]>> => {
      if (USE_MOCK_DATA) {
          return { code: 200, msg: 'Success', data: MOCK_NOTICES };
      }
      return request(`/notice/latest?limit=${limit}`);
  },
  list: async (page: PageDTO): Promise<Result<{total: number, records: Notice[]}>> => {
      if(USE_MOCK_DATA) {
          return { code: 200, msg: 'Success', data: { total: MOCK_NOTICES.length, records: MOCK_NOTICES }};
      }
      return request(`/notice/list`);
  }
};

// Role Service
export const RoleService = {
  list: async (page: PageDTO): Promise<Result<{ total: number, records: Role[] }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return { code: 200, msg: 'Success', data: { total: MOCK_ROLES.length, records: MOCK_ROLES } };
    }
    const query = new URLSearchParams({ page: page.page.toString(), size: page.size.toString() }).toString();
    return request(`/role/list?${query}`);
  },
  add: async (data: Partial<Role>) => {
    if (USE_MOCK_DATA) {
        MOCK_ROLES.push({ ...data, id: MOCK_ROLES.length + 1 } as Role);
        return { code: 200, msg: 'Success', data: null };
    }
    return request('/role', { method: 'POST', body: JSON.stringify(data) });
  },
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
        const idx = MOCK_ROLES.findIndex(r => r.id === id);
        if (idx !== -1) MOCK_ROLES.splice(idx, 1);
        return { code: 200, msg: 'Success', data: null };
    }
    return request(`/role/${id}`, { method: 'DELETE' });
  }
};

// Leave Service
export const LeaveService = {
    my: async (page: PageDTO): Promise<Result<{ total: number, records: LeaveRecord[] }>> => {
        if(USE_MOCK_DATA) {
            await delay(300);
            return { code: 200, msg: 'Success', data: { total: MOCK_LEAVES.length, records: MOCK_LEAVES }};
        }
        return request('/leave/my');
    },
    todo: async (page: PageDTO): Promise<Result<{ total: number, records: LeaveRecord[] }>> => {
        if(USE_MOCK_DATA) {
            await delay(300);
            return { code: 200, msg: 'Success', data: { total: MOCK_LEAVES.filter(l => l.status === 0).length, records: MOCK_LEAVES.filter(l => l.status === 0) }};
        }
        return request('/leave/approval/todo');
    },
    apply: async (data: LeaveApplyDTO) => {
        if(USE_MOCK_DATA) {
            MOCK_LEAVES.push({ 
                id: MOCK_LEAVES.length + 1, 
                userId: 1, 
                userName: 'Admin User', 
                status: 0,
                ...data 
            });
            return { code: 200, msg: 'Success', data: null };
        }
        return request('/leave/apply', { method: 'POST', body: JSON.stringify(data) });
    },
    approve: async (id: number, approved: boolean, comment: string) => {
        if(USE_MOCK_DATA) {
            const leave = MOCK_LEAVES.find(l => l.id === id);
            if (leave) {
                leave.status = approved ? 1 : 2;
                leave.approvalRemark = comment;
            }
            return { code: 200, msg: 'Success', data: null };
        }
        return request(`/leave/approve/${id}?approved=${approved}&comment=${comment}`, { method: 'POST' });
    }
};
