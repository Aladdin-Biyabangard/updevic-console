import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ActionDialogState {
    open: boolean;
    type: "approve" | "reject" | null;
    applicationId: string | null;
    applicantName: string;
}

interface ApplicationActionDialogProps {
    actionDialog: ActionDialogState;
    onClose: () => void;
    onAction: (applicationId: string, type: "approve" | "reject", message: string) => Promise<void>;
    loading?: boolean;
}

export const ApplicationActionDialog = ({
                                            actionDialog,
                                            onClose,
                                            onAction,
                                            loading
                                        }: ApplicationActionDialogProps) => {
    const [actionMessage, setActionMessage] = useState("");

    const handleSubmit = async () => {
        if (!actionDialog.applicationId || !actionDialog.type || !actionMessage.trim()) return;

        await onAction(actionDialog.applicationId, actionDialog.type, actionMessage);
        setActionMessage("");
        onClose();
    };

    const handleClose = () => {
        setActionMessage("");
        onClose();
    };

    return (
        <Dialog open={actionDialog.open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {actionDialog.type === "approve" ? "Approve" : "Reject"} Application
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>
                        Are you sure you want to {actionDialog.type} the application from{" "}
                        <span className="font-medium">{actionDialog.applicantName}</span>?
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder={`Enter a message for the ${actionDialog.type} decision...`}
                            value={actionMessage}
                            onChange={(e) => setActionMessage(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!actionMessage.trim() || loading}
                        variant={actionDialog.type === "approve" ? "default" : "destructive"}
                    >
                        {actionDialog.type === "approve" ? "Approve" : "Reject"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};