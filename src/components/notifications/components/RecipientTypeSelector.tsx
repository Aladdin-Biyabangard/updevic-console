import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Users, UserCheck } from 'lucide-react';
import type { EmailData } from '@/pages/admin/Notifications';

interface RecipientTypeSelectorProps {
    value: EmailData['recipients']['type'];
    onChange: (type: 'all' | 'groups' | 'individuals') => void;
}

export const RecipientTypeSelector: React.FC<RecipientTypeSelectorProps> = ({
                                                                                value,
                                                                                onChange
                                                                            }) => {
    return (
        <div className="space-y-4">
            <div className="bg-gradient-secondary p-4 rounded-lg border border-accent/30">
                <Label className="text-base font-bold text-foreground">Select Recipients</Label>
                <p className="text-sm text-muted-foreground mt-1">
                    Choose who will receive this notification
                </p>
            </div>

            <RadioGroup
                value={value}
                onValueChange={onChange}
                className="space-y-3"
            >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                    <RadioGroupItem value="all" id="all" className="border-primary text-primary" />
                    <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Globe className="h-4 w-4 text-success" />
                        All Users
                    </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                    <RadioGroupItem value="groups" id="groups" className="border-primary text-primary" />
                    <Label htmlFor="groups" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Users className="h-4 w-4 text-warning" />
                        Specific Groups
                    </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                    <RadioGroupItem value="individuals" id="individuals" className="border-primary text-primary" />
                    <Label htmlFor="individuals" className="flex items-center gap-2 cursor-pointer font-medium">
                        <UserCheck className="h-4 w-4 text-accent" />
                        Individual Users
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
};