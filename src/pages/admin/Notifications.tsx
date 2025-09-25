import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailComposer } from '@/components/notifications/EmailComposer';
import { NotificationHistory } from '@/components/notifications/NotificationHistory';
import { Mail, History, Send } from 'lucide-react';

export interface EmailData {
    subject: string;
    body: string;
    image?: File | null;
    recipients: {
        type: 'all' | 'groups' | 'individuals';
        groups?: string[];
        userIds?: number[];
    };
}

const Notifications: React.FC = () => {
    const [activeTab, setActiveTab] = useState('compose');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                    <p className="text-muted-foreground mt-2">
                        Send email notifications to users and manage notification history
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Compose Email
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                Compose New Email
                            </CardTitle>
                            <CardDescription>
                                Create and send email notifications to selected recipients
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EmailComposer />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Notification History
                            </CardTitle>
                            <CardDescription>
                                View previously sent email notifications and their status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NotificationHistory />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Notifications;