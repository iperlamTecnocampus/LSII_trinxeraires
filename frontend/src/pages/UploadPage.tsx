import { useState } from 'react';

import { AudienceSelector } from '@/components/upload/AudienceSelector';
import { ThumbnailSelector } from '@/components/upload/ThumbnailSelector';
import { VideoDetailsForm } from '@/components/upload/VideoDetailsForm';
import { VideoDropzone } from '@/components/upload/VideoDropzone';
import { VisibilitySelector } from '@/components/upload/VisibilitySelector';
import { Button } from '@/components/ui/button';

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [selectedThumbnail, setSelectedThumbnail] =
    useState('');

  const [audience, setAudience] =
    useState<'yes' | 'no'>('no');

  const [category, setCategory] =
    useState('Technology');

  const [language, setLanguage] =
    useState('English');

  const [tags, setTags] = useState('');

  const [visibility, setVisibility] =
    useState<'public' | 'unlisted' | 'private'>(
      'public',
    );

  const [publishReady, setPublishReady] =
    useState(false);

  const canPublish =
    file !== null && title.trim().length > 0;

  function handlePublish() {
    if (!canPublish) {
      return;
    }

    setPublishReady(true);
  }

  function handleCancel() {
    setFile(null);
    setTitle('');
    setDescription('');
    setSelectedThumbnail('');
    setAudience('no');
    setCategory('Technology');
    setLanguage('English');
    setTags('');
    setVisibility('public');
    setPublishReady(false);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">
          Upload video
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a new video to your channel
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Video file
          </h2>

          <VideoDropzone
            file={file}
            onFileChange={(newFile) => {
              setFile(newFile);
              setPublishReady(false);
            }}
          />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <VideoDetailsForm
            title={title}
            description={description}
            category={category}
            language={language}
            tags={tags}
            onTitleChange={(value) => {
              setTitle(value);
              setPublishReady(false);
            }}
            onDescriptionChange={
              setDescription
            }
            onCategoryChange={setCategory}
            onLanguageChange={setLanguage}
            onTagsChange={setTags}
          />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <ThumbnailSelector
            selectedThumbnail={
              selectedThumbnail
            }
            onThumbnailChange={
              setSelectedThumbnail
            }
          />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <AudienceSelector
            value={audience}
            onChange={setAudience}
          />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <VisibilitySelector
            value={visibility}
            onChange={setVisibility}
          />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold">
            Upload summary
          </h2>

          <div className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Video
              </span>

              <span className="max-w-[60%] truncate text-right">
                {file?.name ?? 'No video selected'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Title
              </span>

              <span className="max-w-[60%] truncate text-right">
                {title || 'No title'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Visibility
              </span>

              <span className="capitalize">
                {visibility}
              </span>
            </div>
          </div>
        </section>

        {publishReady && (
          <div
            role="status"
            className="rounded-lg border bg-muted p-4 text-sm"
          >
            Video ready to publish.
            Backend upload will be connected
            later.
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!canPublish}
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}