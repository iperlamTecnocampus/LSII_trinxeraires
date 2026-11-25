import { fireEvent, render, screen } from '@testing-library/react';

import { ShareVideoDialog } from './ShareVideoDialog';

describe('ShareVideoDialog', () => {
  const videoUrl = 'https://example.com/watch/video-123';

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  it('opens from the Share button and displays the video URL', () => {
    render(<ShareVideoDialog videoUrl={videoUrl} />);

    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Video link' })).toHaveValue(videoUrl);
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass('bg-black/80');
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass(
      'supports-backdrop-filter:backdrop-blur-none'
    );
    expect(document.querySelector('[data-slot="dialog-overlay"]')).not.toHaveClass(
      'supports-backdrop-filter:backdrop-blur-xs'
    );
    expect(document.querySelector('[data-slot="dialog-content"]')).toHaveClass('data-open:animate-in');
  });

  it('copies the complete video URL and confirms success', async () => {
    render(<ShareVideoDialog videoUrl={videoUrl} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(videoUrl);
    expect(screen.getByRole('status')).toHaveTextContent('Link copied to clipboard.');
  });

  it('shows an error if the clipboard write fails', async () => {
    jest.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Clipboard unavailable'));
    render(<ShareVideoDialog videoUrl={videoUrl} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not copy the link. Please try again.');
  });
});
