import { getEnv } from '@/utils/Env';

export async function uploadFile(endpoint: 'videos' | 'images', file: File): Promise<string> {
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

export function getImageUrl(fid?: string | null): string | undefined {
  if (!fid) {
    return undefined;
  }

  return `${getEnv().FILE_API_BASE_URL}/images/${encodeURIComponent(fid)}`;
}
