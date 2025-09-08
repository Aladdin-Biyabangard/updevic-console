// Mock data for the admin panel

// New API-compatible interfaces
export interface ApiTeacherApplication {
  id: string;
  fullName: string;
  email: string;
  teachingField: string;
  linkedinProfile: string;
  githubProfile: string;
  portfolio: string;
  additionalInfo: string;
  phoneNumber: string;
  createdAt: string;
  status: 'NEW' | 'APPROVED' | 'REJECTED';
  resultMessage: string;
  completedAt: string;
}

export interface ApiUser {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  status: 'CREATED' | 'ACTIVE' | 'INACTIVE';
}

export interface ApiPaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiDashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  pendingApplicationsForTeaching: number;
}

// Original interfaces for backwards compatibility
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
  ],
};

// ============================================
// NEW API-COMPATIBLE MOCK DATA
// ============================================

// Single mock application
export const mockApplication: ApiTeacherApplication = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  fullName: "Sarah Elizabeth Martinez",
  email: "sarah.martinez@educator.com",
  teachingField: "Computer Science & Programming",
  linkedinProfile: "https://linkedin.com/in/sarah-martinez-educator",
  githubProfile: "https://github.com/sarahmartinez-dev",
  portfolio: "https://sarahmartinez.dev",
  additionalInfo: "Specialized in full-stack development with 8 years of industry experience. Passionate about making coding accessible to students of all backgrounds. Fluent in JavaScript, Python, and React.",
  phoneNumber: "+1 (555) 234-5678",
  createdAt: "2024-01-10T14:30:00.000Z",
  status: "NEW",
  resultMessage: "Application under review - initial screening in progress",
  completedAt: "2024-01-10T14:30:00.000Z"
};

