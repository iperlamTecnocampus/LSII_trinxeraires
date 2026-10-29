export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  uploadedAt: string;
  category?: string;
  language?: string;
  channel: Channel;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface RelatedVideo {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  channelName: string;
  views: number;
  uploadedAt: string;
}