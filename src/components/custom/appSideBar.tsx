import { useMemo } from "react"; // Added for performance
import multiavatar from "@multiavatar/multiavatar/esm";
import {
    Users,
    Video,
    Film,
    Settings,
    LineChart,
    Key,
    Command,
    ChevronRight,
    Plus,
    ListVideo,
    Radio,
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    SidebarTrigger,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getLoggedUser } from "@/utils/jwtUtil";

/**
 * 1. CONFIGURATION DATA
 */
const getSidebarConfig = (orgid?: string, userid?: string) => {
    const base = `/org/${orgid}/${userid}`;
    return [
        {
            label: "Platform",
            items: [
                { title: "Organizations", icon: Users, url: "/org" },
                {
                    title: "Global Watch",
                    icon: Video,
                    url: "/watch",
                    isDisabled: true,
                },
            ],
        },
        {
            label: "Workspace",
            hidden: !orgid || !userid,
            items: [
                { title: "Media Library", icon: Film, url: `${base}/media` },
                {
                    title: "Streams",
                    icon: LineChart,
                    url: `${base}/stream`,
                    isDisabled: true,
                    subItems: [
                        {
                            title: "All Streams",
                            url: `${base}/stream`,
                            icon: ListVideo,
                        },
                        {
                            title: "Live Now",
                            url: `${base}/stream/live`,
                            icon: Radio,
                            isDisabled: true,
                        },
                        {
                            title: "Create New",
                            url: `${base}/stream/new`,
                            icon: Plus,
                        },
                    ],
                },
                { title: "API Keys", icon: Key, url: `${base}/api` },
                {
                    title: "Settings",
                    icon: Settings,
                    url: `${base}/settings`,
                    isDisabled: true,
                    subItems: [
                        { title: "Profile", url: `${base}/settings/profile` },
                        {
                            title: "Billing",
                            url: `${base}/settings/billing`,
                            isDisabled: true,
                        },
                    ],
                },
            ],
        },
    ];
};

/**
 * 2. MAIN COMPONENT
 */
export function AppSidebar() {
    const { orgid, userid } = useParams();
    const { pathname } = useLocation();
    const { state } = useSidebar();
    const user = getLoggedUser();


    const config = getSidebarConfig(orgid, userid);
    const isActive = (url: string) =>
        url === "/" ? pathname === "/" : pathname.startsWith(url);

    /**
     * MULTIAVATAR GENERATION LOGIC
     * We memoize this so it doesn't re-calculate on every small render.
     */
    const avatarDataUri = useMemo(() => {
        const seed = user?.id || "guest-operator";
        const svgCode = multiavatar(seed);
        // Convert SVG to Base64 so <AvatarImage /> can treat it as a standard source
        const base64 = btoa(unescape(encodeURIComponent(svgCode)));
        return `data:image/svg+xml;base64,${base64}`;
    }, [userid]);

    return (
        <Sidebar collapsible="icon" className="border-r border-border/40">
            {/* HEADER */}
            <SidebarHeader className="h-14 border-b border-border/40 flex flex-row items-center justify-between px-4">
                {state === "expanded" && (
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-bold text-sm tracking-tight transition-opacity"
                    >
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <Command className="size-4" />
                        </div>
                        <span>AdPixl</span>
                    </Link>
                )}
                <SidebarTrigger
                    className={cn(
                        state === "collapsed" ? "mx-auto" : "ml-auto",
                    )}
                />
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent className="py-2 scrollbar-none">
                {config.map(
                    (group, idx) =>
                        !group.hidden && (
                            <div key={group.label}>
                                {idx > 0 && (
                                    <SidebarSeparator className="mx-4 my-2 opacity-30" />
                                )}
                                <SidebarGroup>
                                    <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                        {group.label}
                                    </SidebarGroupLabel>
                                    <SidebarMenu className="px-2">
                                        {group.items.map((item) => (
                                            <SidebarItem
                                                key={item.title}
                                                item={item}
                                                isActive={isActive}
                                            />
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroup>
                            </div>
                        ),
                )}
            </SidebarContent>

            {/* FOOTER: Updated with Multiavatar */}
            <SidebarFooter className="border-t border-border/40 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-muted/50 rounded-lg transition-colors"
                        >
                            <Avatar className="h-8 w-8 rounded-md border border-border/50">
                                <AvatarImage src={avatarDataUri} />
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
                                    {userid?.slice(0, 2).toUpperCase() || "OP"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-xs leading-tight ml-2 font-sans">
                                <span className="truncate font-semibold uppercase">
                                    {user?.id || "Operator"}
                                </span>
                                <span className="truncate text-muted-foreground opacity-70 font-mono text-[10px]">
                                    Active Session
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

/**
 * 3. SUB-COMPONENT
 */
function SidebarItem({
    item,
    isActive,
}: {
    item: any;
    isActive: (url: string) => boolean;
}) {
    const active = isActive(item.url);

    if (item.subItems) {
        return (
            <Collapsible
                asChild
                defaultOpen={active}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild disabled={item.isDisabled}>
                        <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                                "hover:bg-muted/40 transition-all",
                                item.isDisabled &&
                                    "opacity-40 cursor-not-allowed",
                            )}
                        >
                            <item.icon className="size-4" />
                            <span className="font-medium text-sm">
                                {item.title}
                            </span>
                            {!item.isDisabled && (
                                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            )}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {!item.isDisabled && (
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.subItems.map((sub: any) => (
                                    <SidebarMenuSubItem key={sub.title}>
                                        <SidebarMenuSubButton
                                            asChild={!sub.isDisabled}
                                            isActive={isActive(sub.url)}
                                            className={cn(
                                                sub.isDisabled &&
                                                    "opacity-40 cursor-not-allowed pointer-events-none",
                                            )}
                                        >
                                            {sub.isDisabled ? (
                                                <div className="flex items-center gap-2">
                                                    {sub.icon && (
                                                        <sub.icon className="size-3.5" />
                                                    )}
                                                    <span className="text-xs">
                                                        {sub.title}
                                                    </span>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={sub.url}
                                                    className="flex items-center gap-2"
                                                >
                                                    {sub.icon && (
                                                        <sub.icon className="size-3.5" />
                                                    )}
                                                    <span className="text-xs">
                                                        {sub.title}
                                                    </span>
                                                </Link>
                                            )}
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    )}
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!item.isDisabled}
                isActive={!item.isDisabled && active}
                tooltip={item.title}
                className={cn(
                    "transition-colors data-[active=true]:bg-primary/5 data-[active=true]:text-primary",
                    item.isDisabled &&
                        "opacity-40 cursor-not-allowed hover:bg-transparent",
                )}
            >
                {item.isDisabled ? (
                    <div className="flex items-center gap-3">
                        <item.icon className="size-4" />
                        <span className="font-medium text-sm">
                            {item.title}
                        </span>
                    </div>
                ) : (
                    <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4" />
                        <span className="font-medium text-sm">
                            {item.title}
                        </span>
                    </Link>
                )}
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}