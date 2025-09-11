import { useState, useEffect } from "react";
import { Search, Filter, Download, Eye, Check, X, Trash2, Mail, FileText, Phone, Calendar, User, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { 
  searchApplications,
  getApplicationDetails,
  deleteApplication,
  markAsRead,
  rejectApplication,
  approveApplication,
  BasicApplication,
  DetailedApplication,
  ApplicationCriteria
} from "@/lib/api/applications";

export default function Applications() {
  const [applications, setApplications] = useState<BasicApplication[]>([]);
  const [detailedApplications, setDetailedApplications] = useState<Map<string, DetailedApplication>>(new Map());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Filters
  const [filters, setFilters] = useState<ApplicationCriteria>({});
  const [tempFilters, setTempFilters] = useState<ApplicationCriteria>({});
  
  // Dialog for actions
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
    applicationId: string | null;
    applicantName: string;
  }>({ open: false, type: null, applicationId: null, applicantName: "" });
  const [actionMessage, setActionMessage] = useState("");

  const { toast } = useToast();

  const statusOptions = ["PENDING", "APPROVED", "REJECTED", "CREATED", "ACTIVE", "DEACTIVATED"];

  useEffect(() => {
    fetchApplications();
  }, [filters, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await searchApplications(filters, currentPage, pageSize);
      setApplications(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDetails = async (id: string) => {
    if (detailedApplications.has(id)) return;

    try {
      const details = await getApplicationDetails(id);
      setDetailedApplications(prev => new Map(prev.set(id, details)));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch application details",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    setFilters(tempFilters);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
    setCurrentPage(0);
  };

  const handleAction = async (id: string, action: "delete" | "markRead") => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      if (action === "delete") {
        await deleteApplication(id);
        setApplications(prev => prev.filter(app => app.id !== id));
        toast({
          title: "Success",
          description: "Application deleted successfully",
        });
      } else if (action === "markRead") {
        await markAsRead(id);
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, isRead: true } : app
        ));
        toast({
          title: "Success",
          description: "Application marked as read",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} application`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleActionWithMessage = async () => {
    if (!actionDialog.applicationId || !actionDialog.type) return;

    setActionLoading(prev => ({ ...prev, [actionDialog.applicationId!]: true }));
    
    try {
      if (actionDialog.type === "approve") {
        await approveApplication(actionDialog.applicationId, actionMessage);
        setApplications(prev => prev.map(app => 
          app.id === actionDialog.applicationId ? { ...app, status: "APPROVED" } : app
        ));
        toast({
          title: "Success",
          description: "Application approved successfully",
        });
      } else if (actionDialog.type === "reject") {
        await rejectApplication(actionDialog.applicationId, actionMessage);
        setApplications(prev => prev.map(app => 
          app.id === actionDialog.applicationId ? { ...app, status: "REJECTED" } : app
        ));
        toast({
          title: "Success",
          description: "Application rejected successfully",
        });
      }
      setActionDialog({ open: false, type: null, applicationId: null, applicantName: "" });
      setActionMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${actionDialog.type} application`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionDialog.applicationId!]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { className: "bg-warning/10 text-warning hover:bg-warning/20" },
      APPROVED: { className: "bg-success/10 text-success hover:bg-success/20" },
      REJECTED: { className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
      CREATED: { className: "bg-info/10 text-info hover:bg-info/20" },
      ACTIVE: { className: "bg-success/10 text-success hover:bg-success/20" },
      DEACTIVATED: { className: "bg-muted/10 text-muted-foreground hover:bg-muted/20" },
    };
    return variants[status as keyof typeof variants] || { className: "bg-secondary/10 text-secondary-foreground" };
  };

  const handleAccordionChange = (value: string) => {
    const applicationId = value === expandedApplication ? null : value;
    setExpandedApplication(applicationId);
    
    if (applicationId && !detailedApplications.has(applicationId)) {
      fetchApplicationDetails(applicationId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Applications</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage teacher applications ({totalElements} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
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

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gradient-card border-0 shadow-custom-md">
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <Accordion 
            type="single" 
            collapsible 
            value={expandedApplication || ""} 
            onValueChange={handleAccordionChange}
          >
            {applications.map((application) => (
              <AccordionItem key={application.id} value={application.id} className="border-0 mb-4">
                <Card className={`bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth ${
                  !application.isRead ? "ring-2 ring-primary/20" : ""
                }`}>
                  <AccordionTrigger className="hover:no-underline p-0">
                    <CardHeader className="w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-2 text-left">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{application.fullName}</CardTitle>
                            {!application.isRead && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {application.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {application.teachingField}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            variant="secondary" 
                            className={getStatusBadge(application.status).className}
                          >
                            {application.status}
                          </Badge>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </div>
                      </div>
                    </CardHeader>
                  </AccordionTrigger>
                  
                  <AccordionContent className="p-0">
                    <Separator />
                    <CardContent className="pt-4">
                      {detailedApplications.has(application.id) ? (
                        <div className="space-y-4">
                          {/* Detailed Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {detailedApplications.get(application.id)?.phoneNumber && (
                              <div>
                                <Label className="text-sm font-medium">Phone Number</Label>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {detailedApplications.get(application.id)?.phoneNumber}
                                </p>
                              </div>
                            )}
                            
                            {detailedApplications.get(application.id)?.linkedinProfile && (
                              <div>
                                <Label className="text-sm font-medium">LinkedIn Profile</Label>
                                <p className="text-sm text-muted-foreground">
                                  <a 
                                    href={detailedApplications.get(application.id)?.linkedinProfile} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View LinkedIn
                                  </a>
                                </p>
                              </div>
                            )}
                            
                            {detailedApplications.get(application.id)?.githubProfile && (
                              <div>
                                <Label className="text-sm font-medium">GitHub Profile</Label>
                                <p className="text-sm text-muted-foreground">
                                  <a 
                                    href={detailedApplications.get(application.id)?.githubProfile} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View GitHub
                                  </a>
                                </p>
                              </div>
                            )}
                            
                            {detailedApplications.get(application.id)?.portfolio && (
                              <div>
                                <Label className="text-sm font-medium">Portfolio</Label>
                                <p className="text-sm text-muted-foreground">
                                  <a 
                                    href={detailedApplications.get(application.id)?.portfolio} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View Portfolio
                                  </a>
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {detailedApplications.get(application.id)?.additionalInfo && (
                            <div>
                              <Label className="text-sm font-medium">Additional Information</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {detailedApplications.get(application.id)?.additionalInfo}
                              </p>
                            </div>
                          )}
                          
                          {detailedApplications.get(application.id)?.resultMessage && (
                            <div>
                              <Label className="text-sm font-medium">Result Message</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {detailedApplications.get(application.id)?.resultMessage}
                              </p>
                            </div>
                          )}
                          
                          {detailedApplications.get(application.id)?.completedAt && (
                            <div>
                              <Label className="text-sm font-medium">Completed At</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(detailedApplications.get(application.id)!.completedAt!).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-8">
                          <Skeleton className="h-20 w-full" />
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(application.id, "markRead")}
                          disabled={actionLoading[application.id] || application.isRead}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {application.isRead ? "Read" : "Mark as Read"}
                        </Button>

                        {(application.status === "PENDING" || application.status === "NEW") && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-success hover:bg-success/90 text-success-foreground"
                              onClick={() => setActionDialog({
                                open: true,
                                type: "approve",
                                applicationId: application.id,
                                applicantName: application.fullName
                              })}
                              disabled={actionLoading[application.id]}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setActionDialog({
                                open: true,
                                type: "reject",
                                applicationId: application.id,
                                applicantName: application.fullName
                              })}
                              disabled={actionLoading[application.id]}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleAction(application.id, "delete")}
                          disabled={actionLoading[application.id]}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && applications.length === 0 && (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search filters or check back later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, type: null, applicationId: null, applicantName: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve" ? "Approve" : "Reject"} Application
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to {actionDialog.type} the application from{" "}
              <span className="font-medium">{actionDialog.applicantName}</span>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder={`Enter a message for the ${actionDialog.type} decision...`}
                value={actionMessage}
                onChange={(e) => setActionMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, type: null, applicationId: null, applicantName: "" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleActionWithMessage}
              disabled={!actionMessage.trim() || (actionDialog.applicationId ? actionLoading[actionDialog.applicationId] : false)}
              variant={actionDialog.type === "approve" ? "default" : "destructive"}
            >
              {actionDialog.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}