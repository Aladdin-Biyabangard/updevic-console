import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
    onImageChange: (file: File | null) => void;
    currentImage?: File | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
                                                            onImageChange,
                                                            currentImage
                                                        }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const { toast } = useToast();

    const handleFileSelect = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid File Type",
                description: "Please select an image file (PNG, JPG, JPEG, GIF, WebP).",
                variant: "destructive"
            });
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select an image smaller than 5MB.",
                variant: "destructive"
            });
            return;
        }

        onImageChange(file);
        toast({
            title: "Image Uploaded",
            description: `${file.name} has been added to your email.`,
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const removeImage = () => {
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast({
            title: "Image Removed",
            description: "The image attachment has been removed.",
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-3">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {!currentImage ? (
                <Card
                    className={`border-2 border-dashed transition-colors cursor-pointer ${
                        isDragOver
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium mb-1">
                            Drop an image here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, JPEG, GIF, WebP up to 5MB
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src={URL.createObjectURL(currentImage)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {currentImage.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                    <ImageIcon className="h-3 w-3 mr-1" />
                                    Image
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                  {formatFileSize(currentImage.size)}
                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                            }}
                            className="flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};