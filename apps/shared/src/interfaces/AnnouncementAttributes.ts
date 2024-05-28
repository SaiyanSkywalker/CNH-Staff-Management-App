/**
 * File: AnnouncementAttributes.ts
 * Purpose: define shape of data for messages posted in chat (based off Announcement model)
 */
import UserInformationAttributes from "./UserInformationAttributes";

export default interface AnnouncementAttributes {
  id?: number;
  body: string;
  sender: UserInformationAttributes | null;
  senderId: number;
  channelId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
