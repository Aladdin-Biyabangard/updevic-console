// src/components/admin/TransactionFilters.tsx
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/lib/api/adminPaymentsApi";

interface PaymentFilters {
    fromDate: string;
    toDate: string;
    type: TransactionType | "";
}

interface TransactionFiltersProps {
    filters: PaymentFilters;
    setFilters: React.Dispatch<React.SetStateAction<PaymentFilters>>;
    handleSearch: () => void;
    handleClearFilters: () => void;
}

export const TransactionFilters = ({ filters, setFilters, handleSearch, handleClearFilters }: TransactionFiltersProps) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                    id="fromDate"
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                    id="toDate"
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                    value={filters.type || "all"}
                    onValueChange={(value) =>
                        setFilters(prev => ({ ...prev, type: value === "all" ? "" : value as TransactionType }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="OUTCOME">Outcome</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="flex gap-2">
            <Button onClick={handleSearch}><Filter className="h-4 w-4 mr-2" /> Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
    </div>
);
