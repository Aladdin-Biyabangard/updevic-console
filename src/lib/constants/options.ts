/**
 * Common options and constants used across the application
 */

// Status options
export const APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED", "CREATED", "ACTIVE", "DEACTIVATED"] as const;
export const PAYMENT_STATUSES = ["PAID", "PENDING", "CANCELED", "INACTIVE"] as const;
export const CERTIFICATE_STATUSES = ["ACTIVE", "EXPIRED", "REVOKED"] as const;
export const USER_STATUSES = ["CREATED", "ACTIVE", "DEACTIVATED", "SUSPENDED"] as const;
export const USER_ROLES = ["ADMIN", "TEACHER", "STUDENT", "MODERATOR"] as const;

// Status option arrays for forms
export const applicationStatusOptions = APPLICATION_STATUSES.map(status => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase()
}));

export const paymentStatusOptions = PAYMENT_STATUSES.map(status => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase()
}));

export const certificateStatusOptions = CERTIFICATE_STATUSES.map(status => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase()
}));

export const userStatusOptions = USER_STATUSES.map(status => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase()
}));

export const userRoleOptions = USER_ROLES.map(role => ({
    value: role,
    label: role.charAt(0) + role.slice(1).toLowerCase()
}));

// Filter options with "All" option
export const filterStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...applicationStatusOptions
];

export const filterPaymentStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...paymentStatusOptions
];

export const filterCertificateStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...certificateStatusOptions
];

export const filterUserStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...userStatusOptions
];

export const filterRoleOptions = [
    { value: 'all', label: 'All Roles' },
    ...userRoleOptions
];

// Common pagination options
export const PAGE_SIZE_OPTIONS = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
];

// Date filter presets
export const DATE_FILTER_PRESETS = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
    { value: 'thisYear', label: 'This year' },
    { value: 'custom', label: 'Custom range' },
];

// Common sort options
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'status', label: 'By status' },
];

// Transaction types
export const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "REFUND", "ADJUSTMENT"] as const;

export const transactionTypeOptions = TRANSACTION_TYPES.map(type => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase()
}));

export const filterTransactionTypeOptions = [
    { value: 'all', label: 'All Types' },
    ...transactionTypeOptions
];

// Export types for components
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
export type PaymentStatus = typeof PAYMENT_STATUSES[number];
export type CertificateStatus = typeof CERTIFICATE_STATUSES[number];
export type UserStatus = typeof USER_STATUSES[number];
export type UserRole = typeof USER_ROLES[number];
export type TransactionType = typeof TRANSACTION_TYPES[number];