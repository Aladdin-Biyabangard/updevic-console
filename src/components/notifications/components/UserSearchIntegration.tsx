import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, Users, UserMinus } from 'lucide-react';
import { getAllUsers } from '@/lib/api/users';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash-es';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

interface UserSearchIntegrationProps {
    selectedUserIds: number[];
    onUserToggle: (userId: number) => void;
    onSelectAll?: (userIds: number[]) => void;
    onDeselectAll?: () => void;
}

export const UserSearchIntegration: React.FC<UserSearchIntegrationProps> = ({
                                                                                selectedUserIds,
                                                                                onUserToggle,
                                                                                onSelectAll,
                                                                                onDeselectAll
                                                                            }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const searchUsers = useCallback(async (searchCriteria: any = {}) => {
        setIsLoading(true);
        try {
            const data = await getAllUsers(searchCriteria);
            setUsers(data?.content || []);
        } catch (error: any) {
            console.error('Error searching users:', error);
            toast({
                title: "Error",
                description: "Failed to search users. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            const searchCriteria: any = {};

            if (term.trim()) {
                // Check if search term looks like an email
                if (term.includes('@')) {
                    searchCriteria.email = term.trim();
                } else {
                    searchCriteria.firstName = term.trim();
                }
            }

            searchUsers(searchCriteria);
        }, 300),
        [searchUsers]
    );

    useEffect(() => {
        // Initial load - get all users
        searchUsers();
    }, [searchUsers]);

    useEffect(() => {
        debouncedSearch(searchTerm);

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    const filteredUsers = users.filter(user => {
        if (!searchTerm.trim()) return true;

        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const email = user.email.toLowerCase();
        const search = searchTerm.toLowerCase();

        return fullName.includes(search) || email.includes(search);
    });

    const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every(user => selectedUserIds.includes(user.id));
    const someFilteredSelected = filteredUsers.some(user => selectedUserIds.includes(user.id));

    const handleSelectAll = () => {
        if (allFilteredSelected && onDeselectAll) {
            onDeselectAll();
        } else if (onSelectAll) {
            onSelectAll(filteredUsers.map(user => user.id));
        }
    };

    const handleUserToggle = (userId: number) => {
        console.log('Toggle user:', userId, 'Current selected:', selectedUserIds);
        onUserToggle(userId);
    };

    return (
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

                {filteredUsers.length > 0 && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            className="flex items-center gap-2"
                        >
                            {allFilteredSelected ? (
                                <>
                                    <UserMinus className="h-3 w-3" />
                                    Deselect All
                                </>
                            ) : (
                                <>
                                    <Users className="h-3 w-3" />
                                    Select All {searchTerm.trim() ? 'Filtered' : ''}
                                </>
                            )}
                        </Button>
                        {selectedUserIds.length > 0 && (
                            <Badge variant="secondary">
                                {selectedUserIds.length} selected
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            <ScrollArea className="h-[200px] border-2 border-accent/20 rounded-md bg-gradient-secondary">
                <div className="p-3 space-y-2">
                    {isLoading ? (
                        <div className="text-center py-4 text-muted-foreground">
                            Searching users...
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                            {searchTerm.trim() ? 'No users found matching your search.' : 'No users available.'}
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-card/50 transition-all duration-200">
                                <Checkbox
                                    id={`user-${user.id}`}
                                    checked={selectedUserIds.includes(user.id)}
                                    onCheckedChange={(checked) => {
                                        const isChecked = checked === true;
                                        const currentlySelected = selectedUserIds.includes(user.id);
                                        if (isChecked && !currentlySelected) {
                                            handleUserToggle(user.id);
                                        } else if (!isChecked && currentlySelected) {
                                            handleUserToggle(user.id);
                                        }
                                    }}
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
                                            {user.roles[0] || 'USER'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};