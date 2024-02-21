export default interface AnnouncementAttributes {
  id?: number;
  body: string;
  senderId: number;
  channelId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
