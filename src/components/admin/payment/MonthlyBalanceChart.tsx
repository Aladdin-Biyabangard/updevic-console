// src/components/admin/MonthlyBalanceChart.tsx
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MonthlyBalanceData } from "@/lib/api/adminPaymentsApi";

interface MonthlyBalanceChartProps {
    monthlyData: MonthlyBalanceData[];
    formatCurrency: (amount: number) => string;
}

export const MonthlyBalanceChart = ({ monthlyData, formatCurrency }: MonthlyBalanceChartProps) => (
    <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Monthly Balance Report
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" tickFormatter={formatCurrency} />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelClassName="text-foreground"
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
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
);
