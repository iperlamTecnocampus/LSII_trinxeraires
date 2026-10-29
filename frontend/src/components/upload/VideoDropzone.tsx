import {
  useRef,
  useState,
  type DragEvent,
} from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  CloudUploadIcon,
  Video01Icon,
} from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED =
  'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];

  let value = bytes / 1024;
  let index = 0;

  while (
    value >= 1024 &&
    index < units.length - 1
  ) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(1)} ${units[index]}`;
}

interface VideoDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function VideoDropzone({
  file,
  onFileChange,
}: VideoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const input = (
    <input
      ref={inputRef}
      id="video-file"
      type="file"
      accept={ACCEPTED}
      className="sr-only"
      onChange={(event) => {
        onFileChange(
          event.target.files?.[0] ?? null,
        );

        event.target.value = '';
      }}
    />
  );

  if (file) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
        {input}

        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon
            icon={Video01Icon}
            size={24}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {file.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {formatBytes(file.size)} · Selected
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openPicker}
          >
            Change
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
            aria-label="Remove selected video"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={16}
            />

            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Select a video file"
      onClick={openPicker}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          openPicker();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
        dragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:bg-muted/50',
      )}
    >
      {input}

      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HugeiconsIcon
          icon={CloudUploadIcon}
          size={32}
        />
      </div>

      <div>
        <p className="font-medium">
          Drag and drop your video file
        </p>

        <p className="text-sm text-muted-foreground">
          or click to browse
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        MP4, WebM or MOV
      </p>
    </div>
  );
}