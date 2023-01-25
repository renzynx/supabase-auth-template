import { selectNotification, setOpen } from '@/features/notification.slice';
import { useAppDispatch } from '@/redux/store';
import { Box, LinearProgress } from '@mui/material';
import { FC, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { setActiveTab } from '@/features/layout.slice';
import { useGetProfileQuery } from '@/features/supabase.slice';
import { updateUser } from '@/features/user.slice';
import { useUser } from '@supabase/auth-helpers-react';

const Snackbar = dynamic(() => import('@mui/material/Snackbar'), {
	ssr: false,
});

const Alert = dynamic(() => import('@mui/material/Alert'), {
	ssr: false,
});

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
	const { open, message, severity, autoClose, loading } =
		useSelector(selectNotification);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useUser();
	useGetProfileQuery(user?.id);

	useEffect(() => {
		if (user) {
			dispatch(updateUser({ email: user.email, role: user.role }));
		}
	}, [dispatch, user]);

	useEffect(() => {
		dispatch(setActiveTab(router.pathname));
	}, [dispatch, router.pathname]);

	const handleClose = () => {
		dispatch(setOpen(false));
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={open}
				onClose={handleClose}
				autoHideDuration={autoClose}
			>
				<div>
					<Alert onClose={handleClose} severity={severity}>
						{message}
					</Alert>
					{loading && <LinearProgress />}
				</div>
			</Snackbar>
			<Box sx={{ display: 'flex' }}>
				<Navbar />
				<Sidebar />
				<Box sx={{ flexGrow: 1, p: 3, mt: 7 }}>{children}</Box>
			</Box>
		</>
	);
};

export default Layout;
