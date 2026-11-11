import { useEffect, useRef, useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, ImageUploadIcon, Tick02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';

interface ThumbnailSelectorProps {
  thumbnailFile: File | null;
  uploaded: boolean;
  onThumbnailChange: (thumbnail: File | null) => void;
  onInvalidFile: (message: string) => void;
}

export function ThumbnailSelector({
  thumbnailFile,
  uploaded,
  onThumbnailChange,
  onInvalidFile,
}: ThumbnailSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!thumbnailFile) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(thumbnailFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (file.type && !file.type.startsWith('image/') && file.type !== 'application/octet-stream') {
      onInvalidFile('Thumbnail must be an image.');
      return;
    }

    onThumbnailChange(file);
  };

  return (
    <section>
      <div className="mb-3">
        <h3 className="font-semibold">Thumbnail</h3>
        <p className="text-sm text-muted-foreground">
          Upload an image in any format or drop one in the video dropzone.
        </p>
      </div>

      {thumbnailFile && previewUrl ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <img
            src={previewUrl}
            alt="Selected video thumbnail"
            className="aspect-video w-full rounded-lg object-cover sm:w-64"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="truncate text-sm font-medium">{thumbnailFile.name}</p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <HugeiconsIcon icon={uploaded ? Tick02Icon : ImageUploadIcon} size={16} />
              {uploaded ? 'Uploaded' : 'Selected'}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                <HugeiconsIcon icon={ImageUploadIcon} size={18} />
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onThumbnailChange(null)}
                aria-label="Remove selected thumbnail"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <HugeiconsIcon icon={ImageUploadIcon} size={18} />
          Upload thumbnail
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
    </section>
  );
}
