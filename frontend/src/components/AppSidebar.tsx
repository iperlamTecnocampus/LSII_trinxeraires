import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronRightIcon, HomeIcon, ThumbsUpIcon, VideoReplayIcon } from '@hugeicons/core-free-icons';

import { useAuth } from '@/auth/useAuth';
import { $api } from '@/lib/api';
import { getImageUrl } from '@/lib/fileApi';

type IconSvgObject =
  | [
      string,
      {
        [key: string]: string | number;
      },
    ][]
  | readonly (readonly [
      string,
      {
        readonly [key: string]: string | number;
      },
    ])[];

function MenuItem({ path, icon, title }: { path: string; icon: IconSvgObject; title: string }) {
  const isActive = useLocation().pathname === path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} render={<Link to={path} />} className="h-12">
        <HugeiconsIcon icon={icon} strokeWidth={2} />
        {title}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function Subscription({ pictureFid, name, username }: { pictureFid?: string; username: string; name: string }) {
  const profilePicture = getImageUrl(pictureFid) || null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton render={<Link to={`/profile/${username}`} />} className="h-12">
        <div className="flex flex-row items-center gap-2">
          <Avatar>
            <AvatarImage src={profilePicture} alt={`@${username}`} />

            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <span>{name}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { user, isAuthenticated } = useAuth();

  const { data: profile, isLoading: subscriptionsLoading } = $api.useQuery(
    'get',
    '/api/users/{username}',
    {
      params: {
        path: {
          username: user?.userName ?? '',
        },
      },
    },
    {
      enabled: isAuthenticated && Boolean(user?.userName),
    }
  );

  const subscriptions = profile?.subscribedTo ?? [];

  return (
    <Sidebar>
      <SidebarHeader className="h-[57px] shrink-0" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <MenuItem key="home" path="/" icon={HomeIcon} title="Home" />

            {isAuthenticated && (
              <>
                <MenuItem key="liked_videos" path="/liked" icon={ThumbsUpIcon} title="Liked videos" />

                <MenuItem key="your_videos" path="/studio" icon={VideoReplayIcon} title="Your videos" />
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {isAuthenticated && (
          <>
            <div className="w-full px-4">
              <Separator />
            </div>

            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    Subscriptions
                    <HugeiconsIcon icon={ChevronRightIcon} strokeWidth={2} />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {subscriptionsLoading && (
                  <SidebarMenuItem>
                    <span className="px-2 text-sm text-muted-foreground">Loading subscriptions...</span>
                  </SidebarMenuItem>
                )}

                {!subscriptionsLoading && subscriptions.length === 0 && (
                  <SidebarMenuItem>
                    <span className="px-2 text-sm text-muted-foreground">No subscriptions yet</span>
                  </SidebarMenuItem>
                )}

                {subscriptions.map((subscription) => {
                  const username = subscription.userName;

                  if (!username) {
                    return null;
                  }

                  return (
                    <Subscription
                      key={username}
                      username={username}
                      name={subscription.displayName || username}
                      pictureFid={subscription.pictureFid}
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
