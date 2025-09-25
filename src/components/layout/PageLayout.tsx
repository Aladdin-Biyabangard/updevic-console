import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
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

interface PageLayoutProps {
    title: string;
    description: string;
    actions?: ActionButton[];
    children: React.ReactNode;
    className?: string;
}

export function PageLayout({
                               title,
                               description,
                               actions,
                               children,
                               className = ''
                           }: PageLayoutProps) {
    return (
        <div className={`space-y-6 ${className}`}>
            <PageHeader
                title={title}
                description={description}
                actions={actions}
            />
            {children}
        </div>
    );
}