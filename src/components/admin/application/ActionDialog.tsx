import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    open: boolean;
    type: "approve" | "reject" | null;
    applicantName: string;
    message: string;
    setMessage: (msg: string) => void;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function ActionDialog({ open, type, applicantName, message, setMessage, onClose, onConfirm, loading }: Props) {
    if (!type) return null;

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === "approve" ? "Approve" : "Reject"} Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>Are you sure you want to {type} the application from <span className="font-medium">{applicantName}</span>?</p>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder={`Enter a message for ${type}...`} value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm} disabled={!message.trim() || loading} variant={type === "approve" ? "default" : "destructive"}>
                        {type === "approve" ? "Approve" : "Reject"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
