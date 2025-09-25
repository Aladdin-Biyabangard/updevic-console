import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, Search, FileX, Users, Award } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    type?: 'search' | 'data' | 'error';
}

const defaultIcons = {
    search: Search,
    data: FileX,
    error: FileX,
};

export function EmptyState({
                               icon,
                               title,
                               description,
                               actionLabel,
                               onAction,
                               type = 'data'
                           }: EmptyStateProps) {
    const IconComponent = icon || defaultIcons[type];

    return (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 rounded-full bg-muted/10">
                        <IconComponent className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-foreground">{title}</h3>
                        <p className="text-muted-foreground max-w-md">{description}</p>
                    </div>
                    {actionLabel && onAction && (
                        <Button onClick={onAction} className="mt-4">
                            {actionLabel}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Pre-configured empty states for common scenarios
export const EmptyStates = {
    NoResults: ({ searchTerm, onClear }: { searchTerm?: string; onClear?: () => void }) => (
        <EmptyState
            icon={Search}
            title="No results found"
            description={
                searchTerm
                    ? `No results found for "${searchTerm}". Try adjusting your search criteria.`
                    : "No results found. Try adjusting your search or filter criteria."
            }
            actionLabel={onClear ? "Clear filters" : undefined}
            onAction={onClear}
            type="search"
        />
    ),

    NoData: ({ entityName, actionLabel, onAction }: {
        entityName: string;
        actionLabel?: string;
        onAction?: () => void;
    }) => (
        <EmptyState
            icon={FileX}
            title={`No ${entityName} found`}
            description={`No ${entityName} have been created yet.`}
            actionLabel={actionLabel}
            onAction={onAction}
            type="data"
        />
    ),

    NoUsers: ({ onAction }: { onAction?: () => void }) => (
        <EmptyState
            icon={Users}
            title="No users found"
            description="No users have been registered yet."
            actionLabel={onAction ? "Add User" : undefined}
            onAction={onAction}
            type="data"
        />
    ),

    NoCertificates: ({ searchTerm, onClear }: { searchTerm?: string; onClear?: () => void }) => (
        <EmptyState
            icon={Award}
            title="No certificates found"
            description={
                searchTerm
                    ? "Try adjusting your search or filter criteria."
                    : "No certificates have been issued yet."
            }
            actionLabel={onClear ? "Clear filters" : undefined}
            onAction={onClear}
            type={searchTerm ? "search" : "data"}
        />
    ),
};