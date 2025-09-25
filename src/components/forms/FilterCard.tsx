import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, X } from 'lucide-react';
import { FormField } from './FormField';

interface FilterField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'date' | 'select' | 'multiselect';
    placeholder?: string;
    options?: { value: string; label: string }[];
}

interface ActiveFilter {
    key: string;
    label: string;
    value: string | string[];
    displayValue: string;
}

interface FilterCardProps {
    title?: string;
    fields: FilterField[];
    values: Record<string, any>;
    onChange: (key: string, value: any) => void;
    onSearch: () => void;
    onClear: () => void;
    loading?: boolean;
    activeFilters?: ActiveFilter[];
    onRemoveFilter?: (key: string) => void;
}

export function FilterCard({
                               title = "Advanced Search Filters",
                               fields,
                               values,
                               onChange,
                               onSearch,
                               onClear,
                               loading = false,
                               activeFilters = [],
                               onRemoveFilter
                           }: FilterCardProps) {
    const hasActiveFilters = activeFilters.length > 0 ||
        Object.values(values).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            return value && value.toString().trim() !== '';
        });

    return (
        <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filter Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {fields.map((field) => (
                        <FormField
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            type={field.type}
                            value={values[field.id]}
                            onChange={(value) => onChange(field.id, value)}
                            placeholder={field.placeholder}
                            options={field.options}
                        />
                    ))}
                </div>

                {/* Active Filters Display */}
                {(hasActiveFilters || activeFilters.length > 0) && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                        {/* Custom active filters */}
                        {activeFilters.map((filter) => (
                            <Badge key={filter.key} variant="secondary" className="gap-1">
                                {filter.label}: {filter.displayValue}
                                {onRemoveFilter && (
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onRemoveFilter(filter.key)}
                                    />
                                )}
                            </Badge>
                        ))}

                        {/* Auto-generated active filters */}
                        {Object.entries(values).map(([key, value]) => {
                            if (!value) return null;

                            const field = fields.find(f => f.id === key);
                            if (!field) return null;

                            let displayValue = '';
                            if (Array.isArray(value)) {
                                if (value.length === 0) return null;
                                displayValue = value.join(', ');
                            } else {
                                displayValue = value.toString();
                            }

                            if (!displayValue.trim()) return null;

                            return (
                                <Badge key={key} variant="secondary" className="gap-1">
                                    {field.label}: {displayValue}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onChange(key, Array.isArray(value) ? [] : '')}
                                    />
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={onSearch}
                        disabled={loading}
                        className="flex-1 sm:flex-none"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClear}
                        disabled={loading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}