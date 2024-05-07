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
