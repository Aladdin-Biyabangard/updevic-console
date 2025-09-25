import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    icon?: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export function ActionButton({
                                 icon: IconComponent,
                                 label,
                                 onClick,
                                 variant = 'default',
                                 size = 'default',
                                 disabled = false,
                                 loading = false,
                                 className = '',
                                 type = 'button',
                             }: ActionButtonProps) {
    return (
        <Button
            type={type}
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled || loading}
            className={className}
        >
            {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
            {loading ? 'Loading...' : label}
        </Button>
    );
}