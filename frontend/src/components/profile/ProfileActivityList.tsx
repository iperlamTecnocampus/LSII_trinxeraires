import { formatDate } from './format';

// Re-definim el tipus d'activitat temporalment fins que existeixi al backend
export interface ProfileActivity {
  id: string;
  text: string;
  date: string;
}

interface ProfileActivityListProps {
  items: ProfileActivity[];
}

export function ProfileActivityList({ items }: ProfileActivityListProps) {
  // Si items és undefined, ho fallbackejem a array buit
  const safeItems = items || [];

  if (safeItems.length === 0) {
    return <p className="py-16 text-center text-muted-foreground">No recent activity.</p>;
  }

  return (
    <div className="space-y-4">
      {safeItems.map((item) => (
        <div key={item.id} className="rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">{item.text}</p>

          <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.date)}</p>
        </div>
      ))}
    </div>
  );
}
