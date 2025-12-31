// import { getLoggedUser, isCurrentTokenExpired } from "@/utils/jwtUtil";
import { Outlet } from "react-router";

export default function ProtectedRoute() {
    // const user = getLoggedUser();
    // const isExpired = isCurrentTokenExpired();
    // const isLoggedIn = !isExpired && !!user?.id;

	// if (!isLoggedIn) {
	// 	return <Navigate to="/login" replace />;
	// }

	return <Outlet />;
}
