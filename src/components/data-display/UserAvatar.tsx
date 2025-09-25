import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/formatters';

interface UserAvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallbackClassName?: string;
}

const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
};

export function UserAvatar({
                               src,
                               name,
                               size = 'md',
                               className = '',
                               fallbackClassName = ''
                           }: UserAvatarProps) {
    return (
        <Avatar className={`${sizeClasses[size]} ${className}`}>
            <AvatarImage src={src} alt={name} />
            <AvatarFallback
                className={`bg-gradient-primary text-white font-medium ${fallbackClassName}`}
            >
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
}