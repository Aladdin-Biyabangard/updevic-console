import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButton {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg';
    disabled?: boolean;
    loading?: boolean;
}

interface PageHeaderProps {
    title: string;
    description: string;
    actions?: ActionButton[];
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>
            {actions && actions.length > 0 && (
                <div className="flex gap-2">
                    {actions.map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                            <Button
                                key={index}
                                variant={action.variant || 'default'}
                                size={action.size || 'default'}
                                onClick={action.onClick}
                                disabled={action.disabled || action.loading}
                            >
                                {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                                {action.loading ? 'Loading...' : action.label}
                            </Button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}