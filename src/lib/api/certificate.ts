import axiosInstance from "../axios";

export interface CertificateCriteria {
    email?: string;
    trainingName?: string;
    status?: "ACTIVE" | "INACTIVE" | "PENDING" | "EXPIRED" | "REVOKED";
    type?: "NORMAL" | "SPECIAL";
    dateFrom?: string; // YYYY-MM-DD
    toDate?: string;   // YYYY-MM-DD
}

export interface Certificate {
    fullName: string;
    trainingName: string;
    createdAt: string;        // ISO string
    issueDate: string;        // YYYY-MM-DD
    certificateUrl: string;
    status: "ACTIVE";
    certificatePhotoUrl: string;
}

export interface CertificateResponse {
    content: Certificate[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const searchCertificates = async (
    criteria: CertificateCriteria = {},
    page: number = 0,
    size: number = 10
): Promise<CertificateResponse> => {
    try {
        const params: any = { page, size };

        if (criteria.email?.trim()) params.email = criteria.email.trim();
        if (criteria.trainingName?.trim()) params.trainingName = criteria.trainingName.trim();
        if (criteria.status?.trim()) params.status = criteria.status.trim();
        if (criteria.type?.trim()) params.type = criteria.type.trim();
        if (criteria.dateFrom?.trim()) params.dateFrom = criteria.dateFrom.trim();
        if (criteria.toDate?.trim()) params.toDate = criteria.toDate.trim();

        const response = await axiosInstance.get("/admins/certificates", { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch certificates");
    }
};
