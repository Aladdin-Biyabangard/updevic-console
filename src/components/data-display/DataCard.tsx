import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface DataCardProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    status?: {
        value: string;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
        className?: string;
    };
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    onClick?: () => void;
    isHighlighted?: boolean;
}

export function DataCard({
                             title,
                             subtitle,
                             icon: IconComponent,
                             status,
                             children,
                             actions,
                             className = '',
                             headerClassName = '',
                             contentClassName = '',
                             onClick,
                             isHighlighted = false
                         }: DataCardProps) {
    const cardClasses = `
    bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg 
    transition-all duration-300 ease-smooth
    ${isHighlighted ? 'ring-2 ring-primary/20' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

    return (
        <Card className={cardClasses} onClick={onClick}>
            <CardHeader className={`pb-3 ${headerClassName}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {IconComponent && (
                            <div className="flex-shrink-0">
                                <IconComponent className="h-8 w-8 text-primary" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{title}</CardTitle>
                            {subtitle && (
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {status && (
                            <Badge
                                variant={status.variant || 'secondary'}
                                className={status.className}
                            >
                                {status.value}
                            </Badge>
                        )}
                        {actions}
                    </div>
                </div>
            </CardHeader>

            <CardContent className={`space-y-3 ${contentClassName}`}>
                {children}
            </CardContent>
        </Card>
    );
}