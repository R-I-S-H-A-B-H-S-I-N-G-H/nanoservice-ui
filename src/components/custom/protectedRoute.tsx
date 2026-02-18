import { getLoggedUser, isCurrentTokenExpired } from "@/utils/jwtUtil";
import { Navigate, Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./appSideBar";

export default function ProtectedRoute() {
    const user = getLoggedUser();
    const isExpired = isCurrentTokenExpired();
    const isLoggedIn = !isExpired && !!user?.id;

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                {/* 1. Sidebar now contains the toggle logic */}
                <AppSidebar />
                
                <main className="flex-1 flex flex-col min-h-screen bg-muted/10">
                    {/* 2. No more global header here—pages provide their own */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}