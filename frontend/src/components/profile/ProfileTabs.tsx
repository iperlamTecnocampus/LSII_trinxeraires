import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { VideoGrid } from '@/components/VideoGrid';
import { ProfileAbout } from './ProfileAbout';
import { ProfileActivityList } from './ProfileActivityList';

import type { ProfileActivity, UserProfile } from './types';

interface ProfileTabsProps {
  profile: UserProfile;
  activity: ProfileActivity[];
}

const triggerClass =
  'relative h-12 flex-none rounded-none border-0 bg-transparent px-4 text-sm font-semibold text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent data-[state=active]:after:bg-primary';

export function ProfileTabs({ profile, activity }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="videos" className="mt-6">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0">
        <TabsTrigger value="videos" className={triggerClass}>
          Videos
        </TabsTrigger>

        <TabsTrigger value="about" className={triggerClass}>
          About
        </TabsTrigger>

        <TabsTrigger value="activity" className={triggerClass}>
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="videos" className="pt-6">
        <VideoGrid />
      </TabsContent>

      <TabsContent value="about" className="pt-6">
        <ProfileAbout profile={profile} />
      </TabsContent>

      <TabsContent value="activity" className="pt-6">
        <ProfileActivityList items={activity} />
      </TabsContent>
    </Tabs>
  );
}
