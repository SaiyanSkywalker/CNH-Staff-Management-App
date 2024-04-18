export default interface ShiftHistoryQuery {
    employeeId?: number;
    unitId?: number;
    employeeName?: string;
    date?: Date;
    shift?: string;
    status?: string;
}