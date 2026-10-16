import { Link } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Searchbar } from './Searchbar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function AvatarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Avatar className="cursor-pointer" />}>
        <AvatarImage src="https://picsum.photos/256" alt="Yourself" />
        <AvatarFallback>US</AvatarFallback>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link to="/profile" />}> Your channel
          </DropdownMenuItem>
          <DropdownMenuItem 
          render={<Link to="/settings" />}> Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <header className="bg-card sticky top-0 z-50 border-b w-full h-fit">
      <div className="flex items-center justify-between gap-6 px-2 py-2">
        <div className="flex items-center gap-4 w-full">
          <SidebarTrigger />
          <Link to="#">
            <img
              src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Logo_of_YouTube_(2013-2015).svg/3840px-Logo_of_YouTube_(2013-2015).svg.png?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=thumbnail"
              alt="logo"
              className="h-10"
            />
          </Link>
          <Separator orientation="vertical" />
          <Searchbar />
          <div className="flex grow"></div>
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}
