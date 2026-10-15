import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '../components/VideoGrid';
import { CategoryList } from '../components/CategoryList'

export function Home() {
  return (
    <div className="flex flex-col">
      <CategoryList />
      <div className="h-5"></div>
      <VideoGrid />
    </div>
  );
}
