import { useState, useEffect } from "react";
import { Filter, TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import {
    Transaction,
    TransactionType,
    BalanceOverview,
    MonthlyBalanceData,
    TransactionFilters,
    getPaymentStats,
    getTransactions,
    updateTransactionDescription,
    transformStatsToBalanceOverview,
    transformMonthlyStats,
    getMockBalanceOverview,
    getMockTransactions,
    getMockMonthlyData
} from "@/lib/api/adminPaymentsApi";

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

    // Fetch balance overview and monthly data from stats API
    const fetchBalanceOverview = async () => {
        try {
            // Try real API first, fallback to mock data
            try {
                const statsData = await getPaymentStats();
                const balanceData = transformStatsToBalanceOverview(statsData);
                const monthlyChartData = transformMonthlyStats(statsData.monthlyStats);

                setBalanceOverview(balanceData);
                setMonthlyData(monthlyChartData);
            } catch (error) {
                // Use mock data if API is not available
                setBalanceOverview(getMockBalanceOverview());
                setMonthlyData(getMockMonthlyData());
            }
        } catch (err) {
            console.error("Failed to fetch payment stats", err);
            toast({
                title: "Error",
                description: "Failed to fetch payment statistics",
                variant: "destructive",
            });
        }
    };

    // Fetch transactions
    const fetchTransactions = async () => {
        setLoading(true);
        try {
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
            } catch (error) {
                // Use mock data if API is not available
                let mockTransactions = getMockTransactions();

                // Apply client-side filters to mock data
                if (filters.type) {
                    mockTransactions = mockTransactions.filter(t => t.type === filters.type);
                }
                if (filters.fromDate) {
                    mockTransactions = mockTransactions.filter(t =>
                        new Date(t.date) >= new Date(filters.fromDate)
                    );
                }
                if (filters.toDate) {
                    mockTransactions = mockTransactions.filter(t =>
                        new Date(t.date) <= new Date(filters.toDate)
                    );
                }

                setTransactions(mockTransactions);
            }
        } catch (err) {
            console.error("Failed to fetch transactions", err);
            toast({
                title: "Error",
                description: "Failed to fetch transactions",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Update transaction description
    const updateDescription = async (transactionId: number, newDescription: string) => {
        try {
            await updateTransactionDescription(transactionId, newDescription);
            // Refresh transactions to show updated description
            fetchTransactions();
            toast({
                title: "Success",
                description: "Transaction description updated successfully",
            });
        } catch (err) {
            console.error("Failed to update transaction description", err);
            toast({
                title: "Error",
                description: "Failed to update transaction description",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchBalanceOverview(); // This now fetches both balance and monthly data
        fetchTransactions();
    }, []);

    const handleSearch = () => {
        fetchTransactions();
    };

    const handleClearFilters = () => {
        setFilters({ fromDate: "", toDate: "", type: "" });
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    const getTransactionBadge = (type: TransactionType, amount: number) => {
        if (type === "IN") {
            return (
                <Badge className="bg-success/10 text-success hover:bg-success/20">
                    <ArrowUpCircle className="h-3 w-3 mr-1"/>
                    +{formatCurrency(amount)}
                </Badge>
            );
        }
        return (
            <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                <ArrowDownCircle className="h-3 w-3 mr-1"/>
                -{formatCurrency(amount)}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Admin Payments</h1>
                    <p className="text-muted-foreground mt-2">System-wide payment management and financial overview</p>
                </div>
            </div>

            {/* Balance Overview Cards */}
            {balanceOverview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-card border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {formatCurrency(balanceOverview.totalBalance)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">
                                {formatCurrency(balanceOverview.monthlyIncome)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Outcome</CardTitle>
                            <TrendingDown className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">
                                {formatCurrency(balanceOverview.monthlyOutcome)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(balanceOverview.currentAvailableBalance)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Monthly Balance Report Chart */}
            <Card className="bg-gradient-card border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Monthly Balance Report
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="month"
                                    className="text-xs fill-muted-foreground"
                                />
                                <YAxis
                                    className="text-xs fill-muted-foreground"
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    labelClassName="text-foreground"
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="income" fill="hsl(var(--success))" name="Income" />
                                <Bar dataKey="outcome" fill="hsl(var(--destructive))" name="Outcome" />
                                <Bar dataKey="balance" fill="hsl(var(--primary))" name="Net Balance" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-gradient-card border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fromDate">From Date</Label>
                            <Input
                                id="fromDate"
                                type="date"
                                value={filters.fromDate}
                                onChange={e => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="toDate">To Date</Label>
                            <Input
                                id="toDate"
                                type="date"
                                value={filters.toDate}
                                onChange={e => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Select
                                value={filters.type || "all"}
                                onValueChange={value => setFilters(prev => ({
                                    ...prev,
                                    type: value === "all" ? "" : value as TransactionType
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="IN">Income</SelectItem>
                                    <SelectItem value="OUT">Outcome</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleSearch}>
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </Button>
                        <Button variant="outline" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    </div>

                    {/* Transactions Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            Loading transactions...
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map(transaction => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-mono text-sm">
                                            #{transaction.id}
                                        </TableCell>
                                        <TableCell>
                                            {getTransactionBadge(transaction.type, transaction.amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={transaction.type === "IN" ? "default" : "secondary"}>
                                                {transaction.type === "IN" ? "Income" : "Outcome"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {transaction.description}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(transaction.date)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {transactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}