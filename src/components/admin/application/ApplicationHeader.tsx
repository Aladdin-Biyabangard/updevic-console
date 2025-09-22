import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApplicationHeader({ totalElements }: { totalElements: number }) {
    return (
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
    );
}
