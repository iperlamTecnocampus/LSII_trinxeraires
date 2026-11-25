import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import { AtIcon, Calendar03Icon, PlayIcon, ThumbsUpIcon, UserGroupIcon, Video01Icon } from '@hugeicons/core-free-icons';

import { formatCount, formatDate } from './format';
import { components } from '@/api-schema';

type UserDTO = components['schemas']['UserDTO'];

interface ProfileAboutProps {
  profile: UserDTO;
}

export function ProfileAbout({ profile }: ProfileAboutProps) {
  const { t } = useTranslation();

  // Calculem les estadístiques basant-nos en els vídeos de l'usuari (si en té)
  const totalViews = profile.videos?.reduce((acc, vid) => acc + (vid.views || 0), 0) || 0;
  const totalLikes = profile.videos?.reduce((acc, vid) => acc + (vid.likes || 0), 0) || 0;
  const videoCount = profile.videos?.length || 0;

  const details = [
    {
      id: 'username',
      icon: AtIcon,
      label: `@${profile.userName}`,
    },
    profile.joinDate && {
      id: 'joinDate',
      icon: Calendar03Icon,
      label: t('profile.about.joined', { date: formatDate(profile.joinDate) }),
    },
  ].filter(Boolean) as {
    id: string;
    icon: typeof AtIcon;
    label: string;
    href?: string;
  }[];

  const stats = [
    {
      id: 'subscribers',
      icon: UserGroupIcon,
      label: t('profile.about.subscribers'),
      value: profile.suscribers || 0,
    },
    {
      id: 'views',
      icon: PlayIcon,
      label: t('profile.about.totalViews'),
      value: totalViews,
    },
    {
      id: 'videos',
      icon: Video01Icon,
      label: t('profile.about.videos'),
      value: videoCount,
    },
    {
      id: 'likes',
      icon: ThumbsUpIcon,
      label: t('profile.about.likesReceived'),
      value: totalLikes,
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-bold">{t('profile.about.description')}</h2>

          {/* Mostrem la descripció del backend, o un missatge per defecte */}
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {profile.description || t('profile.about.noDescription')}
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">{t('profile.about.details')}</h2>

          <ul className="space-y-3">
            {details.map((detail) => (
              <li key={detail.id} className="flex items-center gap-3 text-sm">
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
        <h2 className="mb-3 text-lg font-bold">{t('profile.about.stats')}</h2>

        <ul className="divide-y divide-border rounded-2xl border bg-card">
          {stats.map((stat) => (
            <li key={stat.id} className="flex items-center gap-3 px-4 py-3.5">
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