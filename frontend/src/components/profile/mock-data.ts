import avatar from '@/assets/profile-avatar.jpg';
import banner from '@/assets/profile-banner.jpg';

import type {
  ProfileActivity,
  UserProfile,
} from './types';

export const mockProfile: UserProfile = {
  id: 'u_1',
  name: 'Alex Morgan',
  username: 'alexmorgan',
  avatar,
  banner,
  description: 'Technology, development and productivity videos.',
  longDescription:
    "Hi, I'm Alex — a software engineer turned full-time creator. Every week I publish practical tutorials on web development, honest reviews of the tools I use daily, and deep dives into building a productive workflow. No hype, just things that actually help you ship better software.",
  subscribers: 12400,
  totalViews: 1200000,
  videoCount: 36,
  likesReceived: 84300,
  joinedAt: '2021-03-14',
  location: 'Barcelona, Spain',
  website: 'alexmorgan.dev',
};

export const mockActivity: ProfileActivity[] = [
  {
    id: 'a1',
    type: 'upload',
    text: 'Uploaded “Building a Full-Stack App with React & TypeScript in 2026”',
    date: '2026-10-08',
  },
  {
    id: 'a2',
    type: 'comment',
    text: 'Received 248 new comments on “My Minimal Desk Setup for Deep Work”',
    date: '2026-10-02',
  },
  {
    id: 'a3',
    type: 'update',
    text: 'Updated the thumbnail of “Tailwind CSS v4: Everything That Changed”',
    date: '2026-09-20',
  },
  {
    id: 'a4',
    type: 'milestone',
    text: 'Reached 10,000 subscribers',
    date: '2026-09-11',
  },
];