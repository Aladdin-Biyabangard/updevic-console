// src/components/admin/TransactionsTable.tsx
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditableDescriptionCell } from "@/components/admin/payment/EditableDescriptionCell";
import { Transaction, TransactionType } from "@/lib/api/adminPaymentsApi";

interface TransactionsTableProps {
    transactions: Transaction[];
    loading: boolean;
    formatCurrency: (amount: number) => string;
    formatDate: (date: string) => string;
    fetchTransactions: () => void;
}

export const TransactionsTable = ({ transactions, loading, formatCurrency, formatDate, fetchTransactions }: TransactionsTableProps) => {

    const getTransactionBadge = (type: TransactionType, amount: number) =>
        type === "INCOME" ? (
            <Badge className="bg-success/10 text-success hover:bg-success/20">
                <ArrowUpCircle className="h-3 w-3 mr-1" />+{formatCurrency(amount)}
            </Badge>
        ) : (
            <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                <ArrowDownCircle className="h-3 w-3 mr-1" />-{formatCurrency(amount)}
            </Badge>
        );

    if (loading) return (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading transactions...
        </div>
    );

    return (
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
                {transactions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No transactions found
                        </TableCell>
                    </TableRow>
                )}
                {transactions.map(transaction => (
                    <TableRow key={transaction.transactionId}>
                        <TableCell className="font-mono text-sm">#{transaction.transactionId}</TableCell>
                        <TableCell>{getTransactionBadge(transaction.transactionType, transaction.amount)}</TableCell>
                        <TableCell>
                            <Badge variant={transaction.transactionType === "INCOME" ? "default" : "secondary"}>
                                {transaction.transactionType === "INCOME" ? "Income" : "Outcome"}
                            </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                            <EditableDescriptionCell
                                transactionId={transaction.transactionId.toString()}
                                description={transaction.description}
                                onUpdated={fetchTransactions}
                            />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(transaction.paymentDate)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