// Mock applications list with pagination
export const mockApplicationsList: ApiPaginatedResponse<ApiTeacherApplication> = {
  content: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      fullName: "Sarah Elizabeth Martinez",
      email: "sarah.martinez@educator.com",
      teachingField: "Computer Science & Programming",
      linkedinProfile: "https://linkedin.com/in/sarah-martinez-educator",
      githubProfile: "https://github.com/sarahmartinez-dev",
      portfolio: "https://sarahmartinez.dev",
      additionalInfo: "Specialized in full-stack development with 8 years of industry experience. Passionate about making coding accessible to students of all backgrounds.",
      phoneNumber: "+1 (555) 234-5678",
      createdAt: "2024-01-10T14:30:00.000Z",
      status: "NEW",
      resultMessage: "Application under review - initial screening in progress",
      completedAt: "2024-01-10T14:30:00.000Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      fullName: "Dr. Michael Chen",
      email: "m.chen@mathpro.edu",
      teachingField: "Advanced Mathematics & Statistics",
      linkedinProfile: "https://linkedin.com/in/dr-michael-chen",
      githubProfile: "https://github.com/profchen-math",
      portfolio: "https://michaelchen-math.com",
      additionalInfo: "PhD in Applied Mathematics from MIT. 12 years teaching experience at university level. Published researcher in statistical modeling and data science applications.",
      phoneNumber: "+1 (555) 987-6543",
      createdAt: "2024-01-08T11:20:00.000Z",
      status: "APPROVED",
      resultMessage: "Application approved - excellent qualifications and teaching experience",
      completedAt: "2024-01-12T16:45:00.000Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      fullName: "Amanda Johnson-Lee",
      email: "amanda.lee@literature.org",
      teachingField: "English Literature & Creative Writing",
      linkedinProfile: "https://linkedin.com/in/amanda-johnson-writer",
      githubProfile: "https://github.com/amandajlee-writing",
      portfolio: "https://amandajohnsonlee.com",
      additionalInfo: "Master's in English Literature with focus on contemporary fiction. Award-winning poet and novelist. 6 years teaching high school and college-level writing courses.",
      phoneNumber: "+1 (555) 456-7890",
      createdAt: "2024-01-12T16:45:00.000Z",
      status: "NEW",
      resultMessage: "Pending review - awaiting portfolio evaluation",
      completedAt: "2024-01-12T16:45:00.000Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      fullName: "Carlos Rodriguez",
      email: "carlos.r@science-lab.edu",
      teachingField: "Physics & Laboratory Sciences",
      linkedinProfile: "https://linkedin.com/in/carlos-rodriguez-physicist",
      githubProfile: "https://github.com/crodriguez-physics",
      portfolio: "https://carlosrodriguez-science.net",
      additionalInfo: "Former NASA research scientist with expertise in quantum mechanics and experimental physics. Passionate about hands-on learning and laboratory education.",
      phoneNumber: "+1 (555) 321-9876",
      createdAt: "2024-01-05T13:15:00.000Z",
      status: "REJECTED",
      resultMessage: "Application declined - insufficient teaching experience for our current requirements",
      completedAt: "2024-01-09T10:30:00.000Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      fullName: "Dr. Priya Patel",
      email: "p.patel@biochem.university.edu",
      teachingField: "Biochemistry & Molecular Biology",
      linkedinProfile: "https://linkedin.com/in/dr-priya-patel-biochem",
      githubProfile: "https://github.com/ppatel-biotech",
      portfolio: "https://priyapatel-research.com",
      additionalInfo: "PhD in Biochemistry with postdoc at Harvard Medical School. 10+ years research experience in drug discovery. Strong background in both theoretical and practical laboratory instruction.",
      phoneNumber: "+1 (555) 654-3210",
      createdAt: "2024-01-07T09:00:00.000Z",
      status: "APPROVED",
      resultMessage: "Excellent candidate - approved for advanced biochemistry courses",
      completedAt: "2024-01-14T14:20:00.000Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440006",
      fullName: "James Wilson",
      email: "j.wilson@artdesign.studio",
      teachingField: "Digital Art & Design",
      linkedinProfile: "https://linkedin.com/in/james-wilson-designer",
      githubProfile: "https://github.com/jwilson-creative",
      portfolio: "https://jameswilson-portfolio.com",
      additionalInfo: "Senior UI/UX Designer with 7 years at top tech companies. Adobe Certified Expert in Creative Suite. Experience teaching design bootcamps and workshops.",
      phoneNumber: "+1 (555) 789-0123",
      createdAt: "2024-01-09T12:30:00.000Z",
      status: "NEW",
      resultMessage: "Under review - design portfolio assessment in progress",
      completedAt: "2024-01-09T12:30:00.000Z"
    }
  ],
  page: 0,
  size: 10,
  totalElements: 6,
  totalPages: 1
};

// Mock users list with pagination
export const mockUsersList: ApiPaginatedResponse<ApiUser> = {
  content: [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@admin.edu",
      roles: ["ADMIN", "TEACHER"],
      status: "ACTIVE"
    },
    {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@teacher.edu",
      roles: ["TEACHER"],
      status: "ACTIVE"
    },
    {
      firstName: "Michael",
      lastName: "Chen",
      email: "mike.chen@student.edu",
      roles: ["STUDENT"],
      status: "INACTIVE"
    },
    {
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@teacher.edu",
      roles: ["TEACHER"],
      status: "ACTIVE"
    },
    {
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@admin.edu",
      roles: ["ADMIN"],
      status: "ACTIVE"
    },
    {
      firstName: "Lisa",
      lastName: "Rodriguez",
      email: "lisa.rodriguez@teacher.edu",
      roles: ["TEACHER"],
      status: "CREATED"
    },
    {
      firstName: "Robert",
      lastName: "Brown",
      email: "robert.brown@teacher.edu",
      roles: ["TEACHER", "COORDINATOR"],
      status: "ACTIVE"
    },
    {
      firstName: "Amanda",
      lastName: "Lee",
      email: "amanda.lee@student.edu",
      roles: ["STUDENT"],
      status: "ACTIVE"
    }
  ],
  page: 0,
  size: 20,
  totalElements: 8,
  totalPages: 1
};

// Mock dashboard stats
export const mockDashboardStats: ApiDashboardStats = {
  totalUsers: 24,
  activeUsers: 18,
  pendingUsers: 4,
  pendingApplicationsForTeaching: 3
};