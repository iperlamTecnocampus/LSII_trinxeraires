import { useRef, useState, type DragEvent } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, CloudUploadIcon, Video01Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED = 'video/mp4,.mp4';
const IMAGE_EXTENSION = /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|tiff?|webp)$/i;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];

  let value = bytes / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(1)} ${units[index]}`;
}

interface VideoDropzoneProps {
  file: File | null;
  thumbnailFile: File | null;
  videoUploading: boolean;
  thumbnailUploading: boolean;
  onFileChange: (file: File | null) => void;
  onThumbnailChange: (file: File) => void;
  onInvalidFile: (message: string) => void;
}

export function VideoDropzone({
  file,
  thumbnailFile,
  videoUploading,
  thumbnailUploading,
  onFileChange,
  onThumbnailChange,
  onInvalidFile,
}: VideoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    Array.from(event.dataTransfer.files ?? []).forEach((droppedFile) => {
      const name = droppedFile.name.toLowerCase();

      if (droppedFile.type === 'video/mp4' || name.endsWith('.mp4')) {
        onFileChange(droppedFile);
      } else if (
        droppedFile.type.startsWith('image/') ||
        !droppedFile.type ||
        (droppedFile.type === 'application/octet-stream' && IMAGE_EXTENSION.test(name))
      ) {
        onThumbnailChange(droppedFile);
      } else {
        onInvalidFile(`${droppedFile.name} is not supported. Drop an MP4 video or an image thumbnail.`);
      }
    });
  };

  const input = (
    <input
      ref={inputRef}
      id="video-file"
      type="file"
      accept={ACCEPTED}
      className="sr-only"
      onChange={(event) => {
        onFileChange(event.target.files?.[0] ?? null);

        event.target.value = '';
      }}
    />
  );

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col gap-4 rounded-xl border-2 border-dashed p-4 transition-colors',
        dragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
      )}
    >
      {input}

      {file ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={Video01Icon} size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(file.size)} · {videoUploading ? 'Uploading' : 'Selected'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={openPicker}>
              Change
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(null)}
              aria-label="Remove selected video"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 px-2 py-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HugeiconsIcon icon={CloudUploadIcon} size={32} />
          </div>
          <div>
            <p className="font-medium">Drop your MP4 video and image thumbnail here</p>
            <p className="text-sm text-muted-foreground">or click to browse for a video</p>
          </div>
          <p className="text-xs text-muted-foreground">MP4 video · Any image format for the thumbnail</p>
        </button>
      )}

      {thumbnailFile && (
        <div className="flex items-center gap-3 border-t pt-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={CloudUploadIcon} size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{thumbnailFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(thumbnailFile.size)} · {thumbnailUploading ? 'Uploading' : 'Selected'}
            </p>
          </div>
        </div>
      )}

      {(videoUploading || thumbnailUploading) && (
        <div className="flex items-center gap-2 text-sm font-medium text-primary" role="status" aria-live="polite">
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          Uploading
          {videoUploading && thumbnailUploading ? ' video and thumbnail' : videoUploading ? ' video' : ' thumbnail'}…
        </div>
      )}
    </div>
  );
}
