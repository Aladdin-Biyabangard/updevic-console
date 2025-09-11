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
    page: number;
    size: number;
}

export const getCertificates = async (
    criteria: CertificateCriteria = {},
    page: number = 0,
    size: number = 10
): Promise<CertificateResponse> => {
    try {
        const params: Record<string, any> = { page, size };

        // Criteria object bütün dəyərləri varsa saxlayırıq
        Object.keys(criteria).forEach((key) => {
            const value = (criteria as any)[key];
            if (value) {
                params[key] = value; // ✅ artıq criteria.email yox, sadəcə email
            }
        });

        const response = await axiosInstance.get("/admins/certificates", { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch certificates");
    }
};
