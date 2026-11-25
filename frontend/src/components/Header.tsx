import { Link, useNavigate } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logout01Icon } from '@hugeicons/core-free-icons';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Searchbar } from './Searchbar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/auth/useAuth';
import { getImageUrl } from '@/lib/fileApi';
import type { CurrentUser } from '@/lib/api';

function AvatarMenu({ user }: { user: CurrentUser }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const avatarSrc = getImageUrl(user.pictureFid) || null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full p-0">
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatarSrc} alt={user.displayName || user.userName || 'Your profile'} />
          <AvatarFallback>{(user.displayName || user.userName || 'You').slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to="/profile" />}>Your channel</DropdownMenuItem>

          <DropdownMenuItem render={<Link to="/settings" />}>Settings</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            void logout()
              .then(() => navigate('/'))
              .catch((error: unknown) => console.error('Failed to log out:', error));
          }}
        >
          <HugeiconsIcon icon={Logout01Icon} size={18} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-card sticky top-0 z-50 border-b w-full h-fit">
      <div className="flex items-center justify-between gap-6 px-2 py-2">
        <div className="flex items-center gap-4 w-full">
          <SidebarTrigger />

          <Link to="/">
            <img
              src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Logo_of_YouTube_(2013-2015).svg/3840px-Logo_of_YouTube_(2013-2015).svg.png?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=thumbnail"
              alt="logo"
              className="h-10"
            />
          </Link>

          <Separator orientation="vertical" />

          <Searchbar />

          <div className="flex grow"></div>

          {isLoading ? (
            <Button type="button" variant="outline" disabled>
              Checking session…
            </Button>
          ) : user ? (
            <AvatarMenu user={user} />
          ) : (
            <Button type="button" variant="outline" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
