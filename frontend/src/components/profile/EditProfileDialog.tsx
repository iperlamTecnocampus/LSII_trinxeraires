import { useEffect, useState, type ChangeEvent } from 'react';

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
  onSave: (profile: UserDTO) => void;
}

function readImage(event: ChangeEvent<HTMLInputElement>, callback: (url: string) => void) {
  const file = event.target.files?.[0];

  if (file) {
    // Això genera una URL local per poder previsualitzar la imatge al moment
    callback(URL.createObjectURL(file));
  }
}

export function EditProfileDialog({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) {
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

  // ✅ SOLUCIÓ A L'ERROR BLANC: Comprovem que existeixi abans de fer .trim()
  const canSave = Boolean(draft.displayName?.trim()) && Boolean(draft.userName?.trim());

  // Helper per a les inicials si no hi ha foto
  const initials = (draft.displayName || draft.userName || '').slice(0, 2).toUpperCase();

  // Helper per la imatge: Si és una URL local que acabem de posar començarà per 'blob:',
  // si no, assumim que ve del backend
  const imageSrc = draft.pictureFid?.startsWith('blob:') ? draft.pictureFid : `/api/files/${draft.pictureFid}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update how your channel appears to viewers.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* BANNER: El teu backend actual no té "banner", ho deixem visual però desactivat */}
          <div>
            <Label className="mb-2 block">Banner image (No disponible a la DB)</Label>
            <div className="group relative block aspect-[4/1] overflow-hidden rounded-xl bg-muted">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-muted to-primary/10" />
            </div>
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
              <p className="font-semibold">Profile picture</p>
              <p className="text-muted-foreground">Click the image to upload a new one.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            {/* Utilitzem || '' perquè React no es queixi si el valor és undefined */}
            <Input
              id="name"
              value={draft.displayName || ''}
              onChange={(event) => set('displayName', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                @
              </span>
              <Input
                id="username"
                className="pl-7"
                value={draft.userName || ''}
                onChange={(event) => set('userName', event.target.value.replace(/\s/g, '').toLowerCase())}
              />
            </div>
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
            {/* Mateixa protecció aquí amb el .length */}
            <p className="text-right text-xs text-muted-foreground">{(draft.description || '').length}/160</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
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
