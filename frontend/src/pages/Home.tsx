import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '../components/VideoGrid';
import { CategoryList } from '../components/CategoryList';
import { $api } from '../lib/api';

export function Home() {
  const { data, error, isLoading } = $api.useQuery(
    "get",
    "/api/videos/"
  );

  if (error) return `An error occured: ${error.message}`;

  return (
    <div className="flex flex-col">
      <CategoryList />
      <div className="h-5"></div>
      {isLoading ? <div>Loading...</div> : <VideoGrid videos={data || []} />}
    </div>
  );
}
