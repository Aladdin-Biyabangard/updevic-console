import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RecipientSelector } from './RecipientSelector';
import { EmailPreview } from './EmailPreview';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Send, Eye, Save, Users } from 'lucide-react';
import type { EmailData } from '@/pages/admin/Notifications';

export const EmailComposer: React.FC = () => {
    const { toast } = useToast();
    const [emailData, setEmailData] = useState<EmailData>({
        subject: '',
        body: '',
        image: null,
        recipients: { type: 'all' }
    });
    const [showPreview, setShowPreview] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubjectChange = (value: string) => {
        setEmailData(prev => ({ ...prev, subject: value }));
    };

    const handleBodyChange = (value: string) => {
        setEmailData(prev => ({ ...prev, body: value }));
    };

    const handleImageChange = (file: File | null) => {
        setEmailData(prev => ({ ...prev, image: file }));
    };

    const handleRecipientsChange = (recipients: EmailData['recipients']) => {
        setEmailData(prev => ({ ...prev, recipients }));
    };

    const handleSendEmail = async () => {
        if (!emailData.subject.trim() || !emailData.body.trim()) {
            toast({
                title: "Validation Error",
                description: "Please fill in both subject and body fields.",
                variant: "destructive"
            });
            return;
        }

        setIsSending(true);
        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Email Sent Successfully",
                description: "Your notification has been sent to the selected recipients.",
            });

            // Reset form
            setEmailData({
                subject: '',
                body: '',
                image: null,
                recipients: { type: 'all' }
            });
            setShowPreview(false);
        } catch (error) {
            toast({
                title: "Failed to Send Email",
                description: "There was an error sending your notification. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleSaveDraft = () => {
        toast({
            title: "Draft Saved",
            description: "Your email draft has been saved successfully.",
        });
    };

    const isFormValid = emailData.subject.trim() && emailData.body.trim();

    return (
        <div className="space-y-6">
            {!showPreview ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Email Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-gradient-card border-accent/20 shadow-custom-md">
                            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Email Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-foreground font-medium">Subject *</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Enter email subject..."
                                        value={emailData.subject}
                                        onChange={(e) => handleSubjectChange(e.target.value)}
                                        className="w-full border-primary/30 focus:border-primary focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="body" className="text-foreground font-medium">Message *</Label>
                                    <Textarea
                                        id="body"
                                        placeholder="Enter your message here..."
                                        value={emailData.body}
                                        onChange={(e) => handleBodyChange(e.target.value)}
                                        className="min-h-[200px] resize-none border-primary/30 focus:border-primary focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-foreground font-medium">Attachment (Optional)</Label>
                                    <ImageUpload onImageChange={handleImageChange} currentImage={emailData.image} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recipients */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-secondary border-accent/20 shadow-custom-md">
                            <CardHeader className="bg-accent text-accent-foreground rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Recipients
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <RecipientSelector
                                    value={emailData.recipients}
                                    onChange={handleRecipientsChange}
                                />
                            </CardContent>
                        </Card>

                        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                onClick={() => setShowPreview(true)}
                                variant="outline"
                                className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
                                disabled={!isFormValid}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Email
                            </Button>

                            <Button
                                onClick={handleSaveDraft}
                                className="w-full bg-warning hover:bg-warning/90 text-warning-foreground shadow-glow transition-all duration-300"
                                disabled={!emailData.subject.trim() && !emailData.body.trim()}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Draft
                            </Button>

                            <Button
                                onClick={handleSendEmail}
                                className="w-full bg-gradient-primary hover:shadow-glow disabled:opacity-50 transition-all duration-300"
                                disabled={!isFormValid || isSending}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {isSending ? 'Sending...' : 'Send Email'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <EmailPreview
                    emailData={emailData}
                    onBack={() => setShowPreview(false)}
                    onSend={handleSendEmail}
                    isSending={isSending}
                />
            )}
        </div>
    );
};