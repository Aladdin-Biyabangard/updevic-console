import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { ApplicationCard } from "./ApplicationCard";
import { CustomPagination } from "@/components/common/CustomPagination";
import { BasicApplication, DetailedApplication } from "@/lib/api/applications";

interface ApplicationsListProps {
    applications: BasicApplication[];
    detailedApplications: Map<string, DetailedApplication>;
    loading: boolean;
    expandedApplication: string | null;
    actionLoading: Record<string, boolean>;
    currentPage: number;
    totalPages: number;
    onExpand: (applicationId: string | null) => void;
    onAction: (id: string, action: "delete" | "markRead") => void;
    onActionWithMessage: (id: string, type: "approve" | "reject", applicantName: string) => void;
    onPageChange: (page: number) => void;
}

export const ApplicationsList = ({
                                     applications,
                                     detailedApplications,
                                     loading,
                                     expandedApplication,
                                     actionLoading,
                                     currentPage,
                                     totalPages,
                                     onExpand,
                                     onAction,
                                     onActionWithMessage,
                                     onPageChange
                                 }: ApplicationsListProps) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="bg-gradient-card border-0 shadow-custom-md">
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <Card className="bg-gradient-card border-0 shadow-custom-md">
                <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search filters or check back later.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Accordion
                type="single"
                collapsible
                value={expandedApplication || ""}
                onValueChange={(value) => onExpand(value || null)}
            >
                {applications.map((application) => (
                    <ApplicationCard
                        key={application.id}
                        application={application}
                        detailedApplication={detailedApplications.get(application.id)}
                        expandedApplication={expandedApplication}
                        actionLoading={actionLoading}
                        onExpand={onExpand}
                        onAction={onAction}
                        onActionWithMessage={onActionWithMessage}
                    />
                ))}
            </Accordion>

            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </>
    );
};