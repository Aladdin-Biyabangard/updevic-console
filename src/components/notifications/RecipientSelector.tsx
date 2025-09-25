import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Users, UserCheck, Globe } from 'lucide-react';
import type { EmailData } from '@/pages/admin/Notifications';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string[];
}

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
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockGroups: UserGroup[] = [
            { id: 'teachers', name: 'Teachers', description: 'All registered teachers', userCount: 145 },
            { id: 'students', name: 'Students', description: 'All registered students', userCount: 2341 },
            { id: 'admins', name: 'Administrators', description: 'System administrators', userCount: 8 },
            { id: 'inactive', name: 'Inactive Users', description: 'Users who haven\'t logged in recently', userCount: 67 }
        ];
        setGroups(mockGroups);

        const mockUsers: User[] = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: ['TEACHER'] },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: ['STUDENT'] },
            { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', role: ['ADMIN'] },
            { id: 4, firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@example.com', role: ['TEACHER'] },
            { id: 5, firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', role: ['STUDENT'] }
        ];
        setUsers(mockUsers);
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

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const getRecipientCount = () => {
        if (value.type === 'all') {
            return users.length;
        } else if (value.type === 'groups') {
            return (value.groups || [])
                .reduce((total, groupId) => {
                    const group = groups.find(g => g.id === groupId);
                    return total + (group?.userCount || 0);
                }, 0);
        } else {
            return (value.userIds || []).length;
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-gradient-secondary p-4 rounded-lg border border-accent/30">
                <Label className="text-base font-bold text-foreground">Select Recipients</Label>
                <p className="text-sm text-muted-foreground mt-1">
                    Choose who will receive this notification
                </p>
            </div>

            <RadioGroup
                value={value.type}
                onValueChange={handleTypeChange}
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

            {value.type === 'groups' && (
                <div className="space-y-3">
                    <Separator className="bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <Label className="text-sm font-bold text-foreground">Select Groups</Label>
                    <div className="space-y-2 bg-gradient-secondary p-4 rounded-lg border border-accent/20">
                        {groups.map((group) => (
                            <div key={group.id} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-card/50 transition-all duration-200">
                                <Checkbox
                                    id={group.id}
                                    checked={(value.groups || []).includes(group.id)}
                                    onCheckedChange={() => handleGroupToggle(group.id)}
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
            )}

            {value.type === 'individuals' && (
                <div className="space-y-3">
                    <Separator className="bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-foreground">Select Individual Users</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-primary/30 focus:border-primary focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <ScrollArea className="h-[200px] border-2 border-accent/20 rounded-md bg-gradient-secondary">
                        <div className="p-3 space-y-2">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-card/50 transition-all duration-200">
                                    <Checkbox
                                        id={`user-${user.id}`}
                                        checked={(value.userIds || []).includes(user.id)}
                                        onCheckedChange={() => handleUserToggle(user.id)}
                                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Label htmlFor={`user-${user.id}`} className="cursor-pointer font-medium text-foreground">
                                            {user.firstName} {user.lastName}
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                            <Badge className="text-xs bg-success text-success-foreground">
                                                {user.role[0]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}

            <Separator className="bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="flex items-center justify-between text-sm bg-gradient-primary p-3 rounded-lg">
                <span className="text-primary-foreground font-medium">Total Recipients:</span>
                <Badge className="bg-primary-foreground text-primary shadow-glow">
                    {getRecipientCount()} {getRecipientCount() === 1 ? 'user' : 'users'}
                </Badge>
            </div>
        </div>
    );
};