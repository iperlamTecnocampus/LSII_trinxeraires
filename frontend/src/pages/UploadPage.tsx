import { useRef, useState } from 'react';

import { ThumbnailSelector } from '@/components/upload/ThumbnailSelector';
import { VideoDetailsForm } from '@/components/upload/VideoDetailsForm';
import { VideoDropzone } from '@/components/upload/VideoDropzone';
import { VisibilitySelector } from '@/components/upload/VisibilitySelector';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEnv } from '@/utils/Env';

async function uploadFile(endpoint: 'videos' | 'thumbnails', file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getEnv().FILE_API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = `Upload failed (${response.status})`;
    try {
      const error = (await response.json()) as { detail?: string };
      if (error.detail) {
        message = error.detail;
      }
    } catch {
      // Keep the status-based message when the server doesn't return JSON.
    }
    throw new Error(message);
  }

  const result = (await response.json()) as { fid?: string };
  if (!result.fid) {
    throw new Error('The upload server did not return a file ID.');
  }

  return result.fid;
}

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [videoFid, setVideoFid] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailFid, setThumbnailFid] = useState<string | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const videoRequestId = useRef(0);
  const thumbnailRequestId = useRef(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [language, setLanguage] = useState('English');
  const [tags, setTags] = useState('');

  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');

  const [publishReady, setPublishReady] = useState(false);

  const canPublish =
    videoFid !== null && thumbnailFid !== null && !videoUploading && !thumbnailUploading && title.trim().length > 0;

  async function handleVideoChange(newFile: File | null) {
    const requestId = ++videoRequestId.current;
    setFile(newFile);
    setVideoFid(null);
    setVideoUploading(newFile !== null);
    setPublishReady(false);
    setUploadError(null);

    if (!newFile) {
      return;
    }

    try {
      const fid = await uploadFile('videos', newFile);
      if (requestId === videoRequestId.current) {
        setVideoFid(fid);
      }
    } catch (error) {
      if (requestId === videoRequestId.current) {
        setUploadError(`Video upload failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
      }
    } finally {
      if (requestId === videoRequestId.current) {
        setVideoUploading(false);
      }
    }
  }

  async function handleThumbnailChange(newFile: File | null) {
    const requestId = ++thumbnailRequestId.current;
    setThumbnailFile(newFile);
    setThumbnailFid(null);
    setThumbnailUploading(newFile !== null);
    setPublishReady(false);
    setUploadError(null);

    if (!newFile) {
      return;
    }

    try {
      const fid = await uploadFile('thumbnails', newFile);
      if (requestId === thumbnailRequestId.current) {
        setThumbnailFid(fid);
      }
    } catch (error) {
      if (requestId === thumbnailRequestId.current) {
        setUploadError(`Thumbnail upload failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
      }
    } finally {
      if (requestId === thumbnailRequestId.current) {
        setThumbnailUploading(false);
      }
    }
  }

  function handlePublish() {
    if (!canPublish) {
      return;
    }

    setPublishReady(true);
  }

  function handleCancel() {
    videoRequestId.current++;
    thumbnailRequestId.current++;
    setFile(null);
    setVideoFid(null);
    setVideoUploading(false);
    setThumbnailFile(null);
    setThumbnailFid(null);
    setThumbnailUploading(false);
    setUploadError(null);
    setTitle('');
    setDescription('');
    setCategory('Technology');
    setLanguage('English');
    setTags('');
    setVisibility('public');
    setPublishReady(false);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Upload video</h1>

        <p className="mt-1 text-sm text-muted-foreground">Add a new video to your channel</p>
      </header>

      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Video file</CardTitle>
          </CardHeader>

          <CardContent>
            <VideoDropzone
              file={file}
              thumbnailFile={thumbnailFile}
              videoUploading={videoUploading}
              thumbnailUploading={thumbnailUploading}
              onFileChange={handleVideoChange}
              onThumbnailChange={(newFile) => void handleThumbnailChange(newFile)}
              onInvalidFile={setUploadError}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
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
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
              onLanguageChange={setLanguage}
              onTagsChange={setTags}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ThumbnailSelector
              thumbnailFile={thumbnailFile}
              uploaded={thumbnailFid !== null}
              onThumbnailChange={handleThumbnailChange}
              onInvalidFile={setUploadError}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <VisibilitySelector value={visibility} onChange={setVisibility} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Video</span>

                <span className="max-w-[60%] truncate text-right">{file?.name ?? 'No video selected'}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Thumbnail</span>
                <span className="max-w-[60%] truncate text-right">
                  {thumbnailFile?.name ?? 'No thumbnail selected'}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Title</span>

                <span className="max-w-[60%] truncate text-right">{title || 'No title'}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Visibility</span>

                <span className="capitalize">{visibility}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {uploadError && (
          <Alert variant="destructive">
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {publishReady && (
          <Alert>
            <AlertTitle>Video ready to publish</AlertTitle>
            <AlertDescription>Your video and thumbnail have been uploaded and are ready to submit.</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" disabled={!canPublish} onClick={handlePublish}>
            Submit video
          </Button>
        </div>
      </div>
    </div>
  );
}
