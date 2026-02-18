import { useMemo } from "react";
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
    Megaphone,
    Lock,
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

type ItemStatus = "new" | "upcoming" | "deprecated";

function StatusBadge({ status }: { status?: ItemStatus }) {
    if (!status) return null;

    const variants: Record<ItemStatus, string> = {
        new: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
        upcoming: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
        deprecated: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "ml-auto h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shrink-0",
                variants[status]
            )}
        >
            {status}
        </Badge>
    );
}

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
                    status: "upcoming" as ItemStatus,
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
                    icon: Video,
                    url: `${base}/stream`,
                    status: "upcoming" as ItemStatus,
                    isDisabled: true,
                },
                {
                    title: "Ad Engine",
                    icon: Megaphone,
                    url: `${base}/tag`,
                    status: "upcoming" as ItemStatus,
                    isDisabled: true,
                },
                {
                    title: "Analytics",
                    icon: LineChart,
                    url: `${base}/analytics`,
                    isDisabled: true,
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
                            status: "upcoming" as ItemStatus,
                        },
                    ],
                },
            ],
        },
    ];
};

export function AppSidebar() {
    const { orgid, userid } = useParams();
    const { pathname } = useLocation();
    const { state } = useSidebar();
    const user = getLoggedUser();

    const config = getSidebarConfig(orgid, userid);
    const isActive = (url: string) =>
        url === "/" ? pathname === "/" : pathname.startsWith(url);

    const avatarDataUri = useMemo(() => {
        const seed = user?.id || "guest-operator";
        const svgCode = multiavatar(seed);
        const base64 = btoa(unescape(encodeURIComponent(svgCode)));
        return `data:image/svg+xml;base64,${base64}`;
    }, [user?.id]);

    return (
        <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
            <SidebarHeader className="h-14 border-b border-border flex flex-row items-center justify-between px-4">
                {state === "expanded" && (
                    <Link to="/" className="flex items-center gap-2 font-bold text-sm tracking-tight text-sidebar-foreground">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <Command className="size-4" />
                        </div>
                        <span>AdPixl</span>
                    </Link>
                )}
                <SidebarTrigger className={cn("text-sidebar-foreground/70", state === "collapsed" ? "mx-auto" : "ml-auto")} />
            </SidebarHeader>

            <SidebarContent className="py-2 scrollbar-none bg-sidebar">
                {config.map((group, idx) => !group.hidden && (
                    <div key={group.label}>
                        {idx > 0 && <SidebarSeparator className="mx-4 my-2 opacity-50" />}
                        <SidebarGroup>
                            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarMenu className="px-2">
                                {group.items.map((item) => (
                                    <SidebarItem key={item.title} item={item} isActive={isActive} />
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    </div>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-2 bg-sidebar">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent transition-colors text-sidebar-foreground">
                            <Avatar className="h-8 w-8 rounded-md border border-border">
                                <AvatarImage src={avatarDataUri} />
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                    {user?.id?.slice(0, 2).toUpperCase() || "OP"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-xs leading-tight ml-2 font-sans">
                                <span className="truncate font-semibold uppercase">{user?.id || "Operator"}</span>
                                <span className="truncate text-sidebar-foreground/50 font-mono text-[10px]">Active Session</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

function SidebarItem({ item, isActive }: { item: any; isActive: (url: string) => boolean }) {
    const active = isActive(item.url);
    const { state } = useSidebar();
    const isExpanded = state === "expanded";

    const disabledBaseStyles =
        "select-none pointer-events-none cursor-not-allowed bg-muted/20 border-transparent";

    const interactiveStyles =
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary";

    if (item.subItems) {
        return (
            <Collapsible asChild defaultOpen={active} className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild disabled={item.isDisabled}>
                        <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                                "transition-all duration-200",
                                item.isDisabled ? disabledBaseStyles : interactiveStyles
                            )}
                        >
                            <div className={cn("flex items-center gap-3 min-w-0", item.isDisabled && "opacity-50 grayscale")}>
                                <item.icon className="size-4 shrink-0" />
                                <span className="font-medium text-sm truncate">{item.title}</span>
                            </div>

                            {isExpanded && (
                                <div className="ml-auto flex items-center gap-1.5">
                                    <StatusBadge status={item.status} />
                                    {!item.isDisabled && (
                                        <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    )}
                                </div>
                            )}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {!item.isDisabled && (
                        <CollapsibleContent>
                            <SidebarMenuSub className="border-sidebar-border">
                                {item.subItems.map((sub: any) => (
                                    <SidebarMenuSubItem key={sub.title}>
                                        <SidebarMenuSubButton
                                            asChild={!sub.isDisabled}
                                            isActive={isActive(sub.url)}
                                            className={cn(
                                                "transition-all duration-200",
                                                sub.isDisabled
                                                    ? disabledBaseStyles
                                                    : "hover:text-sidebar-foreground"
                                            )}
                                        >
                                            {sub.isDisabled ? (
                                                <div className="flex items-center w-full justify-between gap-2">
                                                    <span className="text-xs truncate opacity-50 grayscale">
                                                        {sub.title}
                                                    </span>
                                                    {isExpanded && <StatusBadge status={sub.status} />}
                                                </div>
                                            ) : (
                                                <Link to={sub.url} className="flex items-center w-full justify-between gap-2">
                                                    <span className="text-xs truncate">{sub.title}</span>
                                                    {isExpanded && <StatusBadge status={sub.status} />}
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
                    "transition-all duration-200",
                    item.isDisabled ? disabledBaseStyles : interactiveStyles
                )}
            >
                {item.isDisabled ? (
                    <div className="flex items-center w-full justify-between gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 opacity-50 grayscale">
                            <item.icon className="size-4 shrink-0" />
                            <span className="font-medium text-sm truncate">{item.title}</span>
                        </div>

                        {isExpanded && (
                            <div className="flex items-center gap-2 shrink-0">
                                <Lock className="size-3 text-sidebar-foreground/30" />
                                <StatusBadge status={item.status} />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to={item.url} className="flex items-center w-full justify-between gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <item.icon className="size-4 shrink-0" />
                            <span className="font-medium text-sm truncate">{item.title}</span>
                        </div>
                        {isExpanded && <StatusBadge status={item.status} />}
                    </Link>
                )}
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
