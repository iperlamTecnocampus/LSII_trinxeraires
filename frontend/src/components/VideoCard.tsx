import { Link } from 'react-router';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function VideoCard() {
  return (
    <Link
      className="w-full sm:w-[40%] lg:w-[30%] xl:w-[24%] flex flex-col gap-2 p-2 rounded-md hover:bg-accent transition-colors"
      to="/"
    >
      <AspectRatio ratio={16 / 9} className="w-full">
        <img className="rounded-md" src="https://picsum.photos/640/360" alt="Video thumbnail" loading="lazy" />
      </AspectRatio>
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src="https://picsum.photos/256" alt="@username" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3>Good video title without clickbait</h3>
          <div className="flex flex-row gap-2 col text-gray-600 dark:text-gray-300 text-sm">
            <span>Username</span>
            <span>5k</span>
            <span>12h ago</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
