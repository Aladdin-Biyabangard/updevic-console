import { useState } from "react";
import { Search, Filter, Download, Eye, Check, X, Trash2, Mail, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockApplications, TeacherApplication } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function Applications() {
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const { toast } = useToast();

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (id: string, action: "approve" | "reject" | "delete" | "markRead") => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        switch (action) {
          case "approve":
            toast({
              title: "Application Approved",
              description: `${app.applicantName}'s application has been approved.`,
            });
            return { ...app, status: "approved" as const, read: true };
          case "reject":
            toast({
              title: "Application Rejected", 
              description: `${app.applicantName}'s application has been rejected.`,
              variant: "destructive",
            });
            return { ...app, status: "rejected" as const, read: true };
          case "markRead":
            return { ...app, read: true };
          default:
            return app;
        }
      }
      return app;
    }));

    if (action === "delete") {
      setApplications(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Application Deleted",
        description: "The application has been permanently deleted.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: TeacherApplication['status']) => {
    const variants = {
      pending: { variant: "secondary" as const, className: "bg-warning/10 text-warning hover:bg-warning/20" },
      approved: { variant: "secondary" as const, className: "bg-success/10 text-success hover:bg-success/20" },
      rejected: { variant: "secondary" as const, className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    };
    return variants[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Applications</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage teacher applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-custom-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status as any)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card
            key={application.id}
            className={`bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth ${
              !application.read ? "ring-2 ring-primary/20" : ""
            }`}
          >
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{application.applicantName}</CardTitle>
                    {!application.read && (
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
                    <div>📞 {application.phone}</div>
                    <div>📚 {application.subject}</div>
                    <div>⏱️ {application.experience} years exp.</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge {...getStatusBadge(application.status)} className={getStatusBadge(application.status).className}>
                    {application.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(application.dateApplied).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-foreground">Certificate:</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {application.certificate}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(application.id, "markRead")}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  
                  {application.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => handleAction(application.id, "approve")}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(application.id, "reject")}
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
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No teacher applications have been submitted yet."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}