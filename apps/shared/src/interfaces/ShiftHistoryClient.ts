/**
 * File: ShiftHistoryClient.ts
 * Purpose: interface used in admin portal to represent ShiftHistory data
 */
export default interface ShiftHistoryClient {
    id: number,
    employeeId: number,
    employeeName: string,
    unit: string,
    dateRequested: string,
    status: string,
    shift: string,
    createdAt: Date,
}