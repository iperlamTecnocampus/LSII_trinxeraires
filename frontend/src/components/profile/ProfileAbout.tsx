import { HugeiconsIcon } from '@hugeicons/react';
import {
  AtIcon,
  Calendar03Icon,
  Globe02Icon,
  Location01Icon,
  PlayIcon,
  ThumbsUpIcon,
  UserGroupIcon,
  Video01Icon,
} from '@hugeicons/core-free-icons';

import { formatCount, formatDate } from './format';
import type { UserProfile } from './types';

interface ProfileAboutProps {
  profile: UserProfile;
}

export function ProfileAbout({
  profile,
}: ProfileAboutProps) {
  const details = [
    {
      icon: AtIcon,
      label: `@${profile.username}`,
    },
    {
      icon: Calendar03Icon,
      label: `Joined ${formatDate(profile.joinedAt)}`,
    },
    profile.location && {
      icon: Location01Icon,
      label: profile.location,
    },
    profile.website && {
      icon: Globe02Icon,
      label: profile.website,
      href: `https://${profile.website}`,
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
      value: profile.subscribers,
    },
    {
      icon: PlayIcon,
      label: 'Total views',
      value: profile.totalViews,
    },
    {
      icon: Video01Icon,
      label: 'Videos',
      value: profile.videoCount,
    },
    {
      icon: ThumbsUpIcon,
      label: 'Likes received',
      value: profile.likesReceived,
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-bold">
            Description
          </h2>

          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {profile.longDescription}
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">
            Details
          </h2>

          <ul className="space-y-3">
            {details.map((detail) => (
              <li
                key={detail.label}
                className="flex items-center gap-3 text-sm"
              >
                <HugeiconsIcon
                  icon={detail.icon}
                  size={18}
                  className="text-muted-foreground"
                />

                {detail.href ? (
                  <a
                    href={detail.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
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
        <h2 className="mb-3 text-lg font-bold">
          Stats
        </h2>

        <ul className="divide-y divide-border rounded-2xl border bg-card">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center gap-3 px-4 py-3.5"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <HugeiconsIcon
                  icon={stat.icon}
                  size={18}
                />
              </span>

              <span className="flex-1 text-sm text-muted-foreground">
                {stat.label}
              </span>

              <span className="font-bold">
                {formatCount(stat.value)}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}