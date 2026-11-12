import { HugeiconsIcon } from '@hugeicons/react';
import { AtIcon, Calendar03Icon, PlayIcon, ThumbsUpIcon, UserGroupIcon, Video01Icon } from '@hugeicons/core-free-icons';

import { formatCount, formatDate } from './format';
import { components } from '@/api-schema';

type UserDTO = components['schemas']['UserDTO'];

interface ProfileAboutProps {
  profile: UserDTO;
}

export function ProfileAbout({ profile }: ProfileAboutProps) {
  // Calculem les estadístiques basant-nos en els vídeos de l'usuari (si en té)
  const totalViews = profile.video?.reduce((acc, vid) => acc + (vid.views || 0), 0) || 0;
  const totalLikes = profile.video?.reduce((acc, vid) => acc + (vid.likes || 0), 0) || 0;
  const videoCount = profile.video?.length || 0;

  const details = [
    {
      icon: AtIcon,
      label: `@${profile.userName}`,
    },
    profile.joinDate && {
      icon: Calendar03Icon,
      label: `Joined ${formatDate(profile.joinDate)}`,
    },
  ].filter(Boolean) as {
    icon: typeof AtIcon;
    label: string;
    href?: string;
  }[];

  const stats = [
    {
      icon: UserGroupIcon,
      label: 'Subscribers',
      value: profile.suscribers || 0,
    },
    {
      icon: PlayIcon,
      label: 'Total views',
      value: totalViews,
    },
    {
      icon: Video01Icon,
      label: 'Videos',
      value: videoCount,
    },
    {
      icon: ThumbsUpIcon,
      label: 'Likes received',
      value: totalLikes,
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-bold">Description</h2>

          {/* Mostrem la descripció del backend, o un missatge per defecte */}
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {profile.description || 'Aquest usuari encara no ha escrit cap descripció.'}
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Details</h2>

          <ul className="space-y-3">
            {details.map((detail) => (
              <li key={detail.label} className="flex items-center gap-3 text-sm">
                <HugeiconsIcon icon={detail.icon} size={18} className="text-muted-foreground" />

                {detail.href ? (
                  <a href={detail.href} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {detail.label}
                  </a>
                ) : (
                  <span>{detail.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside>
        <h2 className="mb-3 text-lg font-bold">Stats</h2>

        <ul className="divide-y divide-border rounded-2xl border bg-card">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <HugeiconsIcon icon={stat.icon} size={18} />
              </span>

              <span className="flex-1 text-sm text-muted-foreground">{stat.label}</span>

              <span className="font-bold">{formatCount(stat.value)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
