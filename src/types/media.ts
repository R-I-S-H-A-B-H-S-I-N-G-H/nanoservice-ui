export interface Media {
	id?: string;
	shortId?: string;
	createdAt?: string;
	updatedAt?: string;
	isDeleted?: boolean;
	orgId?: string;
	userId?: string;
	name: string;
	description?: string;
	mimeType?: string;
	extension?: string;
	resourcePath?: string;
	size?: number;
	status?: string;
	preSignedUrl?: string;
}

/*
{
                "id": "715b863c-8e08-4503-b735-c7d65e2c2ed1",
                "shortId": "GDwh8B6X",
                "createdAt": "2026-01-26T00:43:08.926616+05:30",
                "updatedAt": "2026-01-26T00:43:08.926616+05:30",
                "isDeleted": false,
                "orgId": "Jtdc6iYH",
                "userId": "N-9vzsXH",
                "name": "Test Stream 2",
                "description": "Sintel",
                "mimeType": "",
                "extension": "",
                "resourcePath": "Jtdc6iYH/N-9vzsXH/GDwh8B6X.",
                "size": 0,
                "status": "active",
                "preSignedUrl": null
            },
			*/