import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, CheckCircle, AlertCircle, Clock, XCircle, Shield, User } from 'lucide-react';

export type StatusType =
    | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CREATED' | 'ACTIVE' | 'DEACTIVATED'
    | 'PAID' | 'CANCELED' | 'INACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED'
    | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'MODERATOR';

interface StatusConfig {
    className: string;
    icon?: LucideIcon;
    label?: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
    // Application/General Statuses
    PENDING: {
        className: "bg-warning/10 text-warning hover:bg-warning/20",
        icon: Clock,
        label: "Pending"
    },
    APPROVED: {
        className: "bg-success/10 text-success hover:bg-success/20",
        icon: CheckCircle,
        label: "Approved"
    },
    REJECTED: {
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        icon: XCircle,
        label: "Rejected"
    },
    CREATED: {
        className: "bg-info/10 text-info hover:bg-info/20",
        icon: AlertCircle,
        label: "Created"
    },
    ACTIVE: {
        className: "bg-success/10 text-success hover:bg-success/20",
        icon: CheckCircle,
        label: "Active"
    },
    DEACTIVATED: {
        className: "bg-muted/10 text-muted-foreground hover:bg-muted/20",
        icon: XCircle,
        label: "Deactivated"
    },
    SUSPENDED: {
        className: "bg-warning/10 text-warning hover:bg-warning/20",
        icon: AlertCircle,
        label: "Suspended"
    },

    // Payment Statuses
    PAID: {
        className: "bg-success/10 text-success hover:bg-success/20",
        icon: CheckCircle,
        label: "Paid"
    },
    CANCELED: {
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        icon: XCircle,
        label: "Canceled"
    },
    INACTIVE: {
        className: "bg-muted/10 text-muted-foreground hover:bg-muted/20",
        icon: XCircle,
        label: "Inactive"
    },

    // Certificate Statuses
    EXPIRED: {
        className: "bg-warning/10 text-warning hover:bg-warning/20",
        icon: Clock,
        label: "Expired"
    },
    REVOKED: {
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        icon: XCircle,
        label: "Revoked"
    },

    // Role Statuses
    ADMIN: {
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        icon: Shield,
        label: "Admin"
    },
    TEACHER: {
        className: "bg-success/10 text-success hover:bg-success/20",
        icon: User,
        label: "Teacher"
    },
    STUDENT: {
        className: "bg-primary/10 text-primary hover:bg-primary/20",
        icon: User,
        label: "Student"
    },
    MODERATOR: {
        className: "bg-muted/10 text-muted-foreground hover:bg-muted/20",
        icon: Shield,
        label: "Moderator"
    },
};

interface StatusBadgeProps {
    status: StatusType;
    showIcon?: boolean;
    customLabel?: string;
    size?: 'sm' | 'default' | 'lg';
}

export function StatusBadge({
                                status,
                                showIcon = false,
                                customLabel,
                                size = 'default'
                            }: StatusBadgeProps) {
    const config = statusConfigs[status];
    if (!config) {
        return (
            <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground">
                {customLabel || status}
            </Badge>
        );
    }

    const IconComponent = config.icon;
    const label = customLabel || config.label || status;

    return (
        <Badge
            variant="secondary"
            className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-1' : size === 'lg' ? 'text-sm px-3 py-1.5' : ''}`}
        >
            {showIcon && IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
            {label}
        </Badge>
    );
}