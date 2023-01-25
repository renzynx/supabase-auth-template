import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { showNotification } from '@/features/notification.slice';

export const rtkQueryErrorLogger: Middleware =
	(api: MiddlewareAPI) => (next) => (action) => {
		if (isRejectedWithValue(action)) {
			api.dispatch(
				showNotification({
					open: true,
					message: action.payload.message,
					severity: 'error',
				})
			);
		}

		return next(action);
	};
