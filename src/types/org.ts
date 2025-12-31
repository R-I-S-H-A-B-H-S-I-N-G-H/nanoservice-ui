export interface Org {
	id?: string;
	createdAt?: string;
	updatedAt?: string;
	isDeleted?: boolean;
	name: string;
	creatorId: string;
	shortId?: string
}
