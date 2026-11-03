import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';
import { Link } from 'react-router';
import { $api } from '../lib/api';

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

  const { data, error, isLoading } = $api.useQuery(
    "get",
    "/api/categories/"
  );

  if (error) return `An error occured: ${error.message}`;

  if (isLoading) {
    return;
  }
  
  return (
    <div className="flex flex-row gap-2 w-full scroll-fade-e overflow-x-auto scrollbar-none">
      {data.map((category) => (
        <CategoryBadge url={"/category/" + category.id}>{category.name}</CategoryBadge>
      ))}
    </div>
  );
}
