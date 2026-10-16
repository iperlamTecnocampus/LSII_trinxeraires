import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  Edit02Icon,
} from '@hugeicons/core-free-icons';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { ProfileStats } from './ProfileStats';
import { formatDate } from './format';
import type { UserProfile } from './types';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileHeader({
  profile,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <header>
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[4/1]">
        <img
          src={profile.banner}
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
      </div>

      <div className="relative -mt-12 flex flex-col gap-5 px-2 sm:-mt-16 sm:px-6 md:flex-row md:items-end">
        <Avatar className="size-24 shrink-0 ring-4 ring-background sm:size-36">
          <AvatarImage
            src={profile.avatar}
            alt={profile.name}
            className="object-cover"
          />

          <AvatarFallback>
            {profile.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-2 md:pb-2">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {profile.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              @{profile.username}
            </span>

            <span className="flex items-center gap-1">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={14}
              />

              Joined {formatDate(profile.joinedAt)}
            </span>
          </div>

          <ProfileStats profile={profile} />

          <p className="max-w-2xl text-sm text-muted-foreground">
            {profile.description}
          </p>
        </div>

        <div className="md:pb-3">
          <Button
            onClick={onEdit}
            className="w-full rounded-full md:w-auto"
            size="lg"
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size={18}
            />

            Edit profile
          </Button>
        </div>
      </div>
    </header>
  );
}