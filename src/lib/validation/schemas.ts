import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .max(254, 'Email is too long'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password is too long')
});

// User search schemas
export const userSearchSchema = z.object({
  firstName: z.string().max(50, 'First name is too long').optional(),
  email: z.string().email('Invalid email format').max(254, 'Email is too long').optional(),
  roles: z.array(z.enum(['ADMIN', 'TEACHER', 'STUDENT'])).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

// Application search schemas
export const applicationSearchSchema = z.object({
  fullName: z.string().max(100, 'Name is too long').optional(),
  email: z.string().email('Invalid email format').max(254, 'Email is too long').optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  teachingField: z.string().max(100, 'Teaching field is too long').optional(),
  phone: z.string().max(20, 'Phone is too long').optional(),
  createdAtFrom: z.string().optional(),
  createdAtTo: z.string().optional()
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(0, 'Page must be non-negative').default(0),
  size: z.number().min(1, 'Size must be positive').max(100, 'Size cannot exceed 100').default(20)
});

// Role management schemas
export const userRoleSchema = z.object({
  id: z.number().positive('User ID must be positive'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT'])
});

// Application action schemas
export const applicationActionSchema = z.object({
  id: z.string().min(1, 'Application ID is required'),
  message: z.string().max(500, 'Message is too long').optional()
});

// Validation helpers
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>\"'&]/g, '');
};

export const validateAndSanitizeInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.errors.map(e => e.message).join(', ')}`);
  }
  return result.data;
};