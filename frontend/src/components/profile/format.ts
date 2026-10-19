export function formatCount(n: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(iso: string, now = new Date('2026-10-15')): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86400000);

  if (days < 1) return 'today';

  if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (days < 30) {
    return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
  }

  const months = Math.floor(days / 30);

  return `${months} month${months > 1 ? 's' : ''} ago`;
}
