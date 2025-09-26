import { useState } from "react";
import { useApplications } from "@/hooks/applications/useApplications";
import { useApplicationActions } from "@/hooks/applications/useApplicationActions";
import { useApplicationFilters } from "@/hooks/applications/useApplicationFilters";
import { ExportButton } from "@/components/common/ExportButton";
import { ApplicationFilters } from "@/components/features/applications/ApplicationFilters";
import { ApplicationsList } from "@/components/features/applications/ApplicationsList";
import { ApplicationActionDialog } from "@/components/features/applications/ApplicationActionDialog";

export default function Applications() {
  const {
    applications,
    setApplications,
    detailedApplications,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalElements,
    filters,
    setFilters,
    fetchApplicationDetails
  } = useApplications();

  const { actionLoading, handleAction, handleActionWithMessage } = useApplicationActions(
      applications,
      setApplications
  );

  const { tempFilters, setTempFilters, handleSearch, handleClearFilters } = useApplicationFilters(
      setFilters,
      setCurrentPage
  );

  // Expanded application state
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  // Action dialog state
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | null;
    applicationId: string | null;
    applicantName: string;
  }>({ open: false, type: null, applicationId: null, applicantName: "" });

  const handleAccordionChange = (applicationId: string | null) => {
    setExpandedApplication(applicationId);

    if (applicationId && !detailedApplications.has(applicationId)) {
      fetchApplicationDetails(applicationId);
    }
  };

  const handleActionWithDialog = (id: string, type: "approve" | "reject", applicantName: string) => {
    setActionDialog({
      open: true,
      type,
      applicationId: id,
      applicantName
    });
  };

  const handleDialogAction = async (applicationId: string, type: "approve" | "reject", message: string) => {
    await handleActionWithMessage(applicationId, type, message);
  };

  const handleDialogClose = () => {
    setActionDialog({ open: false, type: null, applicationId: null, applicantName: "" });
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
            <ExportButton filters={filters} />
          </div>
        </div>

        {/* Filters */}
        <ApplicationFilters
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
            loading={loading}
        />

        {/* Applications List */}
        <ApplicationsList
            applications={applications}
            detailedApplications={detailedApplications}
            loading={loading}
            expandedApplication={expandedApplication}
            actionLoading={actionLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onExpand={handleAccordionChange}
            onAction={handleAction}
            onActionWithMessage={handleActionWithDialog}
            onPageChange={setCurrentPage}
        />

        {/* Action Dialog */}
        <ApplicationActionDialog
            actionDialog={actionDialog}
            onClose={handleDialogClose}
            onAction={handleDialogAction}
            loading={actionDialog.applicationId ? actionLoading[actionDialog.applicationId] : false}
        />
      </div>
  );
}