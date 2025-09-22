import axiosInstance from "../axios";

// ---- Types ----
export type TransactionType = "INCOME" | "OUTCOME";

export interface Transaction {
    transactionId: string;
    amount: number;
    transactionType: TransactionType;
    status: string;
    description: string;
    paymentDate: string;
}

export interface BalanceOverview {
    totalBalance: number;
    totalIncome: number;
    totalExpenditure: number;
    monthlyIncome?: number;
    monthlyOutcome?: number;
    currentAvailableBalance?: number;
}

export interface MonthlyStats {
    month: string;
    monthlyIncome: number;
    monthlyExpenditure: number;
    monthlyTotalBalance: number;
}

export interface StatsResponse {
    totalBalance: number;
    totalIncome: number;
    totalExpenditure: number;
    monthlyStats: MonthlyStats[];
}

export interface MonthlyBalanceData {
    month: string;
    income: number;
    outcome: number;
    balance: number;
}

export interface TransactionFilters {
    dateFrom?: string; // yyyy-MM-dd
    toDate?: string;   // yyyy-MM-dd
    transactionType?: TransactionType;
}

export interface TransactionsRequest {
    page: number;
    size: number;
    criteria?: TransactionFilters;
}

export interface TransactionsResponse {
    content: Transaction[];
    page: number;
    size: number;
    totalElements: number;
}

// ---- API Calls ----

// GET /api/v1/admins/payments/stats
export const getPaymentStats = async (): Promise<StatsResponse> => {
    const response = await axiosInstance.get("/admins/payments/stats");
    return response.data;
};

// GET /api/v1/admins/payments
export const getTransactions = async (
    request: TransactionsRequest
): Promise<TransactionsResponse> => {
    const response = await axiosInstance.get("/admins/payments", {
        params: request,
    });
    return response.data;
};

// PUT /api/v1/admins/payments/{transactionId}
export const updateTransactionDescription = async (
    transactionId: string, // indi string, backend ilə eyni
    description: string
): Promise<void> => {
    await axiosInstance.put(`/admins/payments/${transactionId}`, null, {
        params: { description }
    });
};

// Transform stats response to balance overview
export const transformStatsToBalanceOverview = (stats: StatsResponse): BalanceOverview => ({
    totalBalance: stats.totalBalance,
    totalIncome: stats.totalIncome,
    totalExpenditure: stats.totalExpenditure,
    monthlyIncome: stats.totalIncome,
    monthlyOutcome: stats.totalExpenditure,
    currentAvailableBalance: stats.totalBalance - stats.totalExpenditure
});

// Transform monthly stats to chart data
export const transformMonthlyStats = (monthlyStats: MonthlyStats[]): MonthlyBalanceData[] =>
    monthlyStats.map(stat => ({
        month: stat.month,
        income: stat.monthlyIncome,
        outcome: stat.monthlyExpenditure,
        balance: stat.monthlyTotalBalance
    }));

// Mock data for development
