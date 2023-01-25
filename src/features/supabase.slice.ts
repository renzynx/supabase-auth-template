import { Database } from '@/generated/types';
import { apiSlice } from '@/redux/api/api.slice';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { showNotification, updateNotification } from './notification.slice';
import { setLoading, updateUser } from './user.slice';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Monitors = Database['public']['Tables']['monitors']['Row'];

export const supabaseSlice = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getProfile: build.query<Profile | null, string | undefined>({
			queryFn: async (id) => {
				if (!id) {
					return {
						data: null,
					};
				}

				const supabase = createBrowserSupabaseClient<Database>();

				const { data, error } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', id)
					.single();

				if (error) {
					return { error };
				}

				let avatarUrl: string | undefined;

				if (data?.avatar_url) {
					const { data: avatarData, error: avatarError } =
						await supabase.storage.from('avatars').download(data.avatar_url);

					if (avatarError) {
						return { error: avatarError };
					}

					if (avatarData) {
						avatarUrl = URL.createObjectURL(avatarData);
					}
				}

				return avatarUrl
					? { data: { ...data, avatar_url: avatarUrl } }
					: { data };
			},
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				const result = await queryFulfilled;
				if (result.data) {
					dispatch(
						updateUser({
							id: result.data.id,
							username: result.data.username,
							avatar_url: result.data.avatar_url,
						})
					);
				}
				dispatch(setLoading(false));
			},
		}),
		updateProfile: build.mutation<Profile, Partial<Profile>>({
			queryFn: async (profile) => {
				const supabase = createBrowserSupabaseClient<Database>();

				const { data, error } = await supabase
					.from('profiles')
					.update(profile)
					.eq('id', profile.id)
					.select('*')
					.single();

				if (error) {
					return { error };
				}

				return { data };
			},
		}),
		uploadAvatar: build.mutation<Profile, { id: string; file: File }>({
			queryFn: async ({ id, file }) => {
				const supabase = createBrowserSupabaseClient<Database>();

				const { data, error } = await supabase.storage
					.from('avatars')
					.upload(id, file, { upsert: true });

				if (error) {
					return { error };
				}

				if (!data) {
					return { error: new Error('No data returned') };
				}

				const { data: updateProfile, error: updateError } = await supabase
					.from('profiles')
					.update({ avatar_url: data.path })
					.eq('id', id)
					.select('*')
					.single();

				if (updateError) {
					return { error: updateError };
				}

				return { data: updateProfile };
			},
			async onQueryStarted({ file, id }, { dispatch, queryFulfilled }) {
				dispatch(
					showNotification({
						id: 'upload-avatar',
						loading: true,
						message: 'Uploading avatar...',
						severity: 'info',
						open: true,
					})
				);

				const result = await queryFulfilled;
				if (result.data) {
					dispatch(
						supabaseSlice.util.updateQueryData('getProfile', id, (draft) => {
							if (draft) {
								draft.avatar_url = URL.createObjectURL(file);
							}
						})
					);
					dispatch(
						updateUser({
							avatar_url: URL.createObjectURL(file),
						})
					);
					dispatch(
						updateNotification({
							id: 'upload-avatar',
							loading: false,
							message: 'Avatar uploaded',
							severity: 'success',
							open: true,
							autoClose: 5000,
						})
					);
				}
			},
		}),
		downloadAvatar: build.mutation<string, string>({
			queryFn: async (id) => {
				const supabase = createBrowserSupabaseClient<Database>();

				const { data, error } = await supabase.storage
					.from('avatars')
					.download(id);

				if (error) {
					return { error };
				}

				if (!data) {
					return { error: new Error('No data returned') };
				}

				const url = URL.createObjectURL(data);

				return { data: url };
			},
		}),
		deleteAvatar: build.mutation<boolean, string>({
			queryFn: async (id) => {
				const supabase = createBrowserSupabaseClient<Database>();

				const { data, error } = await supabase.storage
					.from('avatars')
					.remove([id]);

				if (error) {
					return { error };
				}

				if (!data) {
					return { error: new Error('No data returned') };
				}

				const { error: updateError } = await supabase
					.from('profiles')
					.update({ avatar_url: null })
					.eq('id', id);

				if (updateError) {
					return { error: updateError };
				}

				return {
					data: true,
				};
			},
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				dispatch(
					showNotification({
						id: 'delete-avatar',
						loading: true,
						message: 'Resetting avatar...',
						severity: 'info',
						open: true,
					})
				);
				const result = await queryFulfilled;
				if (result.data) {
					dispatch(
						supabaseSlice.util.updateQueryData('getProfile', id, (draft) => {
							if (draft) {
								draft.avatar_url = null;
							}
						})
					);
					dispatch(
						updateUser({
							avatar_url: null,
						})
					);
					dispatch(
						updateNotification({
							id: 'delete-avatar',
							loading: false,
							message: 'Your avatar has successfully been resetted',
							severity: 'success',
							open: true,
							autoClose: 5000,
						})
					);
				}
			},
		}),
	}),
});

export const {
	useGetProfileQuery,
	useUpdateProfileMutation,
	useUploadAvatarMutation,
	useDownloadAvatarMutation,
	useDeleteAvatarMutation,
} = supabaseSlice;
