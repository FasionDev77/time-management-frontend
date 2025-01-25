export interface UsersRecordsInterface {
  _id: string;
  key: string;
  userId: { name: string; email: string; _id: string };
  description: string;
  date: string;
  duration: number;
}
