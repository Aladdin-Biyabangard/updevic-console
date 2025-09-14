// src/lib/api/teacherPaymentsApi.ts
import axiosInstance from "../axios";

// ---- Types ----
export type TeacherPaymentStatus = "PAID" | "PENDING" | "INACTIVE" | "CANCELED";

export interface TeacherPayment {
    id: number;
    teacherId: number;
    teacherName: string;
    teacherEmail: string;
    courseId: string;
    amount: number;
    status: TeacherPaymentStatus;
    description: string;
    paymentDateAndTime: string; // ISO date
}

export interface TeacherPaymentsResponse {
    content: TeacherPayment[];
    page: number;
    size: number;
}

export interface TeacherPaymentsCriteria {
    email?: string;
    status?: TeacherPaymentStatus;
    fromDate?: string; // yyyy-MM-dd
    toDate?: string;   // yyyy-MM-dd
}

export interface TeacherPaymentsRequest {
    page: number;
    size: number;
    criteria?: TeacherPaymentsCriteria;
}

// ---- API Calls ----

// GET /api/v1/admins/teacher-payments
export const getTeacherPayments = async (
    request: TeacherPaymentsRequest
): Promise<TeacherPaymentsResponse> => {
    const response = await axiosInstance.get("/admins/teacher-payments", {
        params: request,
    });
    return response.data;
};

// PUT /api/v1/admins/teacher-payments/{id}?description=...
export const updateTeacherPaymentDescription = async (
    id: number,
    description: string
): Promise<void> => {
    await axiosInstance.put(`/admins/teacher-payments/${id}`, null, {
        params: { description },
    });
};

// POST /api/v1/admins/teacher-payments/{id}/pay
export const payTeacherPayment = async (id: number): Promise<void> => {
    await axiosInstance.post(`/admins/teacher-payments/${id}/pay`);
};
