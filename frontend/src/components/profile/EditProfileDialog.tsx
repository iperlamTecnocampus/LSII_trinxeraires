import { useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { HugeiconsIcon } from '@hugeicons/react';
import { Camera01Icon } from '@hugeicons/core-free-icons';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { components } from '@/api-schema';

type UserDTO = components['schemas']['UserDTO'];

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserDTO;
  isSaving?: boolean;
  onSave: (profile: UserDTO) => void;
}

function readImage(event: ChangeEvent<HTMLInputElement>, callback: (url: string) => void) {
  const file = event.target.files?.[0];

  if (file) {
    // This generates a local URL to preview the image immediately
    callback(URL.createObjectURL(file));
  }
}

export function EditProfileDialog({ open, onOpenChange, profile, isSaving = false, onSave }: EditProfileDialogProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<UserDTO>(profile);

  useEffect(() => {
    if (open) {
      setDraft(profile);
    }
  }, [open, profile]);

  const set = <K extends keyof UserDTO>(key: K, value: UserDTO[K]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  };

  const canSave = Boolean(draft.displayName?.trim()) && Boolean(draft.userName?.trim());

  const initials = (draft.displayName || draft.userName || '').slice(0, 2).toUpperCase();

  const imageSrc = draft.pictureFid?.startsWith('blob:') ? draft.pictureFid : `/api/files/${draft.pictureFid}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('profile.edit.title')}</DialogTitle>
          <DialogDescription>{t('profile.edit.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Banner image upload section */}
          <div>
            <Label className="mb-2 block">{t('profile.edit.bannerLabel')}</Label>
            <label className="group relative block aspect-[4/1] cursor-pointer overflow-hidden rounded-xl bg-muted">
              {draft.bannerFid ? (
                <img
                  src={draft.bannerFid.startsWith('blob:') ? draft.bannerFid : `/api/files/${draft.bannerFid}`}
                  alt={t('profile.edit.bannerAlt')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-muted to-primary/10" />
              )}

              <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon icon={Camera01Icon} size={18} />
                {t('profile.edit.changeBanner')}
              </span>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => readImage(event, (url) => set('bannerFid', url))}
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="group relative cursor-pointer rounded-full">
              <Avatar className="size-20">
                <AvatarImage src={imageSrc} alt={draft.displayName || draft.userName} className="object-cover" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon icon={Camera01Icon} size={20} />
              </span>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => readImage(event, (url) => set('pictureFid', url))}
              />
            </label>

            <div className="text-sm">
              <p className="font-semibold">{t('profile.edit.pictureLabel')}</p>
              <p className="text-muted-foreground">{t('profile.edit.pictureHint')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t('profile.edit.displayName')}</Label>
            <Input
              id="name"
              value={draft.displayName || ''}
              onChange={(event) => set('displayName', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('profile.edit.description')}</Label>
            <Textarea
              id="description"
              rows={3}
              maxLength={160}
              value={draft.description || ''}
              onChange={(event) => set('description', event.target.value)}
            />
            <p className="text-right text-xs text-muted-foreground">{(draft.description || '').length}/160</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            {t('common.cancel')}
          </Button>

          <Button disabled={!canSave || isSaving} onClick={() => onSave(draft)}>
            {isSaving ? t('common.saving') : t('common.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
