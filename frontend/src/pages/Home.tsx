import { ReactNode, useState } from 'react';
import { Button } from "@/components/ui/button"
import { VideoGrid } from '../components/VideoGrid';

export function Home() {
  return (
    <div className='flex flex-col'>
        <VideoGrid />
    </div>
  );
}
