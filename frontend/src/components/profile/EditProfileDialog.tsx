import { useEffect, useRef, useState, type ChangeEvent } from 'react';

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
import { getImageUrl, uploadFile } from '@/lib/fileApi';

import { components } from '@/api-schema';

type UserDTO = components['schemas']['UserDTO'];
type ProfileImageField = 'pictureFid' | 'bannerFid';

interface ProfileImageState {
  pictureFid: boolean;
  bannerFid: boolean;
}

interface ProfileImageErrors {
  pictureFid: string | null;
  bannerFid: string | null;
}

interface ProfileImageRequestIds {
  pictureFid: number;
  bannerFid: number;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserDTO;
  isSaving?: boolean;
  saveError?: string | null;
  onSave: (profile: UserDTO) => void;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  isSaving = false,
  saveError,
  onSave,
}: EditProfileDialogProps) {
  const [draft, setDraft] = useState<UserDTO>(profile);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<ProfileImageState>({ pictureFid: false, bannerFid: false });
  const [uploadErrors, setUploadErrors] = useState<ProfileImageErrors>({ pictureFid: null, bannerFid: null });
  const requestIds = useRef<ProfileImageRequestIds>({ pictureFid: 0, bannerFid: 0 });

  useEffect(() => {
    if (open) {
      setDraft(profile);
      setPicturePreview(null);
      setBannerPreview(null);
      setUploading({ pictureFid: false, bannerFid: false });
      setUploadErrors({ pictureFid: null, bannerFid: null });
    } else {
      requestIds.current.pictureFid++;
      requestIds.current.bannerFid++;
      setPicturePreview(null);
      setBannerPreview(null);
      setUploading({ pictureFid: false, bannerFid: false });
    }
  }, [open, profile]);

  useEffect(() => {
    return () => {
      if (picturePreview) {
        URL.revokeObjectURL(picturePreview);
      }
    };
  }, [picturePreview]);

  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const set = <K extends keyof UserDTO>(key: K, value: UserDTO[K]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  };

  async function handleImageChange(field: ProfileImageField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    const requestId = ++requestIds.current[field];
    const previewUrl = URL.createObjectURL(file);
    if (field === 'pictureFid') {
      setPicturePreview(previewUrl);
    } else {
      setBannerPreview(previewUrl);
    }

    setUploading((current) => ({ ...current, [field]: true }));
    setUploadErrors((current) => ({ ...current, [field]: null }));

    try {
      const fid = await uploadFile('images', file);
      if (requestId === requestIds.current[field]) {
        set(field, fid);
      }
    } catch (error) {
      if (requestId === requestIds.current[field]) {
        const imageName = field === 'pictureFid' ? 'Profile picture' : 'Banner image';
        const message = error instanceof Error ? error.message : 'Please try again.';
        setUploadErrors((current) => ({ ...current, [field]: `${imageName} upload failed: ${message}` }));
      }
    } finally {
      if (requestId === requestIds.current[field]) {
        setUploading((current) => ({ ...current, [field]: false }));
      }
    }
  }

  const canSave = Boolean(draft.displayName?.trim()) && Boolean(draft.userName?.trim());
  const isUploading = uploading.pictureFid || uploading.bannerFid;
  const hasUploadError = Boolean(uploadErrors.pictureFid || uploadErrors.bannerFid);
  const canSubmit = canSave && !isSaving && !isUploading && !hasUploadError;

  const initials = (draft.displayName || draft.userName || '').slice(0, 2).toUpperCase();

  const pictureSrc = picturePreview || getImageUrl(draft.pictureFid);
  const bannerSrc = bannerPreview || getImageUrl(draft.bannerFid);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && isUploading) {
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update how your channel appears to viewers.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Banner image upload section */}
          <div>
            <Label className="mb-2 block">Banner image</Label>
            <label className="group relative block aspect-[4/1] cursor-pointer overflow-hidden rounded-xl bg-muted">
              {bannerSrc ? (
                <img src={bannerSrc} alt="Banner" className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-muted to-primary/10" />
              )}

              <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon icon={Camera01Icon} size={18} />
                Change banner
              </span>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void handleImageChange('bannerFid', event)}
              />
            </label>
            {uploading.bannerFid && <p className="mt-1 text-xs text-muted-foreground">Uploading banner…</p>}
          </div>

          <div className="flex items-center gap-4">
            <label className="group relative cursor-pointer rounded-full">
              <Avatar className="size-20">
                <AvatarImage src={pictureSrc} alt={draft.displayName || draft.userName} className="object-cover" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <HugeiconsIcon icon={Camera01Icon} size={20} />
              </span>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void handleImageChange('pictureFid', event)}
              />
            </label>

            <div className="text-sm">
              <p className="font-semibold">Profile picture</p>
              <p className="text-muted-foreground">
                {uploading.pictureFid ? 'Uploading profile picture…' : 'Click the image to upload a new one.'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            {}
            <Input
              id="name"
              value={draft.displayName || ''}
              onChange={(event) => set('displayName', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              maxLength={160}
              value={draft.description || ''}
              onChange={(event) => set('description', event.target.value)}
            />
            {}
            <p className="text-right text-xs text-muted-foreground">{(draft.description || '').length}/160</p>
          </div>
        </div>

        {(uploadErrors.pictureFid || uploadErrors.bannerFid || saveError) && (
          <div className="space-y-1 text-sm text-destructive" role="alert">
            {uploadErrors.pictureFid && <p>{uploadErrors.pictureFid}</p>}
            {uploadErrors.bannerFid && <p>{uploadErrors.bannerFid}</p>}
            {saveError && <p>{saveError}</p>}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving || isUploading}>
            Cancel
          </Button>

          <Button disabled={!canSubmit} onClick={() => onSave(draft)}>
            {isSaving ? 'Saving...' : isUploading ? 'Uploading…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
