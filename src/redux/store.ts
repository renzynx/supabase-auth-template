import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { apiSlice } from './api/api.slice';
import layoutReducer from '@/features/layout.slice';
import notificationReducer from '@/features/notification.slice';
import { rtkQueryErrorLogger } from './api/api.middleware';
import userReducer from '@/features/user.slice';

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		layout: layoutReducer,
		notification: notificationReducer,
		user: userReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(apiSlice.middleware)
			.concat(rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

setupListeners(store.dispatch);
