import { useState } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import {
    deleteApplication,
    markAsRead,
    approveApplication,
    rejectApplication,
    BasicApplication
} from "@/lib/api/applications.ts";

export const useApplicationActions = (
    applications: BasicApplication[],
    setApplications: React.Dispatch<React.SetStateAction<BasicApplication[]>>
) => {
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

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

    const handleActionWithMessage = async (
        applicationId: string,
        type: "approve" | "reject",
        message: string
    ) => {
        setActionLoading(prev => ({ ...prev, [applicationId]: true }));

        try {
            if (type === "approve") {
                await approveApplication(applicationId, message);
                setApplications(prev => prev.map(app =>
                    app.id === applicationId ? { ...app, status: "APPROVED" } : app
                ));
                toast({
                    title: "Success",
                    description: "Application approved successfully",
                });
            } else if (type === "reject") {
                await rejectApplication(applicationId, message);
                setApplications(prev => prev.map(app =>
                    app.id === applicationId ? { ...app, status: "REJECTED" } : app
                ));
                toast({
                    title: "Success",
                    description: "Application rejected successfully",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : `Failed to ${type} application`,
                variant: "destructive",
            });
        } finally {
            setActionLoading(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    return {
        actionLoading,
        handleAction,
        handleActionWithMessage
    };
};