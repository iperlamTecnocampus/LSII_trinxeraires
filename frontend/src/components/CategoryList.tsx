import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';
import { Link } from 'react-router';

function CategoryBadge({ children, url }: { children: ReactNode; url: string }) {
  return (
    <Link to={url}>
      <Badge variant="secondary" className="p-4">
        {children}
      </Badge>
    </Link>
  );
}

export function CategoryList() {
  return (
    <div className="flex flex-row gap-2 w-full scroll-fade-e overflow-x-auto scrollbar-none">
      {Array.from({ length: 20 }, (_, i) => (
        <CategoryBadge url="/category">Category</CategoryBadge>
      ))}
    </div>
  );
}
