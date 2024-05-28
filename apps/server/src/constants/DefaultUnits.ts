/**
 * File: DefaultUnits.ts
 * Purpose: Defines default units to be added
 * to database if not already present
 */
const DefaultUnits = [
  { laborLevelEntryId: 53040, name: "ECMO", description: "ECMO" },
  {
    laborLevelEntryId: 42125,
    name: "CICU",
    description: "Cardiac Intensive Care Unit",
  },
  {
    laborLevelEntryId: 42150,
    name: "PICU",
    description: "Pediatric Intensive Care Unit",
  },
  {
    laborLevelEntryId: 42000,
    name: "NICU",
    description: "Neonatal Intensive Care Unit",
  },
  { laborLevelEntryId: 42130, name: "7EAST", description: "7EAST" },
  { laborLevelEntryId: 42110, name: "7EAST IRU", description: "7 East IR" },
  { laborLevelEntryId: 42140, name: "SCU", description: "Surgical Care Unit" },
  { laborLevelEntryId: 42135, name: "NSU", description: "Neurosciences Units" },
  { laborLevelEntryId: 42145, name: "HOCU", description: "HOCU" },
  { laborLevelEntryId: 42160, name: "4M", description: "4 Main" },
  {
    laborLevelEntryId: 42115,
    name: "HKU",
    description: "Heart and Kidney Unit",
  },
  { laborLevelEntryId: 47010, name: "PACU", description: "PACU" },
  { laborLevelEntryId: 47005, name: "OR", description: "Operating Room" },
  {
    laborLevelEntryId: 53430,
    name: "EMTC",
    description: "Emerg Med Trauma Center",
  },
  { laborLevelEntryId: 53710, name: "UMC", description: "UMC ED Facility" },
  {
    laborLevelEntryId: 41055,
    name: "CENTRAL STAFFING (FLOAT POOL)",
    description: "Central Nursing Resources",
  },
  {
    laborLevelEntryId: 56110,
    name: "APU/CPU",
    description: "I/P Psychiatry (Adol Child)",
  },
];
export default DefaultUnits;
