import type { User } from "@/types/user";
import { jwtDecode } from "jwt-decode";
const JWT_KEY = "JWT";


export function saveTokenToLocalStorage(token: string) {
    localStorage.setItem(JWT_KEY, token);
}

export function getTokenFromLocalStorage() {
    return localStorage.getItem(JWT_KEY);
}

export function decodeToken(token: string) {
	try {
		return jwtDecode(token);
	} catch (error) {
		console.warn("Error decoding token:", error);
		return null;
	}
}

export function getLoggedUser(): User | null {
	const token = getTokenFromLocalStorage();
	if (!token) {
		return null;
	}
	const decoded = decodeToken(token) as any;

	if (!decoded) return null;

	if (!decoded.full_name || !decoded.email) {
		return null;
	}
	return {
		id: decoded.id,
		full_name: decoded.full_name,
		email: decoded.email,
	};
}

export function isTokenExpired(token: string): boolean {
	try {
		const decoded = decodeToken(token) as any;
		const currentTime = Date.now() / 1000;
		return decoded.exp < currentTime;
	} catch (error) {
		console.error("Error decoding token:", error);
		return true;
	}
}

export function isCurrentTokenExpired(): boolean {
	const token = getTokenFromLocalStorage();

	if (!token) {
		return true;
	}
	return isTokenExpired(token);
}