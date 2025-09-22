import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Trash2, Check, X, Mail, FileText, Calendar, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicApplication, DetailedApplication } from "@/lib/api/applications";

interface Props {
    applications: BasicApplication[];
    detailedApplications: Map<string, DetailedApplication>;
    expandedApplication: string | null;
    onExpand: (id: string) => void;
    onAction: (id: string, action: "markRead" | "delete") => void;
    onOpenDialog: (type: "approve" | "reject", id: string, name: string) => void;
    actionLoading: Record<string, boolean>;
}

export default function ApplicationList({ applications, detailedApplications, expandedApplication, onExpand, onAction, onOpenDialog, actionLoading }: Props) {

    const getStatusBadge = (status: string) => {
        const variants = {
            PENDING: "bg-warning/10 text-warning",
            APPROVED: "bg-success/10 text-success",
            REJECTED: "bg-destructive/10 text-destructive",
            CREATED: "bg-info/10 text-info",
            ACTIVE: "bg-success/10 text-success",
            DEACTIVATED: "bg-muted/10 text-muted-foreground",
        };
        return variants[status as keyof typeof variants] || "bg-secondary/10 text-secondary-foreground";
    };

    if (!applications.length) {
        return (
            <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
                </CardContent>
            </Card>
        );
    }

    return (
        <Accordion type="single" collapsible value={expandedApplication || ""} onValueChange={onExpand}>
            {applications.map(app => (
                <AccordionItem key={app.id} value={app.id}>
                    <Card className={`bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth ${!app.isRead ? "ring-2 ring-primary/20" : ""}`}>
                        <AccordionTrigger className="hover:no-underline p-0">
                            <CardHeader className="w-full flex justify-between items-start">
                                <div>
                                    <CardTitle>{app.fullName}</CardTitle>
                                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</div>
                                        <div className="flex items-center gap-1"><FileText className="h-3 w-3" />{app.teachingField}</div>
                                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(app.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <Badge className={getStatusBadge(app.status)}>{app.status}</Badge>
                            </CardHeader>
                        </AccordionTrigger>

                        <AccordionContent className="p-0">
                            <Separator />
                            <CardContent className="pt-4">
                                {detailedApplications.has(app.id) ? (
                                    <div className="space-y-2">
                                        {detailedApplications.get(app.id)?.phoneNumber && (
                                            <div>
                                                <label className="text-sm font-medium">Phone</label>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{detailedApplications.get(app.id)?.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Skeleton className="h-20 w-full" />
                                )}

                                <Separator className="my-4" />
                                <div className="flex gap-2 flex-wrap">
                                    <button onClick={() => onAction(app.id, "markRead")} disabled={actionLoading[app.id]}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        {app.isRead ? "Read" : "Mark as Read"}
                                    </button>
                                    {!["APPROVED", "REJECTED"].includes(app.status) && (
                                        <>
                                            <button onClick={() => onOpenDialog("approve", app.id, app.fullName)} disabled={actionLoading[app.id]}>
                                                <Check className="h-3 w-3 mr-1" />Approve
                                            </button>
                                            <button onClick={() => onOpenDialog("reject", app.id, app.fullName)} disabled={actionLoading[app.id]}>
                                                <X className="h-3 w-3 mr-1" />Reject
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => onAction(app.id, "delete")} disabled={actionLoading[app.id]}>
                                        <Trash2 className="h-3 w-3 mr-1" />Delete
                                    </button>
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
