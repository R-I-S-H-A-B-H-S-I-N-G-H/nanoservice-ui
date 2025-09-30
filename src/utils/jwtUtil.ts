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
    return jwtDecode(token);
}

export function getLoggedUser(): User | null {
    const token = getTokenFromLocalStorage();
    if (!token) {
        return null;
    }
    const decoded = decodeToken(token) as any;
    if (!decoded.full_name || !decoded.email) {
        return null;
    }
    return {
        id: decoded.id,  
        full_name: decoded.full_name,
        email: decoded.email,
    };
}