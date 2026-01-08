import { getLoggedUser, isCurrentTokenExpired } from "@/utils/jwtUtil";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
    const user = getLoggedUser();
    const isExpired = isCurrentTokenExpired();
    const isLoggedIn = !isExpired && !!user?.id;

	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
