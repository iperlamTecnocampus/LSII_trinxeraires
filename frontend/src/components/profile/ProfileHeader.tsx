import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, Edit02Icon } from '@hugeicons/core-free-icons';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { ProfileStats } from './ProfileStats';
import { formatDate } from './format';

import { useNavigate } from 'react-router';
import { components } from '@/api-schema';

type UserDTO = components['schemas']['UserDTO'];

interface ProfileHeaderProps {
  profile: UserDTO;
  onEdit: () => void;
}

export function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <header>
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[4/1]">
        {/* Assumint que el backend no té banner per ara, hi deixem un fons genèric o gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-muted to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
      </div>

      <div className="relative -mt-12 flex flex-col gap-5 px-2 sm:-mt-16 sm:px-6 md:flex-row md:items-end">
        <Avatar className="size-24 shrink-0 ring-4 ring-background sm:size-36">
          {/* Assegura't de concatenar la teva URL base d'imatges aquí si el pictureFid només és un ID */}
          <AvatarImage
            src={`/api/files/${profile.pictureFid}`}
            alt={profile.displayName || profile.userName}
            className="object-cover"
          />

          <AvatarFallback>{(profile.displayName || profile.userName)?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-2 md:pb-2">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {profile.displayName || profile.userName}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">@{profile.userName}</span>

            {profile.joinDate && (
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Calendar03Icon} size={14} />
                Joined {formatDate(profile.joinDate)}
              </span>
            )}
          </div>

          {/* Caldrà que adaptis ProfileStats per usar UserDTO també si hi té props */}
          <ProfileStats profile={profile as any} />

          {profile.description && <p className="max-w-2xl text-sm text-muted-foreground">{profile.description}</p>}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:pb-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full md:w-auto"
            size="lg"
            onClick={() => navigate('/upload')}
          >
            Upload video
          </Button>

          <Button type="button" onClick={onEdit} className="w-full rounded-full md:w-auto" size="lg">
            <HugeiconsIcon icon={Edit02Icon} size={18} />
            Edit profile
          </Button>
        </div>
      </div>
    </header>
  );
}
