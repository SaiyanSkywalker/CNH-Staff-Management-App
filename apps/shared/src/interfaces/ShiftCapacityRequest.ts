export default interface ShiftCapacityRequest {
    shiftDate: string,
    shiftTime: string,
    capacities: {[key: string] : number}    
}
