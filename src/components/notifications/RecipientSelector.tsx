import React, { useState, useEffect } from 'react';
import type { EmailData } from '@/pages/admin/Notifications';
import { RecipientTypeSelector } from './components/RecipientTypeSelector';
import { GroupSelector } from './components/GroupSelector';
import { UserSearchIntegration } from './components/UserSearchIntegration';
import { RecipientSummary } from './components/RecipientSummary';


interface UserGroup {
    id: string;
    name: string;
    description: string;
    userCount: number;
}

interface RecipientSelectorProps {
    value: EmailData['recipients'];
    onChange: (recipients: EmailData['recipients']) => void;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
                                                                        value,
                                                                        onChange
                                                                    }) => {
    const [groups, setGroups] = useState<UserGroup[]>([]);

    // Mock data for groups - can be replaced with actual API calls
    useEffect(() => {
        const mockGroups: UserGroup[] = [
            { id: 'teachers', name: 'Teachers', description: 'All registered teachers', userCount: 145 },
            { id: 'students', name: 'Students', description: 'All registered students', userCount: 2341 },
            { id: 'admins', name: 'Administrators', description: 'System administrators', userCount: 8 },
            { id: 'inactive', name: 'Inactive Users', description: 'Users who haven\'t logged in recently', userCount: 67 }
        ];
        setGroups(mockGroups);
    }, []);

    const handleTypeChange = (type: 'all' | 'groups' | 'individuals') => {
        onChange({
            type,
            groups: type === 'groups' ? [] : undefined,
            userIds: type === 'individuals' ? [] : undefined
        });
    };

    const handleGroupToggle = (groupId: string) => {
        const currentGroups = value.groups || [];
        const newGroups = currentGroups.includes(groupId)
            ? currentGroups.filter(id => id !== groupId)
            : [...currentGroups, groupId];

        onChange({ ...value, groups: newGroups });
    };

    const handleUserToggle = (userId: number) => {
        const currentUsers = value.userIds || [];
        const newUsers = currentUsers.includes(userId)
            ? currentUsers.filter(id => id !== userId)
            : [...currentUsers, userId];

        onChange({ ...value, userIds: newUsers });
    };

    const handleSelectAll = (userIds: number[]) => {
        const currentUsers = value.userIds || [];
        const newUsers = [...new Set([...currentUsers, ...userIds])];
        onChange({ ...value, userIds: newUsers });
    };

    const handleDeselectAll = () => {
        onChange({ ...value, userIds: [] });
    };

    // Calculate total users for summary (using mock count for now)
    const totalUsers = 2500; // This could come from an API call

    return (
        <div className="space-y-4">
            <RecipientTypeSelector
                value={value.type}
                onChange={handleTypeChange}
            />

            {value.type === 'groups' && (
                <GroupSelector
                    groups={groups}
                    selectedGroups={value.groups || []}
                    onGroupToggle={handleGroupToggle}
                />
            )}

            {value.type === 'individuals' && (
                <UserSearchIntegration
                    selectedUserIds={value.userIds || []}
                    onUserToggle={handleUserToggle}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                />
            )}

            <RecipientSummary
                recipients={value}
                groups={groups}
                totalUsers={totalUsers}
            />
        </div>
    );
};