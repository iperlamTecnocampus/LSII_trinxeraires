import { formatCount } from './format';
import { components } from '@/api-schema';

type UserDTO = components['schemas']['UserDTO'];

interface ProfileStatsProps {
  profile: UserDTO;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  // Calculem la quantitat de vídeos comptant la llargada de l'array
  const videoCount = profile.video?.length || 0;

  // Sumem les visites de tots els vídeos per treure el total
  const totalViews = profile.video?.reduce((acc, vid) => acc + (vid.views || 0), 0) || 0;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span>
        <strong className="text-foreground">{formatCount(profile.suscribers || 0)}</strong> subscribers
      </span>

      <span>
        <strong className="text-foreground">{formatCount(videoCount)}</strong> videos
      </span>

      <span>
        <strong className="text-foreground">{formatCount(totalViews)}</strong> views
      </span>
    </div>
  );
}
