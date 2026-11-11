import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Analytics01Icon,
  Comment01Icon,
  Delete02Icon,
  MoreVerticalIcon,
  PencilEdit01Icon,
  PlayIcon,
  Search01Icon,
  ThumbsUpIcon,
  Upload04Icon,
  Video01Icon,
  VideoOffIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type VideoVisibility = 'public' | 'unlisted' | 'private';
type VideoStatus = 'published' | 'processing' | 'draft';

interface StudioVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  uploadedAt: string;
  visibility: VideoVisibility;
  status: VideoStatus;
  views: number;
  likes: number;
  comments: number;
}

const mockVideos: StudioVideo[] = [
  {
    id: '1',
    title: 'Building a React App from Scratch',
    description: 'Full walkthrough from setup to deploy.',
    thumbnail: 'https://picsum.photos/seed/protube-react/320/180',
    uploadedAt: '2026-10-28',
    visibility: 'public',
    status: 'published',
    views: 24800,
    likes: 1800,
    comments: 243,
  },
  {
    id: '2',
    title: 'TypeScript Tutorial for Beginners',
    description: 'Types, interfaces and generics explained.',
    thumbnail: 'https://picsum.photos/seed/protube-ts/320/180',
    uploadedAt: '2026-10-14',
    visibility: 'public',
    status: 'published',
    views: 18200,
    likes: 1200,
    comments: 126,
  },
  {
    id: '3',
    title: 'My Development Setup',
    description: 'Editor, terminal and tools I use daily.',
    thumbnail: 'https://picsum.photos/seed/protube-setup/320/180',
    uploadedAt: '2026-09-30',
    visibility: 'unlisted',
    status: 'published',
    views: 3400,
    likes: 284,
    comments: 32,
  },
  {
    id: '4',
    title: 'New Project Preview',
    description: 'Sneak peek of what is coming next.',
    thumbnail: 'https://picsum.photos/seed/protube-preview/320/180',
    uploadedAt: '2026-11-09',
    visibility: 'private',
    status: 'draft',
    views: 0,
    likes: 0,
    comments: 0,
  },
];

const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatNumber(value: number) {
  return compactNumber.format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function VideoStudioPage() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState<StudioVideo[]>(mockVideos);
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<'all' | VideoVisibility>('all');
  const [status, setStatus] = useState<'all' | VideoStatus>('all');
  const [videoToDelete, setVideoToDelete] = useState<StudioVideo | null>(null);

  const filteredVideos = useMemo(() => {
    const search = query.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesSearch =
        !search || video.title.toLowerCase().includes(search) || video.description.toLowerCase().includes(search);

      const matchesVisibility = visibility === 'all' || video.visibility === visibility;

      const matchesStatus = status === 'all' || video.status === status;

      return matchesSearch && matchesVisibility && matchesStatus;
    });
  }, [videos, query, visibility, status]);

  const totals = useMemo(
    () => ({
      videos: videos.length,
      views: videos.reduce((total, video) => total + video.views, 0),
      likes: videos.reduce((total, video) => total + video.likes, 0),
      comments: videos.reduce((total, video) => total + video.comments, 0),
    }),
    [videos]
  );

  const stats = [
    {
      label: 'Videos',
      value: totals.videos.toString(),
      icon: Video01Icon,
    },
    {
      label: 'Views',
      value: formatNumber(totals.views),
      icon: ViewIcon,
    },
    {
      label: 'Likes',
      value: formatNumber(totals.likes),
      icon: ThumbsUpIcon,
    },
    {
      label: 'Comments',
      value: formatNumber(totals.comments),
      icon: Comment01Icon,
    },
  ];

  function renderActions(video: StudioVideo) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Actions for ${video.title}`} />}>
          <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/watch/${video.id}`)}>
            <HugeiconsIcon icon={PlayIcon} size={16} />
            View video
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => console.log('Edit video', video.id)}>
            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
            Edit details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => console.log('Analytics', video.id)}>
            <HugeiconsIcon icon={Analytics01Icon} size={16} />
            View analytics
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={() => setVideoToDelete(video)}>
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Delete video
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Video Studio</h1>

          <p className="text-sm text-muted-foreground">Manage your videos and track their performance</p>
        </div>

        <Button onClick={() => navigate('/upload')}>
          <HugeiconsIcon icon={Upload04Icon} size={18} />
          Upload video
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-md bg-muted p-2 text-muted-foreground">
                <HugeiconsIcon icon={stat.icon} size={20} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>

                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your videos</h2>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              value={query}
              placeholder="Search your videos"
              className="pl-9"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <Select
            value={visibility}
            onValueChange={(value) => {
              if (value) {
                setVisibility(value as typeof visibility);
              }
            }}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              if (value) {
                setStatus(value as typeof status);
              }
            }}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredVideos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <HugeiconsIcon icon={VideoOffIcon} size={32} className="text-muted-foreground" />

              <p className="font-medium">No videos found</p>

              <p className="text-sm text-muted-foreground">Try changing your search or filters.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="aspect-video w-28 shrink-0 rounded-md bg-muted object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-medium">{video.title}</p>

                          <p className="truncate text-xs text-muted-foreground">{video.description}</p>

                          <p className="text-xs text-muted-foreground">{formatDate(video.uploadedAt)}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          video.visibility === 'public'
                            ? 'default'
                            : video.visibility === 'unlisted'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {capitalize(video.visibility)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={video.status === 'published' ? 'secondary' : 'outline'}>
                        {capitalize(video.status)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">{formatNumber(video.views)}</TableCell>

                    <TableCell className="text-right">{formatNumber(video.likes)}</TableCell>

                    <TableCell className="text-right">{formatNumber(video.comments)}</TableCell>

                    <TableCell>{renderActions(video)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>

      <Dialog
        open={videoToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setVideoToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete video</DialogTitle>

            <DialogDescription>Are you sure you want to remove this video from the current list?</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVideoToDelete(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (!videoToDelete) {
                  return;
                }

                setVideos((currentVideos) => currentVideos.filter((video) => video.id !== videoToDelete.id));

                setVideoToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
