import { Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailedApplication } from "@/lib/api/applications";

interface ApplicationDetailsProps {
    application?: DetailedApplication;
    loading?: boolean;
}

export const ApplicationDetails = ({ application, loading }: ApplicationDetailsProps) => {
    if (loading || !application) {
        return (
            <div className="flex items-center justify-center p-8">
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.phoneNumber && (
                    <div>
                        <Label className="text-sm font-medium">Phone Number</Label>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {application.phoneNumber}
                        </p>
                    </div>
                )}

                {application.linkedinProfile && (
                    <div>
                        <Label className="text-sm font-medium">LinkedIn Profile</Label>
                        <p className="text-sm text-muted-foreground">
                            <a
                                href={application.linkedinProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                View LinkedIn
                            </a>
                        </p>
                    </div>
                )}

                {application.githubProfile && (
                    <div>
                        <Label className="text-sm font-medium">GitHub Profile</Label>
                        <p className="text-sm text-muted-foreground">
                            <a
                                href={application.githubProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                View GitHub
                            </a>
                        </p>
                    </div>
                )}

                {application.portfolio && (
                    <div>
                        <Label className="text-sm font-medium">Portfolio</Label>
                        <p className="text-sm text-muted-foreground">
                            <a
                                href={application.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                View Portfolio
                            </a>
                        </p>
                    </div>
                )}
            </div>

            {application.additionalInfo && (
                <div>
                    <Label className="text-sm font-medium">Additional Information</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                        {application.additionalInfo}
                    </p>
                </div>
            )}

            {application.resultMessage && (
                <div>
                    <Label className="text-sm font-medium">Result Message</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                        {application.resultMessage}
                    </p>
                </div>
            )}

            {application.completedAt && (
                <div>
                    <Label className="text-sm font-medium">Completed At</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                        {new Date(application.completedAt).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
};