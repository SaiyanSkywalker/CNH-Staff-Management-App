/**
 * File: ShiftHistoryQuery.ts
 * Purpose: interface used to represent info for search query
 * involving ShiftHistory
 */
export default interface ShiftHistoryQuery {
    employeeId?: number;
    unitId?: number;
    employeeName?: string;
    dateRequested?: string;
    shift?: string;
    status?: string;
    createdAt?: string;
}