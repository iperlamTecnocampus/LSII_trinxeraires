import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';

import { VideoDetailsForm } from '@/components/upload/VideoDetailsForm';
import { ThumbnailSelector } from '@/components/upload/ThumbnailSelector';
import { VisibilitySelector } from '@/components/upload/VisibilitySelector';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { getStudioVideo } from '@/data/studioVideos';
import { $api } from '@/lib/api';

export function EditVideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const video = videoId ? getStudioVideo(videoId) : undefined;

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = $api.useQuery('get', '/api/categories/');

  const categories = (categoryData ?? [])
    .map((item) => ({
      id: String(item.id ?? ''),
      name: item.name ?? '',
    }))
    .filter((item) => item.id && item.name);

  const [title, setTitle] = useState(video?.title ?? '');
  const [description, setDescription] = useState(video?.description ?? '');
  const [category, setCategory] = useState(video?.category ?? '');
  const [language, setLanguage] = useState(video?.language ?? 'English');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>(video?.visibility ?? 'public');

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!video) {
    return <Navigate to="/studio" replace />;
  }

  function handleSave() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setError(null);

    // Frontend only for now
    navigate('/studio');
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Edit video</h1>

        <p className="mt-1 text-sm text-muted-foreground">Update your video information</p>
      </header>

      <div className="flex flex-col gap-8">
        <Card>
          <CardContent className="pt-6">
            <VideoDetailsForm
              title={title}
              description={description}
              category={category}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError?.message ?? null}
              language={language}
              onTitleChange={(value) => {
                setTitle(value);
                setError(null);
              }}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
              onLanguageChange={setLanguage}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="font-semibold">Current thumbnail</h3>

              <p className="text-sm text-muted-foreground">Change the image displayed for this video.</p>
            </div>

            {!thumbnailFile && (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="mb-4 aspect-video w-full max-w-64 rounded-lg object-cover"
              />
            )}

            <ThumbnailSelector
              thumbnailFile={thumbnailFile}
              uploaded={false}
              onThumbnailChange={setThumbnailFile}
              onInvalidFile={setError}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <VisibilitySelector value={visibility} onChange={setVisibility} />
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/studio')}>
            Cancel
          </Button>

          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
