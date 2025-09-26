import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { EmailData } from '@/pages/admin/Notifications';

interface UserGroup {
    id: string;
    name: string;
    description: string;
    userCount: number;
}

interface RecipientSummaryProps {
    recipients: EmailData['recipients'];
    groups: UserGroup[];
    totalUsers: number;
}

export const RecipientSummary: React.FC<RecipientSummaryProps> = ({
                                                                      recipients,
                                                                      groups,
                                                                      totalUsers
                                                                  }) => {
    const getRecipientCount = () => {
        if (recipients.type === 'all') {
            return totalUsers;
        } else if (recipients.type === 'groups') {
            return (recipients.groups || [])
                .reduce((total, groupId) => {
                    const group = groups.find(g => g.id === groupId);
                    return total + (group?.userCount || 0);
                }, 0);
        } else {
            return (recipients.userIds || []).length;
        }
    };

    return (
        <>
            <Separator className="bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="flex items-center justify-between text-sm bg-gradient-primary p-3 rounded-lg">
                <span className="text-primary-foreground font-medium">Total Recipients:</span>
                <Badge className="bg-primary-foreground text-primary shadow-glow">
                    {getRecipientCount()} {getRecipientCount() === 1 ? 'user' : 'users'}
                </Badge>
            </div>
        </>
    );
};