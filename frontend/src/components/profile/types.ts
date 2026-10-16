export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  description: string;
  longDescription: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  likesReceived: number;
  joinedAt: string;
  location?: string;
  website?: string;
}

export type ActivityType =
  | 'upload'
  | 'update'
  | 'milestone'
  | 'comment';

export interface ProfileActivity {
  id: string;
  type: ActivityType;
  text: string;
  date: string;
}