// Mock data for the admin panel

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive';
  lastLogin: string;
  dateCreated: string;
  avatar?: string;
}

export interface TeacherApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  subject: string;
  experience: number;
  status: 'pending' | 'approved' | 'rejected';
  dateApplied: string;
  certificate: string;
  read: boolean;
}

export interface Certificate {
  id: string;
  studentName: string;
  course: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  studentsEnrolled: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface Notification {
  id: string;
  type: 'user_role_change' | 'application_approval' | 'certificate_issued' | 'course_created';
  message: string;
  date: string;
  read: boolean;
  userId?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    roles: ['Admin', 'Teacher'],
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    dateCreated: '2023-06-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    roles: ['Teacher'],
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    dateCreated: '2023-08-20T09:30:00Z',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    roles: ['Student'],
    status: 'inactive',
    lastLogin: '2024-01-10T12:15:00Z',
    dateCreated: '2023-09-05T14:20:00Z',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    roles: ['Teacher'],
    status: 'active',
    lastLogin: '2024-01-15T09:20:00Z',
    dateCreated: '2023-07-12T11:10:00Z',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    roles: ['Admin'],
    status: 'active',
    lastLogin: '2024-01-15T08:00:00Z',
    dateCreated: '2023-05-30T10:00:00Z',
  },
];

// Mock Teacher Applications
export const mockApplications: TeacherApplication[] = [
  {
    id: '1',
    applicantName: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@example.com',
    phone: '+1 (555) 123-4567',
    subject: 'Mathematics',
    experience: 5,
    status: 'pending',
    dateApplied: '2024-01-10T14:30:00Z',
    certificate: 'Mathematics Teaching Certificate',
    read: false,
  },
  {
    id: '2',
    applicantName: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '+1 (555) 987-6543',
    subject: 'Science',
    experience: 3,
    status: 'approved',
    dateApplied: '2024-01-08T11:20:00Z',
    certificate: 'Science Education Degree',
    read: true,
  },
  {
    id: '3',
    applicantName: 'Amanda Lee',
    email: 'amanda.lee@example.com',
    phone: '+1 (555) 456-7890',
    subject: 'English',
    experience: 7,
    status: 'pending',
    dateApplied: '2024-01-12T16:45:00Z',
    certificate: 'English Literature Masters',
    read: false,
  },
  {
    id: '4',
    applicantName: 'Carlos Martinez',
    email: 'carlos.martinez@example.com',
    phone: '+1 (555) 321-9876',
    subject: 'History',
    experience: 4,
    status: 'rejected',
    dateApplied: '2024-01-05T13:15:00Z',
    certificate: 'History Teaching License',
    read: true,
  },
];

// Mock Certificates
export const mockCertificates: Certificate[] = [
  {
    id: '1',
    studentName: 'Alex Thompson',
    course: 'Advanced Mathematics',
    issueDate: '2024-01-01T00:00:00Z',
    expirationDate: '2025-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    studentName: 'Jessica Wang',
    course: 'Computer Science Fundamentals',
    issueDate: '2023-12-15T00:00:00Z',
    expirationDate: '2024-12-15T00:00:00Z',
    status: 'active',
  },
  {
    id: '3',
    studentName: 'Ryan Clark',
    course: 'Physics Lab',
    issueDate: '2023-06-30T00:00:00Z',
    expirationDate: '2024-06-30T00:00:00Z',
    status: 'expired',
  },
  {
    id: '4',
    studentName: 'Maya Patel',
    course: 'Creative Writing',
    issueDate: '2024-01-10T00:00:00Z',
    expirationDate: '2025-01-10T00:00:00Z',
    status: 'active',
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    teacher: 'Sarah Johnson',
    studentsEnrolled: 28,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-05-15T00:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Computer Science Fundamentals',
    teacher: 'John Smith',
    studentsEnrolled: 35,
    startDate: '2024-01-08T00:00:00Z',
    endDate: '2024-04-08T00:00:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Physics Lab',
    teacher: 'Emily Davis',
    studentsEnrolled: 22,
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-12-15T00:00:00Z',
    status: 'completed',
  },
  {
    id: '4',
    name: 'Creative Writing',
    teacher: 'Mike Chen',
    studentsEnrolled: 18,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-01T00:00:00Z',
    status: 'inactive',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application_approval',
    message: 'Teacher application from Robert Brown has been approved',
    date: '2024-01-15T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'user_role_change',
    message: 'John Smith role changed to Admin',
    date: '2024-01-14T16:20:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'certificate_issued',
    message: 'Certificate issued to Maya Patel for Creative Writing',
    date: '2024-01-14T14:15:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'course_created',
    message: 'New course "Advanced Mathematics" created by Sarah Johnson',
    date: '2024-01-13T11:00:00Z',
    read: false,
  },
];

// Dashboard Statistics
export const dashboardStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(u => u.status === 'active').length,
  pendingUsers: mockUsers.filter(u => u.status === 'inactive').length,
  pendingApplications: mockApplications.filter(a => a.status === 'pending').length,
  totalCourses: mockCourses.length,
  activeCourses: mockCourses.filter(c => c.status === 'active').length,
  totalCertificates: mockCertificates.length,
  activeCertificates: mockCertificates.filter(c => c.status === 'active').length,
};

// Chart data
export const chartData = {
  userRoles: [
    { name: 'Admin', value: mockUsers.filter(u => u.roles.includes('Admin')).length, color: '#3b82f6' },
    { name: 'Teacher', value: mockUsers.filter(u => u.roles.includes('Teacher')).length, color: '#10b981' },
    { name: 'Student', value: mockUsers.filter(u => u.roles.includes('Student')).length, color: '#f59e0b' },
  ],
  applicationStatus: [
    { name: 'Pending', value: mockApplications.filter(a => a.status === 'pending').length, color: '#f59e0b' },
    { name: 'Approved', value: mockApplications.filter(a => a.status === 'approved').length, color: '#10b981' },
    { name: 'Rejected', value: mockApplications.filter(a => a.status === 'rejected').length, color: '#ef4444' },
  ],
  monthlyActivity: [
    { month: 'Sep', applications: 12, certificates: 8, courses: 3 },
    { month: 'Oct', applications: 19, certificates: 15, courses: 5 },
    { month: 'Nov', applications: 8, certificates: 12, courses: 2 },
    { month: 'Dec', applications: 15, certificates: 18, courses: 4 },
    { month: 'Jan', applications: 22, certificates: 25, courses: 6 },
  ],
};