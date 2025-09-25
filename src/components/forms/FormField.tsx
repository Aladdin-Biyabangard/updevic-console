import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'checkbox';

interface SelectOption {
    value: string;
    label: string;
}

interface FormFieldProps {
    id: string;
    label: string;
    type: FormFieldType;
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: SelectOption[];
    className?: string;
    error?: string;
    description?: string;
}

export function FormField({
                              id,
                              label,
                              type,
                              value,
                              onChange,
                              placeholder,
                              required = false,
                              disabled = false,
                              options = [],
                              className = '',
                              error,
                              description
                          }: FormFieldProps) {
    const baseClasses = "space-y-2";

    const renderField = () => {
        switch (type) {
            case 'textarea':
                return (
                    <Textarea
                        id={id}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={error ? 'border-destructive focus:border-destructive' : ''}
                    />
                );

            case 'select':
                return (
                    <Select
                        value={value || ''}
                        onValueChange={onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className={error ? 'border-destructive focus:border-destructive' : ''}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {placeholder && (
                                <SelectItem value="">
                                    {placeholder}
                                </SelectItem>
                            )}
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'multiselect':
                const selectedValues = Array.isArray(value) ? value : [];
                const handleToggle = (optionValue: string) => {
                    const newValues = selectedValues.includes(optionValue)
                        ? selectedValues.filter(v => v !== optionValue)
                        : [...selectedValues, optionValue];
                    onChange(newValues);
                };

                return (
                    <div className="space-y-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start ${error ? 'border-destructive' : ''}`}
                                    disabled={disabled}
                                >
                                    {selectedValues.length > 0
                                        ? `${selectedValues.length} selected`
                                        : placeholder || 'Select options...'
                                    }
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-2">
                                <div className="space-y-2">
                                    {options.map((option) => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`${id}-${option.value}`}
                                                checked={selectedValues.includes(option.value)}
                                                onCheckedChange={() => handleToggle(option.value)}
                                                disabled={disabled}
                                            />
                                            <Label htmlFor={`${id}-${option.value}`} className="text-sm font-normal">
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {selectedValues.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedValues.map((val) => {
                                    const option = options.find(opt => opt.value === val);
                                    return (
                                        <Badge key={val} variant="secondary" className="gap-1">
                                            {option?.label || val}
                                            {!disabled && (
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => handleToggle(val)}
                                                />
                                            )}
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={id}
                            checked={value || false}
                            onCheckedChange={onChange}
                            disabled={disabled}
                        />
                        <Label htmlFor={id} className="text-sm font-normal">
                            {label}
                        </Label>
                    </div>
                );

            default:
                return (
                    <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={error ? 'border-destructive focus:border-destructive' : ''}
                    />
                );
        }
    };

    if (type === 'checkbox') {
        return (
            <div className={`${baseClasses} ${className}`}>
                {renderField()}
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${className}`}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {renderField()}
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
}