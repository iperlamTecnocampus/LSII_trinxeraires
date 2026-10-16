import type { ProfileActivity } from './types';
import { formatDate } from './format';

interface ProfileActivityListProps {
  items: ProfileActivity[];
}

export function ProfileActivityList({
  items,
}: ProfileActivityListProps) {
  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No recent activity.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border bg-card p-4"
        >
          <p className="text-sm font-medium">
            {item.text}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(item.date)}
          </p>
        </div>
      ))}
    </div>
  );
}