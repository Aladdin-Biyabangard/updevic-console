import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportApplications } from "@/lib/api/applications";
import { ApplicationCriteria } from "@/lib/api/applications";

interface ExportButtonProps {
    filters: ApplicationCriteria;
}

export const ExportButton = ({ filters }: ExportButtonProps) => {
    const { toast } = useToast();

    const handleExport = async () => {
        try {
            const blob = await exportApplications(filters);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `applications_export_${new Date().toISOString().slice(0,10)}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);

            toast({
                title: "Success",
                description: "Export completed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to export applications",
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
        >
            <Download className="h-4 w-4 mr-2" />
            Export
        </Button>
    );
};