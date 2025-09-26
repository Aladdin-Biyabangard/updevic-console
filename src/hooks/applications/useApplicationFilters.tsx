import { useState } from "react";
import { ApplicationCriteria } from "@/lib/api/applications";

export const useApplicationFilters = (
    setFilters: React.Dispatch<React.SetStateAction<ApplicationCriteria>>,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
    const [tempFilters, setTempFilters] = useState<ApplicationCriteria>({});

    const handleSearch = () => {
        setFilters(tempFilters);
        setCurrentPage(0);
    };

    const handleClearFilters = () => {
        setTempFilters({});
        setFilters({});
        setCurrentPage(0);
    };

    return {
        tempFilters,
        setTempFilters,
        handleSearch,
        handleClearFilters
    };
};