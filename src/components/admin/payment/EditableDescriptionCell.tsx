import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { updateTransactionDescription } from "@/lib/api/adminPaymentsApi.ts";

interface EditableDescriptionCellProps {
    transactionId: string;
    description: string;
    onUpdated: () => void;
}

export function EditableDescriptionCell({ transactionId, description, onUpdated }: EditableDescriptionCellProps) {
    const [value, setValue] = useState(description);
    const [editing, setEditing] = useState(false);
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateTransactionDescription(transactionId, value);
            toast({ title: "Success", description: "Description updated" });
            setEditing(false);
            onUpdated();
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to update description", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return editing ? (
        <div className="flex gap-2 items-center">
            <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full"
                disabled={loading}
            />
            <Button size="sm" onClick={handleSave} disabled={loading}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)} disabled={loading}>Cancel</Button>
        </div>
    ) : (
        <div
            className="max-w-xs truncate cursor-pointer hover:underline"
            onClick={() => setEditing(true)}
        >
            {value}
        </div>
    );
}
