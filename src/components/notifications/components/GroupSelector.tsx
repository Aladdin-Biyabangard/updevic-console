import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UserGroup {
    id: string;
    name: string;
    description: string;
    userCount: number;
}

interface GroupSelectorProps {
    groups: UserGroup[];
    selectedGroups: string[];
    onGroupToggle: (groupId: string) => void;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
                                                                groups,
                                                                selectedGroups,
                                                                onGroupToggle
                                                            }) => {
    return (
        <div className="space-y-3">
            <Separator className="bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <Label className="text-sm font-bold text-foreground">Select Groups</Label>
            <div className="space-y-2 bg-gradient-secondary p-4 rounded-lg border border-accent/20">
                {groups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-card/50 transition-all duration-200">
                        <Checkbox
                            id={group.id}
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={() => onGroupToggle(group.id)}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex-1 min-w-0">
                            <Label htmlFor={group.id} className="cursor-pointer font-medium text-foreground">
                                {group.name}
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground truncate">
                                    {group.description}
                                </p>
                                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                                    {group.userCount} users
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};