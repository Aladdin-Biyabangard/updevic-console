// src/components/admin/BalanceOverviewCards.tsx
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceOverview } from "@/lib/api/adminPaymentsApi";

interface BalanceOverviewCardsProps {
    balanceOverview: BalanceOverview;
    formatCurrency: (amount: number) => string;
}

export const BalanceOverviewCards = ({ balanceOverview, formatCurrency }: BalanceOverviewCardsProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance Card */}
        <Card className="bg-gradient-card border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(balanceOverview.totalBalance)}</div>
            </CardContent>
        </Card>

        {/* Monthly Income Card */}
        <Card className="bg-gradient-card border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-success">{formatCurrency(balanceOverview.monthlyIncome)}</div>
            </CardContent>
        </Card>

        {/* Monthly Outcome Card */}
        <Card className="bg-gradient-card border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Outcome</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">{formatCurrency(balanceOverview.monthlyOutcome)}</div>
            </CardContent>
        </Card>
    </div>
);
