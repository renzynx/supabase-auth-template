import { RootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Database } from '@/generated/types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
	email: string | null;
	role: string | null;
};

interface UserState {
	data: Profile | null;
	loading: boolean;
}

const initialState: UserState = { data: null, loading: true };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<Partial<Profile> | null>) => {
			// @ts-ignore - L + Ratio don't care.
			state.data = action.payload;
		},
		updateUser: (state, action: PayloadAction<Partial<Profile>>) => {
			// @ts-ignore - L + Ratio don't care.
			state.data = { ...state.data, ...action.payload };
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
	},
});

export const { setUser, setLoading, updateUser } = userSlice.actions;

export const selectAuth = (state: RootState) => state.user;
export const selectUser = (state: RootState) => state.user.data;
export const selectLoading = (state: RootState) => state.user.loading;

export default userSlice.reducer;
