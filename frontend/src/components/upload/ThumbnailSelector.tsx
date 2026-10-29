import { useRef } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ImageUploadIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThumbnailSelectorProps {
  selectedThumbnail: string;
  onThumbnailChange: (thumbnail: string) => void;
}

const mockThumbnails = [
  'https://picsum.photos/seed/upload-thumb-1/640/360',
  'https://picsum.photos/seed/upload-thumb-2/640/360',
  'https://picsum.photos/seed/upload-thumb-3/640/360',
];

export function ThumbnailSelector({
  selectedThumbnail,
  onThumbnailChange,
}: ThumbnailSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section>
      <div className="mb-3">
        <h3 className="font-semibold">Thumbnail</h3>

        <p className="text-sm text-muted-foreground">
          Select a thumbnail for your video
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {mockThumbnails.map((thumbnail) => {
          const selected =
            selectedThumbnail === thumbnail;

          return (
            <button
              key={thumbnail}
              type="button"
              onClick={() =>
                onThumbnailChange(thumbnail)
              }
              className={cn(
                'relative overflow-hidden rounded-lg border-2 transition-colors',
                selected
                  ? 'border-primary'
                  : 'border-transparent hover:border-border',
              )}
            >
              <div className="aspect-video">
                <img
                  src={thumbnail}
                  alt="Video thumbnail option"
                  className="h-full w-full object-cover"
                />
              </div>

              {selected && (
                <div className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={16}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (!file) {
              return;
            }

            const localUrl =
              URL.createObjectURL(file);

            onThumbnailChange(localUrl);

            event.target.value = '';
          }}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <HugeiconsIcon
            icon={ImageUploadIcon}
            size={18}
          />

          Upload thumbnail
        </Button>
      </div>
    </section>
  );
}