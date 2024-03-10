export default interface ShiftCapacityConfig {
    shiftDate: Date,
    shift: string,
    capacities: {[key: string] : number}    
}
