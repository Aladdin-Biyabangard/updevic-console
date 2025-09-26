import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationCriteria } from "@/lib/api/applications";

interface ApplicationFiltersProps {
    tempFilters: ApplicationCriteria;
    setTempFilters: React.Dispatch<React.SetStateAction<ApplicationCriteria>>;
    onSearch: () => void;
    onClearFilters: () => void;
    loading: boolean;
}

const statusOptions = ["PENDING", "APPROVED", "REJECTED", "CREATED", "ACTIVE", "DEACTIVATED"];

export const ApplicationFilters = ({
                                       tempFilters,
                                       setTempFilters,
                                       onSearch,
                                       onClearFilters,
                                       loading
                                   }: ApplicationFiltersProps) => {
    return (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Advanced Search Filters
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                            placeholder="Search by name..."
                            value={tempFilters.fullName || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            placeholder="Search by email..."
                            value={tempFilters.email || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>

                    {/* Teaching Field */}
                    <div className="space-y-2">
                        <Label>Teaching Field</Label>
                        <Input
                            placeholder="Search by subject..."
                            value={tempFilters.teachingField || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, teachingField: e.target.value }))}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            placeholder="Search by phone..."
                            value={tempFilters.phone || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={tempFilters.status || ""}
                            onValueChange={(value) => setTempFilters(prev => ({ ...prev, status: value === "all" ? "" : value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All statuses..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date From */}
                    <div className="space-y-2">
                        <Label>Created From</Label>
                        <Input
                            type="date"
                            value={tempFilters.createdAtFrom || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, createdAtFrom: e.target.value }))}
                        />
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                        <Label>Created To</Label>
                        <Input
                            type="date"
                            value={tempFilters.createdAtTo || ""}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, createdAtTo: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button onClick={onSearch} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                    <Button variant="outline" onClick={onClearFilters} disabled={loading}>
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};