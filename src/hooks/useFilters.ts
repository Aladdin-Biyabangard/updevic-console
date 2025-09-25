import { useState, useCallback, useMemo, useEffect } from 'react';

export interface FilterState {
    [key: string]: any;
}

export interface UseFiltersOptions<T extends FilterState> {
    initialFilters?: Partial<T>;
    onFiltersChange?: (filters: T) => void;
}

export function useFilters<T extends FilterState>({
                                                      initialFilters = {},
                                                      onFiltersChange
                                                  }: UseFiltersOptions<T> = {}) {
    const [filters, setFilters] = useState<T>(initialFilters as T);
    const [tempFilters, setTempFilters] = useState<T>(initialFilters as T);

    // Update a single filter
    const updateFilter = useCallback((key: keyof T, value: any) => {
        setTempFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Update multiple filters at once
    const updateFilters = useCallback((newFilters: Partial<T>) => {
        setTempFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Apply temp filters to active filters
    const applyFilters = useCallback(() => {
        setFilters(tempFilters);
        onFiltersChange?.(tempFilters);
    }, [tempFilters, onFiltersChange]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        const clearedFilters = {} as T;
        setFilters(clearedFilters);
        setTempFilters(clearedFilters);
        onFiltersChange?.(clearedFilters);
    }, [onFiltersChange]);

    // Reset temp filters to current active filters
    const resetTempFilters = useCallback(() => {
        setTempFilters(filters);
    }, [filters]);

    // Check if filters have any active values
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            return value && value.toString().trim() !== '';
        });
    }, [filters]);

    // Check if temp filters are different from active filters
    const hasUnappliedChanges = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(tempFilters);
    }, [filters, tempFilters]);

    // Get active filter count
    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(value => {
            if (Array.isArray(value)) return value.length > 0;
            return value && value.toString().trim() !== '';
        }).length;
    }, [filters]);

    // Convert filters to query parameters
    const toQueryParams = useCallback((filtersToConvert = filters) => {
        const params = new URLSearchParams();

        Object.entries(filtersToConvert).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        params.set(key, value.join(','));
                    }
                } else if (value.toString().trim() !== '') {
                    params.set(key, value.toString());
                }
            }
        });

        return params;
    }, [filters]);

    // Load filters from query parameters
    const fromQueryParams = useCallback((searchParams: URLSearchParams) => {
        const newFilters = {} as T;

        for (const [key, value] of searchParams.entries()) {
            if (value) {
                // Try to parse as array if it contains commas
                if (value.includes(',')) {
                    (newFilters as any)[key] = value.split(',');
                } else {
                    (newFilters as any)[key] = value;
                }
            }
        }

        setFilters(newFilters);
        setTempFilters(newFilters);
    }, []);

    return {
        // State
        filters,
        tempFilters,

        // Actions
        updateFilter,
        updateFilters,
        applyFilters,
        clearFilters,
        resetTempFilters,

        // Computed
        hasActiveFilters,
        hasUnappliedChanges,
        activeFilterCount,

        // Utilities
        toQueryParams,
        fromQueryParams,
    };
}

// Hook for simple search filters (common pattern)
export function useSearchFilters(onSearch?: (searchTerm: string) => void) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            onSearch?.(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        onSearch?.('');
    }, [onSearch]);

    return {
        searchTerm,
        debouncedSearchTerm,
        setSearchTerm,
        clearSearch,
        hasSearchTerm: searchTerm.trim() !== '',
    };
}