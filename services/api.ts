
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
        localStorage.removeItem('user'); // Clear user data too
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
      // Simulate different roles based on username
      const role = data.username === 'user' ? 'user' : 'admin';
      const mockUser = {
          id: role === 'admin' ? 1 : 99,
          username: data.username || 'admin',
          role: role,
          avatar: role === 'admin' ? undefined : 'https://i.pravatar.cc/150?u=user' 
      };
      
      return { 
          code: 200, 
          msg: 'Success', 
          data: { 
              token: `mock-token-${role}-123`, 
              user: mockUser
          } 
      };
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
      await delay(300);
      let records = [...MOCK_EMPLOYEES];
      
      // Implement Mock Filtering
      if (page.keyword) {
          const lower = page.keyword.toLowerCase();
          records = records.filter(e => 
              e.empName.toLowerCase().includes(lower) || 
              e.empNo.toLowerCase().includes(lower) ||
              e.position.toLowerCase().includes(lower)
          );
      }
      
      return { code: 200, msg: 'Success', data: { total: records.length, records: records } };
    }
    const query = new URLSearchParams({ page: page.page.toString(), size: page.size.toString(), ...(page.keyword && { keyword: page.keyword }) }).toString();
    return request(`/employee/list?${query}`);
  },
  add: async (data: Partial<Employee>) => {
    if (USE_MOCK_DATA) {
        await delay(300);
        const newEmployee: Employee = {
            id: MOCK_EMPLOYEES.length + 1,
            empNo: `EMP00${MOCK_EMPLOYEES.length + 1}`,
            empName: data.empName || 'New Employee',
            gender: data.gender || 1,
            mobile: data.mobile || '000-000-0000',
            email: data.email || 'new@company.com',
            deptId: data.deptId || 101,
            deptName: MOCK_DEPTS.find(d => d.id == data.deptId)?.deptName || 'IT Dept',
            position: data.position || 'Staff',
            hireDate: new Date().toISOString().split('T')[0],
            status: 1
        };
        MOCK_EMPLOYEES.unshift(newEmployee);
        return { code: 200, msg: 'Success', data: null };
    }
    return request('/employee', { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: number, data: Partial<Employee>) => {
      if (USE_MOCK_DATA) {
          await delay(300);
          const idx = MOCK_EMPLOYEES.findIndex(e => e.id === id);
          if (idx !== -1) {
              const deptName = data.deptId ? MOCK_DEPTS.find(d => d.id == data.deptId)?.deptName : MOCK_EMPLOYEES[idx].deptName;
              MOCK_EMPLOYEES[idx] = { ...MOCK_EMPLOYEES[idx], ...data, deptName: deptName || '' };
          }
          return { code: 200, msg: 'Success', data: null };
      }
      return request(`/employee/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
        const idx = MOCK_EMPLOYEES.findIndex(e => e.id === id);
        if (idx !== -1) MOCK_EMPLOYEES.splice(idx, 1);
        return { code: 200, msg: 'Success', data: null };
    }
    return request(`/employee/${id}`, { method: 'DELETE' });
  }
};

// Department Service
export const DeptService = {
  list: async (): Promise<Result<Dept[]>> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return { code: 200, msg: 'Success', data: MOCK_DEPTS };
    }
    return request('/dept/all');
  }
};

// Contract Service
export const ContractService = {
  list: async (page: PageDTO): Promise<Result<{ total: number, records: Contract[] }>> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      let records = [...MOCK_CONTRACTS];
      
      // Mock Filtering
      if (page.status !== undefined && page.status !== -1) {
          records = records.filter(c => c.contractStatus === page.status);
      }
      
      return { code: 200, msg: 'Success', data: { total: records.length, records: records } };
    }
    const query = new URLSearchParams({ 
        page: page.page.toString(), 
        size: page.size.toString(),
        ...(page.status !== undefined ? { status: page.status.toString() } : {})
    }).toString();
    return request(`/contract/list?${query}`);
  },
  add: async (data: Partial<Contract>) => {
     if(USE_MOCK_DATA) {
         await delay(300);
         const newContract: Contract = {
             id: MOCK_CONTRACTS.length + 1,
             contractNo: `CTR-2023-00${MOCK_CONTRACTS.length + 1}`,
             contractName: data.contractName || 'New Contract',
             amount: data.amount || 0,
             partyA: 'Our Company',
             partyB: data.partyB || 'Client',
             signDate: new Date().toISOString().split('T')[0],
             endDate: data.endDate || new Date().toISOString().split('T')[0],
             contractStatus: 1,
             approvalStatus: 0
         };
         MOCK_CONTRACTS.unshift(newContract);
         return { code: 200, msg: 'Success', data: null };
     }
     return request('/contract', { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: number, data: Partial<Contract>) => {
    if (USE_MOCK_DATA) {
        await delay(300);
        const idx = MOCK_CONTRACTS.findIndex(c => c.id === id);
        if (idx !== -1) {
            MOCK_CONTRACTS[idx] = { ...MOCK_CONTRACTS[idx], ...data };
        }
        return { code: 200, msg: 'Success', data: null };
    }
    return request(`/contract/${id}`, { method: 'PUT', body: JSON.stringify(data) });
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
        MOCK_ROLES.push({ ...data, id: MOCK_ROLES.length + 1, status: 1 } as Role);
        return { code: 200, msg: 'Success', data: null };
    }
    return request('/role', { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: number, data: Partial<Role>) => {
    if (USE_MOCK_DATA) {
        const idx = MOCK_ROLES.findIndex(r => r.id === id);
        if (idx !== -1) {
            MOCK_ROLES[idx] = { ...MOCK_ROLES[idx], ...data };
        }
        return { code: 200, msg: 'Success', data: null };
    }
    return request(`/role/${id}`, { method: 'PUT', body: JSON.stringify(data) });
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
