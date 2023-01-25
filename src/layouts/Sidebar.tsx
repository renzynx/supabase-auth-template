import {
	selectActiveTab,
	selectIsSidebarOpen,
	setSidebar,
} from '@/features/layout.slice';
import { DRAWER_WIDTH } from '@/lib/constant';
import { useAppDispatch } from '@/redux/store';
import {
	AccountCircle,
	ChevronLeft,
	Home,
	Logout,
	Settings,
} from '@mui/icons-material';
import {
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	SwipeableDrawer as MuiDrawer,
	Tooltip,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import {
	SupabaseClient,
	useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
}));

const openedMixin = (theme: Theme): CSSObject => ({
	width: DRAWER_WIDTH,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer, {
	// shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	width: DRAWER_WIDTH,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
})) as typeof MuiDrawer;

type Item = {
	name: string;
	icon: JSX.Element;
	href: string;
	action?: (client: SupabaseClient) => Promise<any>;
};

const items: Item[] = [
	{
		name: 'Home',
		icon: <Home />,
		href: '/',
	},
	{
		name: 'Settings',
		icon: <Settings />,
		href: '/settings',
	},
];

const accounts: Item[] = [
	{
		name: 'Profile',
		icon: <AccountCircle />,
		href: '/profile',
	},
	{
		name: 'Logout',
		icon: <Logout color="error" />,
		href: '',
		action: async (client: SupabaseClient) => {
			await client.auth.signOut();
		},
	},
];

const Sidebar = () => {
	const open = useSelector(selectIsSidebarOpen);
	const activeTab = useSelector(selectActiveTab);
	const dispatch = useAppDispatch();

	const handleDrawerOpen = () => {
		dispatch(setSidebar(true));
	};

	const handleDrawerClose = () => {
		dispatch(setSidebar(false));
	};

	const general = useMemo(() => {
		return items.map(({ name: text, icon, href }, index) => (
			<SideBarItem
				key={index}
				activeTab={activeTab}
				href={href}
				name={text}
				icon={icon}
				open={open}
			/>
		));
	}, [activeTab, open]);

	const account = useMemo(() => {
		return accounts.map(({ name, icon, href, action }, index) => (
			<SideBarItem
				key={index}
				activeTab={activeTab}
				href={href}
				name={name}
				icon={icon}
				open={open}
				action={action}
			/>
		));
	}, [activeTab, open]);

	return (
		<Drawer
			variant="permanent"
			open={open}
			onOpen={handleDrawerOpen}
			onClose={handleDrawerClose}
		>
			<DrawerHeader>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeft />
				</IconButton>
			</DrawerHeader>
			<Divider />
			<List>{general}</List>
			<Box sx={{ flexGrow: 1 }} />
			<Divider sx={{ my: 1 }} />
			<List sx={{ mb: 1 }}>{account}</List>
		</Drawer>
	);
};

const SideBarItem: FC<
	Item & {
		activeTab: string;
		open: boolean;
	}
> = ({ activeTab, href, name: text, open, icon, action }) => {
	const router = useRouter();
	const supabase = useSupabaseClient();

	return (
		<>
			<ListItem
				onClick={() => {
					if (action) {
						return action(supabase);
					}
					if (activeTab !== href) {
						router.push(href);
					}
				}}
				disablePadding
				sx={{
					display: 'block',
					bgcolor: activeTab === href ? grey[900] : 'transparent',
				}}
			>
				<ListItemButton
					sx={{
						minHeight: 48,
						justifyContent: open ? 'initial' : 'center',
						px: 2.5,
					}}
				>
					<ListItemIcon
						sx={{
							minWidth: 0,
							mr: open ? 3 : 'auto',
							justifyContent: 'center',
						}}
					>
						{open ? (
							icon
						) : (
							<Tooltip title={text} placement="right">
								{icon}
							</Tooltip>
						)}
					</ListItemIcon>
					<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
				</ListItemButton>
			</ListItem>
		</>
	);
};

export default Sidebar;
