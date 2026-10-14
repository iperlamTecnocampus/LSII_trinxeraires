import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

import { HugeiconsIcon } from "@hugeicons/react"
import { HomeIcon, UserGroupIcon, ThumbsUpIcon, VideoReplayIcon } from "@hugeicons/core-free-icons"

type IconSvgObject = ([string, {
    [key: string]: string | number;
}])[] | readonly (readonly [string, {
    readonly [key: string]: string | number;
}])[];

function MenuItem({ path, icon, title, key }: { key: string; path: string; icon: IconSvgObject; title: string }) {
  const isActive = useLocation().pathname === path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={<Link to={path} />}
        className="h-12"
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} /> {title}
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
            <MenuItem key="subscriptions" path="/subscriptions" icon={UserGroupIcon} title="Subscription" />
            <MenuItem key="liked_videos" path="/liked" icon={ThumbsUpIcon} title="Liked videos" />
            <MenuItem key="your_videos" path="/studio" icon={VideoReplayIcon} title="Your videos" />

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}