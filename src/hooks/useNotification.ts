import { useAppDispatch } from '@/redux/store';
import { useCallback } from 'react';
import {
	Notification,
	selectNotification,
} from '@/features/notification.slice';
import { notificationSlice } from '@/features/notification.slice';
import { useSelector } from 'react-redux';

export function useNotification() {
	const dispatch = useAppDispatch();
	const notification = useSelector(selectNotification);

	const showNotification = useCallback(
		({ message, severity, loading, id }: Partial<Notification>) => {
			dispatch(
				notificationSlice.actions.showNotification({
					id,
					message: message!,
					severity,
					loading: loading ?? false,
					open: true,
				})
			);
		},
		[dispatch]
	);

	const updateNotification = useCallback(
		(data: Partial<Notification>) => {
			if (notification?.id !== data.id) {
				return;
			}
			dispatch(notificationSlice.actions.updateNotification({ ...data }));
		},
		[dispatch, notification?.id]
	);

	return { showNotification, updateNotification };
}

export default useNotification;
