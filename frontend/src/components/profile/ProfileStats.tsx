import { formatCount } from './format';
import type { UserProfile } from './types';

interface ProfileStatsProps {
  profile: UserProfile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span>
        <strong className="text-foreground">{formatCount(profile.subscribers)}</strong> subscribers
      </span>

      <span>
        <strong className="text-foreground">{formatCount(profile.videoCount)}</strong> videos
      </span>

      <span>
        <strong className="text-foreground">{formatCount(profile.totalViews)}</strong> views
      </span>
    </div>
  );
}
