/**
 * File: ChannelAttributes.ts
 * Purpose: define shape of data for chat channels (based off Channel model)
 */
export default interface ChannelAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  unitRoomId?: number | null;
}
