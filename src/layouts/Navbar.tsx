import { selectIsSidebarOpen, toggleSidebar } from '@/features/layout.slice';
import { useAppDispatch } from '@/redux/store';
import { DRAWER_WIDTH } from '@/lib/constant';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
	AppBar as MuiAppBar,
	AppBarProps as MuiAppBarProps,
	Box,
	Button,
	IconButton,
	Skeleton,
	Toolbar,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import UserMenu from './UserMenu';
import { selectAuth } from '@/features/user.slice';

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: DRAWER_WIDTH,
		width: `calc(100% - ${DRAWER_WIDTH}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Navbar = () => {
	const open = useSelector(selectIsSidebarOpen);
	const { data: user, loading: isLoading } = useSelector(selectAuth);
	const dispatch = useAppDispatch();

	const toggle = () => {
		dispatch(toggleSidebar());
	};

	return (
		<AppBar position="fixed" open={open}>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={toggle}
					edge="start"
					size="large"
					sx={{
						marginRight: 5,
						...(open && { display: 'none' }),
					}}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
					App Name
				</Typography>
				<Box sx={{ display: 'flex', gap: '1rem' }}>
					{isLoading ? (
						<Skeleton variant="circular" width={40} height={40} />
					) : !user ? (
						<>
							<Button>
								<Link href="/auth/login">Login</Link>
							</Button>
							<Button>
								<Link href="/auth/register">Register</Link>
							</Button>
						</>
					) : (
						<UserMenu />
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
