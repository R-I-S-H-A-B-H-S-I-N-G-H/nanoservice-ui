export interface User {
	id?: string;
	created_at?: string;
	updated_at?: string;
	is_deleted?: boolean;
	full_name: string;
	avatar_url?: string | null;
	email: string;
	disabled?: boolean;
}