export interface User {
	id?: string;
	shortId?: string;
	createdAt?: string;
	updatedAt?: string;
	isDeleted?: boolean;
	fullName: string;
	avatar_url?: string | null;
	email: string;
	disabled?: boolean;
	isActive: boolean;
}

/**
 {
            "id": "63bc7371-4f81-4d11-a366-f8227602ed1c",
            "shortId": "hphqXuQI",
            "createdAt": "2025-12-28T00:03:59.433624+05:30",
            "updatedAt": "2025-12-28T00:03:59.433624+05:30",
            "isDeleted": false,
            "email": "test4@gmail.com",
            "password": "",
            "fullName": "Test User",
            "isActive": true
        }
 */