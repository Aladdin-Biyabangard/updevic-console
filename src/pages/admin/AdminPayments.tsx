// src/pages/admin/AdminPayments.tsx
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    BalanceOverview,
    getPaymentStats,
    getTransactions,
    MonthlyBalanceData,
    Transaction,
    TransactionType,
    transformMonthlyStats,
    transformStatsToBalanceOverview
} from "@/lib/api/adminPaymentsApi";

import { BalanceOverviewCards } from "@/components/admin/payment/BalanceOverviewCards";
import { MonthlyBalanceChart } from "@/components/admin/payment/MonthlyBalanceChart";
import { TransactionFilters } from "@/components/admin/payment/TransactionFilters";
import { TransactionsTable } from "@/components/admin/payment/TransactionsTable";

interface PaymentFilters {
    fromDate: string;
    toDate: string;
    type: TransactionType | "";
}

export default function AdminPayments() {
    const [balanceOverview, setBalanceOverview] = useState<BalanceOverview | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyBalanceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<PaymentFilters>({
        fromDate: "",
        toDate: "",
        type: ""
    });

    const { toast } = useToast();

    const fetchBalanceOverview = async () => {
        try {
            const statsData = await getPaymentStats();
            setBalanceOverview(transformStatsToBalanceOverview(statsData));
            setMonthlyData(transformMonthlyStats(statsData.monthlyStats));
        } catch (err) {
            console.error("Failed to fetch payment stats", err);
            toast({ title: "Error", description: "Failed to fetch payment statistics", variant: "destructive" });
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await getTransactions({
                page: 0,
                size: 100,
                criteria: {
                    dateFrom: filters.fromDate || undefined,
                    toDate: filters.toDate || undefined,
                    transactionType: filters.type || undefined
                }
            });
            setTransactions(response.content);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
            toast({ title: "Error", description: "Failed to fetch transactions", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalanceOverview();
        fetchTransactions();
    }, []);

    const handleSearch = () => fetchTransactions();
    const handleClearFilters = () => setFilters({ fromDate: "", toDate: "", type: "" });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Admin Payments</h1>
                    <p className="text-muted-foreground mt-2">
                        System-wide payment management and financial overview
                    </p>
                </div>
            </div>

            {/* Balance Overview */}
            {balanceOverview && (
                <BalanceOverviewCards balanceOverview={balanceOverview} formatCurrency={formatCurrency} />
            )}

            {/* Monthly Balance Chart */}
            <MonthlyBalanceChart monthlyData={monthlyData} formatCurrency={formatCurrency} />

            {/* Transaction Filters */}
            <TransactionFilters
                filters={filters}
                setFilters={setFilters}
                handleSearch={handleSearch}
                handleClearFilters={handleClearFilters}
            />

            {/* Transactions Table */}
            <TransactionsTable
                transactions={transactions}
                loading={loading}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                fetchTransactions={fetchTransactions}
            />
        </div>
    );
}
