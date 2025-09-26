import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import {
    searchApplications,
    getApplicationDetails,
    BasicApplication,
    DetailedApplication,
    ApplicationCriteria
} from "@/lib/api/applications.ts";

export const useApplications = () => {
    const [applications, setApplications] = useState<BasicApplication[]>([]);
    const [detailedApplications, setDetailedApplications] = useState<Map<string, DetailedApplication>>(new Map());
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    // Filters
    const [filters, setFilters] = useState<ApplicationCriteria>({});

    const { toast } = useToast();

    useEffect(() => {
        fetchApplications();
    }, [filters, currentPage]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await searchApplications(filters, currentPage, pageSize);
            setApplications(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch applications",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationDetails = async (id: string) => {
        if (detailedApplications.has(id)) return;

        try {
            const details = await getApplicationDetails(id);
            setDetailedApplications(prev => new Map(prev.set(id, details)));
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch application details",
                variant: "destructive",
            });
        }
    };

    return {
        applications,
        setApplications,
        detailedApplications,
        loading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalElements,
        filters,
        setFilters,
        fetchApplicationDetails,
        refetch: fetchApplications
    };
};