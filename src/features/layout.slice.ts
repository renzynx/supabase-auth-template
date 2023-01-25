import { RootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
	isSidebarOpen: boolean;
	activeTab: string;
}

const initialState: LayoutState = {
	isSidebarOpen: false,
	activeTab: '/',
};

export const layoutSlice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		toggleSidebar: (state) => {
			state.isSidebarOpen = !state.isSidebarOpen;
		},
		setSidebar: (state, action: PayloadAction<boolean>) => {
			state.isSidebarOpen = action.payload;
		},
		setActiveTab: (state, action: PayloadAction<string>) => {
			state.activeTab = action.payload;
		},
	},
});

export const { toggleSidebar, setSidebar, setActiveTab } = layoutSlice.actions;

export default layoutSlice.reducer;

export const selectIsSidebarOpen = (state: RootState) =>
	state.layout.isSidebarOpen;
export const selectActiveTab = (state: RootState) => state.layout.activeTab;
