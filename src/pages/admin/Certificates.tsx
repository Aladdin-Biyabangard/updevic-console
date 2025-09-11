import { useState, useEffect } from "react";
import { Search, Download, Award, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchCertificates, Certificate, CertificateCriteria } from "@/lib/api/certificate";
import { useToast } from "@/hooks/use-toast";

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "revoked">("all");
  const { toast } = useToast();

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const criteria: CertificateCriteria = {};

      if (searchTerm.trim()) {
        criteria.email = searchTerm.trim();
        criteria.trainingName = searchTerm.trim();
      }

      if (filter !== "all") {
        switch (filter) {
          case "active":
            criteria.status = "ACTIVE";
            break;
          case "expired":
            criteria.status = "EXPIRED";
            break;
          case "revoked":
            criteria.status = "REVOKED";
            break;
        }
      }

      const data = await searchCertificates(criteria, 0, 50); // pagination
      setCertificates(data.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [searchTerm, filter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: { className: "bg-success/10 text-success", icon: CheckCircle },
      EXPIRED: { className: "bg-warning/10 text-warning", icon: Calendar },
      REVOKED: { className: "bg-destructive/10 text-destructive", icon: AlertCircle },
    };
    return variants[status as keyof typeof variants] || variants.ACTIVE;
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Certificates</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track issued certificates
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by email or training name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["all", "active", "expired", "revoked"].map((status) => (
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

        {/* Certificates Grid */}
        {loading ? (
            <Card className="bg-gradient-card border-0 shadow-custom-md">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-foreground mb-2">Loading certificates...</h3>
              </CardContent>
            </Card>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certificates.length > 0 ? certificates.map((certificate, index) => {
                const statusInfo = getStatusBadge(certificate.status || "ACTIVE");
                const StatusIcon = statusInfo.icon;
                return (
                    <Card
                        key={index}
                        className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Award className="h-8 w-8 text-primary" />
                          <Badge variant="secondary" className={statusInfo.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {certificate.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{certificate.fullName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{certificate.trainingName}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Issued:</span>
                            <span className="text-foreground">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                );
              }) : (
                  <Card className="bg-gradient-card border-0 shadow-custom-md">
                    <CardContent className="p-12 text-center">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No certificates found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filter !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No certificates have been issued yet."
                        }
                      </p>
                    </CardContent>
                  </Card>
              )}
            </div>
        )}
      </div>
  );
}
