/**
 * File: CNHEvent.tsx
 * Purpose: Interface that extends Calendar
 * component event to include capacity info
 */
import { Event } from "react-big-calendar";
export interface CNHEvent extends Event {
  capacityRatio: number;
}
