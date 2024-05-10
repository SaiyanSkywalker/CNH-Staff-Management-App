export default interface ShiftHistoryQuery {
    employeeId?: number;
    unitId?: number;
    employeeName?: string;
    dateRequested?: string;
    shift?: string;
    status?: string;
    createdAt?: string;
}