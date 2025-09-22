import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Trash2, Mail, FileText, Calendar, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailedApplication, BasicApplication } from "@/lib/api/applications";

interface Props {
    application: BasicApplication;
    detailedApplication?: DetailedApplication;
    expanded: boolean;
    onExpand: (id: string) => void;
    onAction: (id: string, action: "delete" | "markRead") => void;
    onOpenDialog: (type: "approve" | "reject", id: string, name: string) => void;
    actionLoading: Record<string, boolean>;
}

export default function ApplicationItem({ application, detailedApplication, expanded, onExpand, onAction, onOpenDialog, actionLoading }: Props) {
    const getStatusBadge = (status: string) => {
        const variants = {
            PENDING: "bg-warning/10 text-warning hover:bg-warning/20",
            APPROVED: "bg-success/10 text-success hover:bg-success/20",
            REJECTED: "bg-destructive/10 text-destructive hover:bg-destructive/20",
            CREATED: "bg-info/10 text-info hover:bg-info/20",
            ACTIVE: "bg-success/10 text-success hover:bg-success/20",
            DEACTIVATED: "bg-muted/10 text-muted-foreground hover:bg-muted/20",
        };
        return variants[status as keyof typeof variants] || "bg-secondary/10 text-secondary-foreground";
    };

    return (
        <AccordionItem value={application.id} className="border-0 mb-4">
            <Card className={`bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth ${!application.isRead ? "ring-2 ring-primary/20" : ""}`}>
                <AccordionTrigger className="hover:no-underline p-0" onClick={() => onExpand(application.id)}>
                    <CardHeader className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2 text-left">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg">{application.fullName}</CardTitle>
                                    {!application.isRead && <Badge variant="secondary" className="bg-primary/10 text-primary">New</Badge>}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{application.email}</div>
                                    <div className="flex items-center gap-1"><FileText className="h-3 w-3" />{application.teachingField}</div>
                                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(application.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusBadge(application.status)}>{application.status}</Badge>
                            </div>
                        </div>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <Separator />
                    <CardContent className="pt-4">
                        {detailedApplication ? (
                            <div className="space-y-4">
                                {/* Show phone, linkedin, github, portfolio, additionalInfo etc. */}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-8">
                                <Skeleton className="h-20 w-full" />
                            </div>
                        )}

                        {/* Actions */}
                        <Separator className="my-4" />
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => onAction(application.id, "markRead")} disabled={actionLoading[application.id] || application.isRead}>
                                <Eye className="h-3 w-3 mr-1" /> {application.isRead ? "Read" : "Mark as Read"}
                            </Button>
                            {!["APPROVED", "REJECTED"].includes(application.status) && (
                                <>
                                    <Button size="sm" variant="default" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => onOpenDialog("approve", application.id, application.fullName)} disabled={actionLoading[application.id]}>
                                        <Check className="h-3 w-3 mr-1" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => onOpenDialog("reject", application.id, application.fullName)} disabled={actionLoading[application.id]}>
                                        <X className="h-3 w-3 mr-1" /> Reject
                                    </Button>
                                </>
                            )}
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onAction(application.id, "delete")} disabled={actionLoading[application.id]}>
                                <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                        </div>
                    </CardContent>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}
