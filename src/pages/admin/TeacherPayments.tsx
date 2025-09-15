import {useState, useEffect} from "react";
import {Search, Filter, Calendar, Eye, DollarSign, X, CheckCircle, Edit} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";

import {
    TeacherPayment,
    TeacherPaymentStatus,
    TeacherPaymentsRequest,
    getTeacherPayments,
    payTeacherPayment,
    updateTeacherPaymentDescription
} from "@/lib/api/teacherPaymentsApi";

interface PaymentFilters {
    search: string;
    status: TeacherPaymentStatus | "";
    dateFrom: string;
    dateTo: string;
}

export default function TeacherPayments() {
    const [payments, setPayments] = useState<TeacherPayment[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<PaymentFilters>({
        search: "",
        status: "",
        dateFrom: "",
        dateTo: ""
    });
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<TeacherPayment | null>(null);
    const [newDescription, setNewDescription] = useState("");
    const { toast } = useToast();

    // Fetch teacher payments from backend
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const request: TeacherPaymentsRequest = {
                page: 0,
                size: 100,
                criteria: {
                    email: filters.search || undefined,
                    status: filters.status || undefined,
                    fromDate: filters.dateFrom || undefined,
                    toDate: filters.dateTo || undefined
                }
            };
            const response = await getTeacherPayments(request);
            setPayments(response.content);
        } catch (err) {
            console.error("Failed to fetch payments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleClear = () => {
        setFilters({search: "", status: "", dateFrom: "", dateTo: ""});
    };

    const handleSearch = () => {
        fetchPayments();
    };

    const getStatusBadge = (status: TeacherPaymentStatus) => {
        if (status === "PAID") return <Badge className="bg-success/10 text-success hover:bg-success/20">Paid</Badge>;
        if (status === "PENDING") return <Badge
            className="bg-destructive/10 text-destructive hover:bg-destructive/20">Pending</Badge>;
        return <Badge className="bg-muted/10 text-muted-foreground">{status}</Badge>;
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});

    const handlePay = async (id: number) => {
        try {
            await payTeacherPayment(id);
            await fetchPayments();
            toast({
                title: "Success",
                description: "Payment has been marked as paid.",
            });
        } catch (err) {
            console.error("Payment failed", err);
            toast({
                title: "Error",
                description: "Failed to mark payment as paid.",
                variant: "destructive",
            });
        }
    };

    const handleOpenUpdateModal = (payment: TeacherPayment) => {
        setSelectedPayment(payment);
        setNewDescription(payment.description);
        setUpdateModalOpen(true);
    };

    const handleUpdateDescription = async () => {
        if (!selectedPayment) return;

        try {
            await updateTeacherPaymentDescription(selectedPayment.id, newDescription);
            await fetchPayments();
            setUpdateModalOpen(false);
            setSelectedPayment(null);
            setNewDescription("");
            toast({
                title: "Success",
                description: "Payment description has been updated.",
            });
        } catch (err) {
            console.error("Update failed", err);
            toast({
                title: "Error",
                description: "Failed to update payment description.",
                variant: "destructive",
            });
        }
    };

    const handleProcessAllPending = async () => {
        const pendingPayments = payments.filter(p => p.status === "PENDING");
        for (const payment of pendingPayments) {
            try {
                await handlePay(payment.id);
            } catch (err) {
                console.error(`Failed to process payment ${payment.id}`, err);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Teacher Payments</h1>
                    <p className="text-muted-foreground mt-2">Manage and track teacher payment records</p>
                </div>
                <Button onClick={handleProcessAllPending}>
                    <DollarSign className="h-4 w-4 mr-2"/> Process All Pending
                </Button>
            </div>

            {/* Filters and Table */}
            <Card className="bg-gradient-card border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5"/> Filters &
                        Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                placeholder="Teacher name, ID, or email..."
                                value={filters.search}
                                onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <Select
                                value={filters.status || "all"}
                                onValueChange={value => setFilters(prev => ({
                                    ...prev,
                                    status: value === "all" ? "" : value as TeacherPaymentStatus
                                }))}
                            >
                                <SelectTrigger><SelectValue placeholder="All statuses"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CANCELED">Canceled</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateFrom">From Date</Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={filters.dateFrom}
                                onChange={e => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateTo">To Date</Label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={filters.dateTo}
                                onChange={e => setFilters(prev => ({...prev, dateTo: e.target.value}))}
                            />
                        </div>
                    </div>

                    {(filters.search || filters.status || filters.dateFrom || filters.dateTo) && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                            {filters.search && <Badge variant="secondary" className="gap-1">Search: {filters.search} <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setFilters(prev => ({...prev, search: ""}))}/></Badge>}
                            {filters.status && <Badge variant="secondary" className="gap-1">Status: {filters.status} <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setFilters(prev => ({...prev, status: ""}))}/></Badge>}
                            {filters.dateFrom &&
                                <Badge variant="secondary" className="gap-1">From: {filters.dateFrom} <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => setFilters(prev => ({...prev, dateFrom: ""}))}/></Badge>}
                            {filters.dateTo && <Badge variant="secondary" className="gap-1">To: {filters.dateTo} <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setFilters(prev => ({...prev, dateTo: ""}))}/></Badge>}
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button onClick={handleSearch}>
                            <Search className="h-4 w-4 mr-2"/> Search
                        </Button>
                        <Button variant="outline" onClick={handleClear}>
                            <X className="h-4 w-4 mr-2"/> Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card className="bg-gradient-card border-0 shadow-sm">
                <CardHeader><CardTitle>Payment Records ({payments.length})</CardTitle></CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">Loading
                            payments...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead>Teacher ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map(payment => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{payment.teacherName}</div>
                                                <div
                                                    className="text-sm text-muted-foreground">{payment.teacherEmail}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{payment.teacherId}</TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell
                                            className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell>{formatDate(payment.paymentDateAndTime)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-2"/>View Details
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Payment Details - {payment.teacherName}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-2 gap-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Payment ID</Label>
                                                                <p className="text-sm text-muted-foreground">{payment.id}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Teacher ID</Label>
                                                                <p className="text-sm text-muted-foreground">{payment.teacherId}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Teacher Name</Label>
                                                                <p className="text-sm text-muted-foreground">{payment.teacherName}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Teacher Email</Label>
                                                                <p className="text-sm text-muted-foreground">{payment.teacherEmail}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Course ID</Label>
                                                                <p className="text-sm text-muted-foreground">{payment.courseId}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Amount</Label>
                                                                <p className="text-sm text-muted-foreground">{formatCurrency(payment.amount)}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Status</Label>
                                                                <div>{getStatusBadge(payment.status)}</div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium">Payment Date & Time</Label>
                                                                <p className="text-sm text-muted-foreground">{new Date(payment.paymentDateAndTime).toLocaleString()}</p>
                                                            </div>
                                                            <div className="space-y-2 col-span-2">
                                                                <Label className="text-sm font-medium">Description</Label>
                                                                <p className="text-sm text-muted-foreground">{payment.description || "No description provided"}</p>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {payment.status === "PENDING" && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handlePay(payment.id)}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2"/>Paid
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenUpdateModal(payment)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2"/>Update
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Update Description Modal */}
            <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Payment Description</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter payment description..."
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpdateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateDescription}>
                            Update Description
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}