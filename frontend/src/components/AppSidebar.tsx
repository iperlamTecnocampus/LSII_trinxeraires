import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import { HomeIcon, UserGroupIcon, ThumbsUpIcon, VideoReplayIcon, ChevronRightIcon } from '@hugeicons/core-free-icons';

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

function MenuItem({ path, icon, title, key }: { key: string; path: string; icon: IconSvgObject; title: string }) {
  const isActive = useLocation().pathname === path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} render={<Link to={path} />} className="h-12">
        <HugeiconsIcon icon={icon} strokeWidth={2} /> {title}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function Subscription({ profilePicture, name, username }: { profilePicture: string; username: string, name: string }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton render={<Link to={"user/" + username}/>} className="h-12">
        <div className="flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage src={profilePicture} alt={"@" + username} />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-[57px] shrink-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <MenuItem key="home" path="/" icon={HomeIcon} title="Home" />
            <MenuItem key="liked_videos" path="/liked" icon={ThumbsUpIcon} title="Liked videos" />
            <MenuItem key="your_videos" path="/studio" icon={VideoReplayIcon} title="Your videos" />
          </SidebarMenu>
        </SidebarGroup>
        <div className="w-full px-4">
          <Separator />
        </div>
        <SidebarGroup>
          <SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="subscriptions"/>}>
                Subscriptions <HugeiconsIcon icon={ChevronRightIcon} strokeWidth={2}></HugeiconsIcon>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Subscription profilePicture='https://picsum.photos/256' name="Channel name" username="channelname"/>
            <Subscription profilePicture='https://picsum.photos/256' name="Channel name" username="channelname"/>
            <Subscription profilePicture='https://picsum.photos/256' name="Channel name" username="channelname"/>
            <Subscription profilePicture='https://picsum.photos/256' name="Channel name" username="channelname"/>
            <Subscription profilePicture='https://picsum.photos/256' name="Channel name" username="channelname"/>
            
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
