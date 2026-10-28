import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { formatCount } from './format';
import type { Video } from './types';

interface VideoDescriptionProps {
  video: Video;
}

export function VideoDescription({
  video,
}: VideoDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-4 rounded-xl bg-muted p-4">
      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        <span>{formatCount(video.views)} views</span>
        <span>•</span>
        <span>{video.uploadedAt}</span>
      </div>

      <div
        className={`mt-2 whitespace-pre-line text-sm ${
          expanded ? '' : 'line-clamp-3'
        }`}
      >
        {video.description}
      </div>

      <Button
        type="button"
        variant="ghost"
        className="mt-2 h-auto p-0 font-semibold"
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Show less' : 'Show more'}
      </Button>
    </section>
  );
}