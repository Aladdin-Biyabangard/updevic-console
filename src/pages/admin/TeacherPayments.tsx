import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Eye, DollarSign, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockTeacherPayments, TeacherPayment } from "@/lib/mockData";

interface PaymentFilters {
  search: string;
  status: string;
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

  const statusOptions = ["paid", "pending"];

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.teacherName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         payment.teacherId.toLowerCase().includes(filters.search.toLowerCase()) ||
                         payment.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || payment.status === filters.status;
    
    const matchesDateFrom = !filters.dateFrom || new Date(payment.paymentDate) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(payment.paymentDate) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleClear = () => {
    setFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <Badge className="bg-success/10 text-success hover:bg-success/20">Paid</Badge>;
    }
    return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Pending</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateStats = () => {
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
    
    return { totalAmount, paidAmount, pendingAmount };
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPayments(mockTeacherPayments);
      setLoading(false);
    }, 300);
  }, []);

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Payments</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track teacher payment records
          </p>
        </div>
        <Button>
          <DollarSign className="h-4 w-4 mr-2"/>
          Process Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.length} payment records
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <div className="w-3 h-3 bg-success rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'paid').length} completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(stats.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5"/>
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Teacher name, ID, or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  status: value === "all" ? "" : value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.search || filters.status || filters.dateFrom || filters.dateTo) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {filters.search}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({...prev, search: ""}))}
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({...prev, status: ""}))}
                  />
                </Badge>
              )}
              {filters.dateFrom && (
                <Badge variant="secondary" className="gap-1">
                  From: {formatDate(filters.dateFrom)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({...prev, dateFrom: ""}))}
                  />
                </Badge>
              )}
              {filters.dateTo && (
                <Badge variant="secondary" className="gap-1">
                  To: {formatDate(filters.dateTo)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters(prev => ({...prev, dateTo: ""}))}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-2"/>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading payments...</div>
            </div>
          ) : (
            <div className="rounded-md border">
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
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.teacherName}</div>
                          <div className="text-sm text-muted-foreground">{payment.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{payment.teacherId}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2"/>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Payment Details - {payment.teacherName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Teacher Name</Label>
                                  <p className="font-medium">{payment.teacherName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Teacher ID</Label>
                                  <p className="font-mono">{payment.teacherId}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                  <p>{payment.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                  <div className="mt-1">{getStatusBadge(payment.status)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                                  <p className="text-lg font-semibold">{formatCurrency(payment.amount)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Payment Date</Label>
                                  <p>{formatDate(payment.paymentDate)}</p>
                                </div>
                              </div>
                              
                              {payment.description && (
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                  <p className="mt-1">{payment.description}</p>
                                </div>
                              )}

                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Payment History</Label>
                                <div className="mt-2 space-y-2">
                                  {payment.paymentHistory.map((history, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                      <div>
                                        <p className="font-medium">{formatCurrency(history.amount)}</p>
                                        <p className="text-sm text-muted-foreground">{history.description}</p>
                                      </div>
                                      <div className="text-right">
                                        <div>{getStatusBadge(history.status)}</div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {formatDate(history.date)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredPayments.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No payment records found matching your criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}