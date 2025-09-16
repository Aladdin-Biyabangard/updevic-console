import axiosInstance from "../axios";

// ---- Types ----
export type TransactionType = "INCOME" | "OUTCOME";

export interface Transaction {
    id: number;
    amount: number;
    type: TransactionType;
    description: string;
    date: string; // ISO date
}

export interface BalanceOverview {
    totalBalance: number;
    monthlyIncome: number;
    monthlyOutcome: number;
    currentAvailableBalance: number;
}

export interface MonthlyBalanceData {
    month: string;
    income: number;
    outcome: number;
    balance: number;
}

export interface TransactionFilters {
    fromDate?: string; // yyyy-MM-dd
    toDate?: string;   // yyyy-MM-dd
    type?: TransactionType;
}

export interface TransactionsRequest {
    page: number;
    size: number;
    filters?: TransactionFilters;
}

export interface TransactionsResponse {
    content: Transaction[];
    page: number;
    size: number;
    totalElements: number;
}

// ---- API Calls ----

// GET /api/v1/admins/payments/balance-overview
export const getBalanceOverview = async (): Promise<BalanceOverview> => {
    const response = await axiosInstance.get("/admins/payments/balance-overview");
    return response.data;
};

// GET /api/v1/admins/payments/transactions
export const getTransactions = async (
    request: TransactionsRequest
): Promise<TransactionsResponse> => {
    const response = await axiosInstance.get("/admins/payments/transactions", {
        params: request,
    });
    return response.data;
};

// GET /api/v1/admins/payments/monthly-report
export const getMonthlyBalanceReport = async (): Promise<MonthlyBalanceData[]> => {
    const response = await axiosInstance.get("/admins/payments/monthly-report");
    return response.data;
};

// Mock data for development
export const getMockBalanceOverview = (): BalanceOverview => ({
    totalBalance: 125430.50,
    monthlyIncome: 35200.00,
    monthlyOutcome: 18750.25,
    currentAvailableBalance: 106680.25
});

export const getMockTransactions = (): Transaction[] => [
    { id: 1, amount: 2500.00, type: "INCOME", description: "Course enrollment fee", date: "2024-01-15T10:30:00Z" },
    { id: 2, amount: 1200.00, type: "OUTCOME", description: "Teacher payment - John Doe", date: "2024-01-14T14:20:00Z" },
    { id: 3, amount: 3750.00, type: "INCOME", description: "Premium subscription", date: "2024-01-13T09:15:00Z" },
    { id: 4, amount: 800.00, type: "OUTCOME", description: "Platform maintenance", date: "2024-01-12T16:45:00Z" },
    { id: 5, amount: 1500.00, type: "INCOME", description: "Corporate training package", date: "2024-01-11T11:30:00Z" },
];

export const getMockMonthlyData = (): MonthlyBalanceData[] => [
    { month: "Jan 2024", income: 45000, outcome: 28000, balance: 17000 },
    { month: "Feb 2024", income: 52000, outcome: 31000, balance: 21000 },
    { month: "Mar 2024", income: 48000, outcome: 29500, balance: 18500 },
    { month: "Apr 2024", income: 55000, outcome: 33000, balance: 22000 },
    { month: "May 2024", income: 51000, outcome: 30000, balance: 21000 },
    { month: "Jun 2024", income: 58000, outcome: 35000, balance: 23000 },
];