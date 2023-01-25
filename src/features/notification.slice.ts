import { RootState } from '@/redux/store';
import { Alert } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentProps } from 'react';

type Nullist<T> = T | null | undefined;

export type Notification = {
	open: boolean;
	message: string;
	severity: ComponentProps<typeof Alert>['severity'];
	autoClose?: Nullist<number>;
	id?: Nullist<string>;
	loading?: Nullist<boolean>;
};

interface NotificationState {
	data: Notification;
}

const initialState: NotificationState = {
	data: {
		open: false,
		message: '',
		severity: 'success',
		autoClose: 5000,
	},
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		showNotification: (state, action: PayloadAction<Notification>) => {
			state.data = action.payload.loading
				? {
						...action.payload,
						autoClose: null,
				  }
				: action.payload;
		},
		setOpen: (state, action: PayloadAction<boolean>) => {
			state.data.open = action.payload;
		},
		updateNotification: (
			state,
			action: PayloadAction<Partial<Notification>>
		) => {
			if (state.data.id !== action.payload.id) {
				return;
			}

			state.data = {
				...state.data,
				...action.payload,
			};
		},
	},
});

export const { showNotification, setOpen, updateNotification } =
	notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotification = (state: RootState) => state.notification.data;
