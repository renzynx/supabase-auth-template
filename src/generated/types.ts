export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			monitors: {
				Row: {
					created_at: string | null;
					description: string | null;
					id: number;
					name: string;
					type: string;
					user_id: string;
					uuid: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: number;
					name: string;
					type: string;
					user_id: string;
					uuid?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: number;
					name?: string;
					type?: string;
					user_id?: string;
					uuid?: string | null;
				};
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					full_name: string | null;
					id: string;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					full_name?: string | null;
					id: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					full_name?: string | null;
					id?: string;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
