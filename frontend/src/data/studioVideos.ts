export type VideoVisibility = 'public' | 'unlisted' | 'private';
export type VideoStatus = 'published' | 'processing' | 'draft';

export interface StudioVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  uploadedAt: string;
  visibility: VideoVisibility;
  status: VideoStatus;
  views: number;
  likes: number;
  comments: number;
  category: string;
  language: string;
}

export const mockVideos: StudioVideo[] = [
  {
    id: '1',
    title: 'Building a React App from Scratch',
    description: 'Full walkthrough from setup to deploy.',
    thumbnail: 'https://picsum.photos/seed/protube-react/320/180',
    uploadedAt: '2026-10-28',
    visibility: 'public',
    status: 'published',
    views: 24800,
    likes: 1800,
    comments: 243,
    category: '',
    language: 'English',
  },
  {
    id: '2',
    title: 'TypeScript Tutorial for Beginners',
    description: 'Types, interfaces and generics explained.',
    thumbnail: 'https://picsum.photos/seed/protube-ts/320/180',
    uploadedAt: '2026-10-14',
    visibility: 'public',
    status: 'published',
    views: 18200,
    likes: 1200,
    comments: 126,
    category: '',
    language: 'English',
  },
  {
    id: '3',
    title: 'My Development Setup',
    description: 'Editor, terminal and tools I use daily.',
    thumbnail: 'https://picsum.photos/seed/protube-setup/320/180',
    uploadedAt: '2026-09-30',
    visibility: 'unlisted',
    status: 'published',
    views: 3400,
    likes: 284,
    comments: 32,
    category: '',
    language: 'English',
  },
  {
    id: '4',
    title: 'New Project Preview',
    description: 'Sneak peek of what is coming next.',
    thumbnail: 'https://picsum.photos/seed/protube-preview/320/180',
    uploadedAt: '2026-11-09',
    visibility: 'private',
    status: 'draft',
    views: 0,
    likes: 0,
    comments: 0,
    category: '',
    language: 'English',
  },
];

export function getStudioVideo(videoId: string) {
  return mockVideos.find((video) => video.id === videoId);
}