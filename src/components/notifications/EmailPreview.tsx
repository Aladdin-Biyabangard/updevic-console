import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Calendar, Users, Mail } from 'lucide-react';
import type { EmailData } from '@/pages/admin/Notifications';

interface EmailPreviewProps {
    emailData: EmailData;
    onBack: () => void;
    onSend: () => void;
    isSending: boolean;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
                                                              emailData,
                                                              onBack,
                                                              onSend,
                                                              isSending
                                                          }) => {
    const getRecipientDescription = () => {
        if (emailData.recipients.type === 'all') {
            return 'All Users';
        } else if (emailData.recipients.type === 'groups') {
            const groups = emailData.recipients.groups || [];
            return groups.length > 0
                ? `${groups.length} group${groups.length !== 1 ? 's' : ''}`
                : 'No groups selected';
        } else {
            const users = emailData.recipients.userIds || [];
            return `${users.length} individual user${users.length !== 1 ? 's' : ''}`;
        }
    };

    const formatCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-secondary rounded-lg border border-accent/20">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2 border-primary/50 text-primary hover:bg-primary/10">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Edit
                </Button>
                <Button onClick={onSend} disabled={isSending} className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow">
                    <Send className="h-4 w-4" />
                    {isSending ? 'Sending...' : 'Send Email'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Email Preview */}
                <div className="lg:col-span-2">
                    <Card className="bg-gradient-card border-primary/20 shadow-custom-lg">
                        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            {/* Email Header */}
                            <div className="bg-gradient-secondary p-4 rounded-lg border border-accent/30">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground font-medium">From:</span>
                                        <Badge className="bg-success text-success-foreground">Admin Panel</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground font-medium">To:</span>
                                        <Badge variant="outline" className="border-primary/50 text-primary">{getRecipientDescription()}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground font-medium">Subject:</span>
                                        <span className="text-sm font-bold text-foreground">{emailData.subject}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            {/* Email Body */}
                            <div className="space-y-4">
                                <div className="bg-gradient-card border border-accent/20 rounded-lg p-6 shadow-custom-md">
                                    <h3 className="text-xl font-bold mb-4 text-primary">{emailData.subject}</h3>
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                                            {emailData.body}
                                        </p>
                                    </div>

                                    {emailData.image && (
                                        <div className="mt-6">
                                            <img
                                                src={URL.createObjectURL(emailData.image)}
                                                alt="Email attachment"
                                                className="max-w-full h-auto rounded-lg border-2 border-primary/30 shadow-glow"
                                            />
                                        </div>
                                    )}

                                    {/* Email Footer */}
                                    <div className="mt-8 pt-4 border-t border-accent/30 text-xs text-muted-foreground">
                                        <p>This email was sent from the Admin Panel.</p>
                                        <p>© 2024 Your Organization. All rights reserved.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <Card className="bg-gradient-secondary border-accent/20 shadow-custom-md">
                        <CardHeader className="bg-warning text-warning-foreground rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Delivery Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">Send Date:</span>
                                    <Badge className="bg-primary text-primary-foreground">{formatCurrentDate()}</Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">Recipients:</span>
                                    <Badge className="bg-success text-success-foreground">{getRecipientDescription()}</Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">Attachment:</span>
                                    <span className="text-sm">
                    {emailData.image ? (
                        <Badge className="bg-accent text-accent-foreground">Yes</Badge>
                    ) : (
                        <Badge variant="outline" className="border-muted-foreground/30">None</Badge>
                    )}
                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground font-medium">Priority:</span>
                                    <Badge className="bg-gradient-primary text-primary-foreground">Normal</Badge>
                                </div>
                            </div>

                            <Separator className="bg-gradient-to-r from-transparent via-accent to-transparent" />

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-foreground">Character Count</h4>
                                <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-lg">
                                    <div className="flex justify-between">
                                        <span>Subject:</span>
                                        <Badge variant="outline" className="text-xs">{emailData.subject.length}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Body:</span>
                                        <Badge variant="outline" className="text-xs">{emailData.body.length}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recipient Details */}
                    {emailData.recipients.type !== 'all' && (
                        <Card className="bg-gradient-card border-primary/20 shadow-custom-md">
                            <CardHeader className="bg-accent text-accent-foreground rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Recipient Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-2">
                                    {emailData.recipients.type === 'groups' && (
                                        <div>
                                            <p className="text-sm font-medium mb-2 text-foreground">Selected Groups:</p>
                                            <div className="space-y-1">
                                                {(emailData.recipients.groups || []).map((groupId) => (
                                                    <Badge key={groupId} className="mr-2 bg-primary text-primary-foreground">
                                                        {groupId}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {emailData.recipients.type === 'individuals' && (
                                        <div>
                                            <p className="text-sm font-medium mb-2 text-foreground">Selected Users:</p>
                                            <Badge className="bg-success text-success-foreground">
                                                {(emailData.recipients.userIds || []).length} user(s) selected
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};