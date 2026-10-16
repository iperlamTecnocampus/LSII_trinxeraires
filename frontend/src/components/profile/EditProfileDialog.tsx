import {
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import { Camera01Icon } from '@hugeicons/core-free-icons';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { UserProfile } from './types';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

function readImage(
  event: ChangeEvent<HTMLInputElement>,
  callback: (url: string) => void
) {
  const file = event.target.files?.[0];

  if (file) {
    callback(URL.createObjectURL(file));
  }
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSave,
}: EditProfileDialogProps) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (open) {
      setDraft(profile);
    }
  }, [open, profile]);

  const set = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  };

  const canSave =
    draft.name.trim() !== '' &&
    draft.username.trim() !== '';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Edit profile
          </DialogTitle>

          <DialogDescription>
            Update how your channel appears to viewers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">
              Banner image
            </Label>

            <label className="group relative block aspect-[4/1] cursor-pointer overflow-hidden rounded-xl bg-muted">
              <img
                src={draft.banner}
                alt=""
                className="h-full w-full object-cover"
              />

              <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon
                  icon={Camera01Icon}
                  size={18}
                />

                Change banner
              </span>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  readImage(event, (url) =>
                    set('banner', url)
                  )
                }
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="group relative cursor-pointer rounded-full">
              <Avatar className="size-20">
                <AvatarImage
                  src={draft.avatar}
                  alt={draft.name}
                  className="object-cover"
                />

                <AvatarFallback>
                  {draft.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon
                  icon={Camera01Icon}
                  size={20}
                />
              </span>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  readImage(event, (url) =>
                    set('avatar', url)
                  )
                }
              />
            </label>

            <div className="text-sm">
              <p className="font-semibold">
                Profile picture
              </p>

              <p className="text-muted-foreground">
                Click the image to upload a new one.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Display name
            </Label>

            <Input
              id="name"
              value={draft.name}
              onChange={(event) =>
                set('name', event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">
              Username
            </Label>

            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                @
              </span>

              <Input
                id="username"
                className="pl-7"
                value={draft.username}
                onChange={(event) =>
                  set(
                    'username',
                    event.target.value
                      .replace(/\s/g, '')
                      .toLowerCase()
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              rows={3}
              maxLength={160}
              value={draft.description}
              onChange={(event) =>
                set('description', event.target.value)
              }
            />

            <p className="text-right text-xs text-muted-foreground">
              {draft.description.length}/160
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={!canSave}
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}