import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Mail, Calendar, Users, RefreshCw, Eye } from 'lucide-react';

interface NotificationRecord {
    id: string;
    subject: string;
    recipientCount: number;
    sentDate: string;
    status: 'sent' | 'failed' | 'pending';
    recipientType: string;
    openRate?: number;
}

export const NotificationHistory: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockNotifications: NotificationRecord[] = [
            {
                id: '1',
                subject: 'Welcome to the new semester',
                recipientCount: 1245,
                sentDate: '2024-01-15T10:30:00Z',
                status: 'sent',
                recipientType: 'All Users',
                openRate: 78.5
            },
            {
                id: '2',
                subject: 'Important: System Maintenance',
                recipientCount: 45,
                sentDate: '2024-01-14T09:15:00Z',
                status: 'sent',
                recipientType: 'Administrators',
                openRate: 95.2
            },
            {
                id: '3',
                subject: 'Course Registration Opens',
                recipientCount: 892,
                sentDate: '2024-01-12T14:20:00Z',
                status: 'sent',
                recipientType: 'Students',
                openRate: 65.8
            },
            {
                id: '4',
                subject: 'Monthly Report Summary',
                recipientCount: 156,
                sentDate: '2024-01-10T16:45:00Z',
                status: 'failed',
                recipientType: 'Teachers'
            },
            {
                id: '5',
                subject: 'New Feature Announcement',
                recipientCount: 2341,
                sentDate: '2024-01-08T11:00:00Z',
                status: 'sent',
                recipientType: 'All Users',
                openRate: 42.3
            }
        ];

        setTimeout(() => {
            setNotifications(mockNotifications);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.subject
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: NotificationRecord['status']) => {
        const variants = {
            sent: 'default',
            failed: 'destructive',
            pending: 'secondary'
        } as const;

        const labels = {
            sent: 'Sent',
            failed: 'Failed',
            pending: 'Pending'
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatsCard = (title: string, value: string | number, icon: React.ReactNode, description: string) => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                    <div className="text-muted-foreground">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading notification history...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {getStatsCard(
                    "Total Sent",
                    notifications.filter(n => n.status === 'sent').length,
                    <Mail className="h-5 w-5" />,
                    "Successfully delivered"
                )}
                {getStatsCard(
                    "Failed",
                    notifications.filter(n => n.status === 'failed').length,
                    <Mail className="h-5 w-5" />,
                    "Delivery failed"
                )}
                {getStatsCard(
                    "Recipients",
                    notifications.reduce((sum, n) => sum + (n.status === 'sent' ? n.recipientCount : 0), 0).toLocaleString(),
                    <Users className="h-5 w-5" />,
                    "Total users reached"
                )}
                {getStatsCard(
                    "Avg. Open Rate",
                    `${(notifications
                            .filter(n => n.openRate)
                            .reduce((sum, n) => sum + (n.openRate || 0), 0) /
                        notifications.filter(n => n.openRate).length || 0
                    ).toFixed(1)}%`,
                    <Eye className="h-5 w-5" />,
                    "Email engagement"
                )}
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Notification History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notifications Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Recipients</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date Sent</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Open Rate</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNotifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {searchTerm || statusFilter !== 'all'
                                                ? 'No notifications found matching your filters'
                                                : 'No notifications sent yet'
                                            }
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredNotifications.map((notification) => (
                                        <TableRow key={notification.id}>
                                            <TableCell className="font-medium max-w-[250px]">
                                                <div className="truncate" title={notification.subject}>
                                                    {notification.subject}
                                                </div>
                                            </TableCell>
                                            <TableCell>{notification.recipientCount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{notification.recipientType}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(notification.sentDate)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(notification.status)}</TableCell>
                                            <TableCell>
                                                {notification.openRate ? (
                                                    <span className="text-sm">{notification.openRate}%</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};