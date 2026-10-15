import { Link } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Searchbar } from './Searchbar';

export function Header() {
  return (
    <header className="bg-card sticky top-0 z-50 border-b w-full h-fit">
      <div className="flex max-w-7xl items-center justify-between gap-6 px-2 py-2">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Link to="#">
            <img src="https://images.shadcnspace.com/assets/logo/shadcnspace.svg" alt="logo" className="h-10" />
          </Link>
          <Separator orientation="vertical" />
          <Searchbar />
        </div>
      </div>
    </header>
  );
}
