import { 
  Users, 
  Video, 
  Film, 
  Settings, 
  LineChart, 
  Key,
  Command,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
  SidebarTrigger, // Import the trigger here
  useSidebar // Hook to check state
} from "@/components/ui/sidebar"
import { Link, useParams, useLocation } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const { orgid, userid } = useParams();
  const location = useLocation();
  const { state } = useSidebar(); // 'expanded' or 'collapsed'

  const checkActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      {/* HEADER: Branding + Toggle Button */}
      <SidebarHeader className="h-14 border-b border-border/40 flex flex-row items-center justify-between px-4">
        {state === "expanded" && (
            <Link to="/" className="flex items-center gap-2 transition-all">
                <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <Command className="size-4" />
                </div>
                <span className="font-bold text-sm tracking-tight">AdPixl</span>
            </Link>
        )}
        
        {/* THE TRIGGER IS NOW INSIDE THE SIDEBAR */}
        <SidebarTrigger className={state === "collapsed" ? "mx-auto" : "ml-auto"} />
      </SidebarHeader>

      <SidebarContent className="gap-0 pt-2">
        {/* SECTION 1: Platform */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Platform
          </SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {[
              { title: "Organizations", icon: Users, url: "/org" },
              { title: "Watch", icon: Video, url: "/watch" },
            ].map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={checkActive(item.url)} 
                  tooltip={item.title}
                  className="data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* SECTION 2: Organization Tools */}
        {orgid && userid && (
          <>
            <SidebarSeparator className="mx-4 my-2 opacity-30" />
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Workspace
              </SidebarGroupLabel>
              <SidebarMenu className="px-2">
                {[
                  { title: "Media Library", icon: Film, url: `/org/${orgid}/${userid}/media` },
                  { title: "Streams", icon: LineChart, url: `/org/${orgid}/${userid}/stream` },
                  { title: "API Keys", icon: Key, url: `/org/${orgid}/${userid}/api` },
                  { title: "Settings", icon: Settings, url: `/org/${orgid}/${userid}/settings` },
                ].map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={checkActive(item.url)}
                      tooltip={item.title}
                      className="data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* FOOTER: User Account */}
      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-muted/50 transition-colors rounded-lg">
              <Avatar className="h-8 w-8 rounded-md border border-border/50">
                <AvatarImage src={`https://avatar.vercel.sh/${userid}.png`} />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px]">US</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight ml-2">
                <span className="truncate font-semibold uppercase">{userid?.slice(0, 8)}</span>
                <span className="truncate text-muted-foreground opacity-70 font-mono">Operator</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}