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
	isActive?: boolean;
}


export interface Member {
	id?: string;
	shortId?: string;
	createdAt?: string;
	updatedAt?: string;
	isDeleted?: boolean;
	orgId?:string;
    userId?:string;
    status?:string
    isOwner: boolean
}

export interface SignUpPayload{
    email: string;
    fullName: string;
    password: string
}

/**
  {
            "id": "d65c076b-f73d-41ac-a79d-338f51a6514f",
            "shortId": "uruHJrTO",
            "createdAt": "2026-01-04T20:57:41.747075+05:30",
            "updatedAt": "2026-01-04T20:57:41.747075+05:30",
            "isDeleted": false,
            "org_id": "TPq54WJ2",
            "user_id": "24Abqk-2",
            "status": "ACTIVE",
            "role_groups": null,
            "permissions": [
                ""
            ],
            "isOwner": true
        },
 */