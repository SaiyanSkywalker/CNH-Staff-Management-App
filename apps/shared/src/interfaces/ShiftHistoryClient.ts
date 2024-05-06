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