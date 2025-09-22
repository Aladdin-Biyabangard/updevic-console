import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationCriteria } from "@/lib/api/applications";

interface Props {
    tempFilters: ApplicationCriteria;
    setTempFilters: (filters: ApplicationCriteria) => void;
    handleSearch: () => void;
    handleClearFilters: () => void;
    loading: boolean;
}

const statusOptions = ["PENDING", "APPROVED", "REJECTED", "CREATED", "ACTIVE", "DEACTIVATED"];

export default function ApplicationFilters({ tempFilters, setTempFilters, handleSearch, handleClearFilters, loading }: Props) {
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
                            onChange={(e) => setTempFilters({...tempFilters, fullName: e.target.value})}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            placeholder="Search by email..."
                            value={tempFilters.email || ""}
                            onChange={(e) => setTempFilters({...tempFilters, email: e.target.value})}
                        />
                    </div>

                    {/* Teaching Field */}
                    <div className="space-y-2">
                        <Label>Teaching Field</Label>
                        <Input
                            placeholder="Search by subject..."
                            value={tempFilters.teachingField || ""}
                            onChange={(e) => setTempFilters({...tempFilters, teachingField: e.target.value})}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            placeholder="Search by phone..."
                            value={tempFilters.phone || ""}
                            onChange={(e) => setTempFilters({...tempFilters, phone: e.target.value})}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={tempFilters.status || ""}
                            onValueChange={(value) => setTempFilters({...tempFilters, status: value === "all" ? "" : value})}
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
                            onChange={(e) => setTempFilters({...tempFilters, createdAtFrom: e.target.value})}
                        />
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                        <Label>Created To</Label>
                        <Input
                            type="date"
                            value={tempFilters.createdAtTo || ""}
                            onChange={(e) => setTempFilters({...tempFilters, createdAtTo: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button onClick={handleSearch} disabled={loading}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                    <Button variant="outline" onClick={handleClearFilters} disabled={loading}>
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
