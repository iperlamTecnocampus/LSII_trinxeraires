import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ShareVideoDialogProps {
  videoUrl: string;
}

export function ShareVideoDialog({ videoUrl }: ShareVideoDialogProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function handleCopy() {
    setCopied(false);
    setCopyError(null);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is not available in this browser.');
      }

      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
    } catch {
      setCopyError('Could not copy the link. Please try again.');
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setCopied(false);
          setCopyError(null);
        }
      }}
    >
      <DialogTrigger render={<Button type="button" variant="secondary" className="rounded-full" />}>
        Share
      </DialogTrigger>

      <DialogContent overlayClassName="supports-backdrop-filter:backdrop-blur-none">
        <DialogHeader>
          <DialogTitle>Share video</DialogTitle>
          <DialogDescription>Copy this link to share the video.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input aria-label="Video link" readOnly value={videoUrl} className="min-w-0 flex-1" />
          <Button type="button" onClick={() => void handleCopy()} className="shrink-0">
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
        </div>

        {copied && (
          <p className="text-sm text-muted-foreground" role="status">
            Link copied to clipboard.
          </p>
        )}
        {copyError && (
          <p className="text-sm text-destructive" role="alert">
            {copyError}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
