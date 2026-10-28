import type {
  Comment,
  RelatedVideo,
  Video,
} from './types';

export const mockVideo: Video = {
  id: 'abc123',
  title: 'Building a Full-Stack App with React & TypeScript in 2026',
  description:
    'In this video we build a complete full-stack application using React, TypeScript and modern frontend development practices. We cover component architecture, reusable UI, API integration and project structure.\n\nChapters:\n00:00 Introduction\n03:12 Project setup\n10:45 Component architecture\n24:30 Reusable UI with shadcn/ui\n38:05 API integration\n52:40 Project structure & wrap-up',
  videoUrl:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  thumbnail: 'https://picsum.photos/seed/watch-main/1280/720',
  duration: '1:04:12',
  views: 184_000,
  likes: 12_000,
  uploadedAt: '1 week ago',
  category: 'Technology',
  language: 'English',
  channel: {
    id: 'ch-alex',
    name: 'Alex Morgan',
    avatar: 'https://i.pravatar.cc/80?img=12',
    subscribers: 12_400,
  },
};

export const mockCommentCount = 328;

export const mockComments: Comment[] = [
  {
    id: 'c1',
    username: '@marcdev',
    avatar: 'https://i.pravatar.cc/80?img=33',
    text: 'Really useful explanation of the project structure. The separation between frontend and backend was especially helpful.',
    createdAt: '2 days ago',
    likes: 214,
    replies: [
      {
        id: 'c1-r1',
        username: '@AlexMorgan',
        avatar: 'https://i.pravatar.cc/80?img=12',
        text: 'Thanks Marc! Glad that part clicked for you.',
        createdAt: '2 days ago',
        likes: 41,
      },
      {
        id: 'c1-r2',
        username: '@laura.codes',
        avatar: 'https://i.pravatar.cc/80?img=47',
        text: 'Same here, I restructured my university project after watching this.',
        createdAt: '1 day ago',
        likes: 12,
      },
      {
        id: 'c1-r3',
        username: '@pablo_ts',
        avatar: 'https://i.pravatar.cc/80?img=15',
        text: 'Would love a follow-up on testing this setup.',
        createdAt: '20 hours ago',
        likes: 7,
      },
    ],
  },
  {
    id: 'c2',
    username: '@sofia.ui',
    avatar: 'https://i.pravatar.cc/80?img=5',
    text: 'The part about reusable components at 24:30 is gold. Clean and easy to follow.',
    createdAt: '4 days ago',
    likes: 98,
  },
  {
    id: 'c3',
    username: '@danielbuilds',
    avatar: 'https://i.pravatar.cc/80?img=59',
    text: 'Could you do a video on deploying this? Docker + CI would be amazing.',
    createdAt: '5 days ago',
    likes: 56,
  },
  {
    id: 'c4',
    username: '@nina_frontend',
    avatar: 'https://i.pravatar.cc/80?img=44',
    text: "Finally a TypeScript tutorial that doesn't skip the boring-but-important parts. Subscribed!",
    createdAt: '1 week ago',
    likes: 33,
  },
];

export const mockRelatedVideos: RelatedVideo[] = [
  {
    id: 'r1',
    thumbnail: 'https://picsum.photos/seed/rel1/640/360',
    duration: '18:24',
    title: 'React Server Components Explained Simply',
    channelName: 'Code Lane',
    views: 420_000,
    uploadedAt: '3 weeks ago',
  },
  {
    id: 'r2',
    thumbnail: 'https://picsum.photos/seed/rel2/640/360',
    duration: '42:10',
    title: 'TypeScript Generics: From Zero to Confident',
    channelName: 'Alex Morgan',
    views: 96_000,
    uploadedAt: '1 month ago',
  },
  {
    id: 'r3',
    thumbnail: 'https://picsum.photos/seed/rel3/640/360',
    duration: '12:05',
    title: 'Tailwind CSS v4 — Everything New',
    channelName: 'UI Weekly',
    views: 1_200_000,
    uploadedAt: '2 months ago',
  },
  {
    id: 'r4',
    thumbnail: 'https://picsum.photos/seed/rel4/640/360',
    duration: '27:48',
    title: 'Designing a REST API for a Video Platform',
    channelName: 'Backend Bits',
    views: 58_000,
    uploadedAt: '5 days ago',
  },
  {
    id: 'r5',
    thumbnail: 'https://picsum.photos/seed/rel5/640/360',
    duration: '9:31',
    title: "shadcn/ui Tips You Didn't Know",
    channelName: 'Frontend Fika',
    views: 230_000,
    uploadedAt: '2 weeks ago',
  },
  {
    id: 'r6',
    thumbnail: 'https://picsum.photos/seed/rel6/640/360',
    duration: '1:12:40',
    title: 'Full Course: PostgreSQL for Web Developers',
    channelName: 'Data Dojo',
    views: 3_400_000,
    uploadedAt: '1 year ago',
  },
];