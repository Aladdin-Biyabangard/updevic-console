import { useState } from "react";
import { Eye, Check, X, Trash2, Mail, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ApplicationDetails } from "./ApplicationDetails";
import { BasicApplication, DetailedApplication } from "@/lib/api/applications";

interface ApplicationCardProps {
    application: BasicApplication;
    detailedApplication?: DetailedApplication;
    expandedApplication: string | null;
    actionLoading: Record<string, boolean>;
    onExpand: (applicationId: string | null) => void;
    onAction: (id: string, action: "delete" | "markRead") => void;
    onActionWithMessage: (id: string, type: "approve" | "reject", applicantName: string) => void;
}

export const ApplicationCard = ({
                                    application,
                                    detailedApplication,
                                    expandedApplication,
                                    actionLoading,
                                    onExpand,
                                    onAction,
                                    onActionWithMessage
                                }: ApplicationCardProps) => {
    const handleAccordionChange = (value: string) => {
        const applicationId = value === expandedApplication ? null : value;
        onExpand(applicationId);
    };

    return (
        <AccordionItem value={application.id} className="border-0 mb-4">
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
                                <StatusBadge status={application.status as any} />
                            </div>
                        </div>
                    </CardHeader>
                </AccordionTrigger>

                <AccordionContent className="p-0">
                    <Separator />
                    <CardContent className="pt-4">
                        <ApplicationDetails
                            application={detailedApplication}
                            loading={!detailedApplication}
                        />

                        {/* Action Buttons */}
                        <Separator className="my-4" />
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAction(application.id, "markRead")}
                                disabled={actionLoading[application.id] || application.isRead}
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                {application.isRead ? "Read" : "Mark as Read"}
                            </Button>

                            {!["APPROVED", "REJECTED"].includes(application.status) && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        className="bg-success hover:bg-success/90 text-success-foreground"
                                        onClick={() => onActionWithMessage(application.id, "approve", application.fullName)}
                                        disabled={actionLoading[application.id]}
                                    >
                                        <Check className="h-3 w-3 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onActionWithMessage(application.id, "reject", application.fullName)}
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
                                onClick={() => onAction(application.id, "delete")}
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
    );
};