import { selectUser } from '@/features/user.slice';
import { Settings, Logout } from '@mui/icons-material';
import {
	Tooltip,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	Typography,
	Divider,
	ListItemIcon,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState, MouseEvent, memo } from 'react';
import { useSelector } from 'react-redux';

const UserMenu = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = !!anchorEl;
	const router = useRouter();
	const supabase = useSupabaseClient();
	const user = useSelector(selectUser);

	const handleClick = (event: MouseEvent<HTMLElement>) =>
		setAnchorEl(event.currentTarget);

	const handleClose = () => setAnchorEl(null);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<>
			<Tooltip title="Profile">
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 2 }}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<Avatar
						sx={{ width: 32, height: 32, outline: `1px solid ${grey[700]}` }}
						alt="your avatar"
						src={
							user?.avatar_url ??
							`https://api.dicebear.com/5.x/identicon/svg?seed=${user?.id}`
						}
					/>
				</IconButton>
			</Tooltip>

			<Menu
				elevation={6}
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={() => router.push('/profile')}>
					<Avatar
						src={`https://api.dicebear.com/5.x/identicon/svg?seed=${user?.id}`}
						sx={{ width: 32, height: 32 }}
					/>
					<Typography variant="body2" sx={{ ml: 2 }}>
						My account
					</Typography>
					<Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
						@{user?.username ?? user?.email?.split('@')[0]}
					</Typography>
				</MenuItem>
				<Divider />

				<MenuItem onClick={() => router.push('/settings')}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem onClick={handleSignOut}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
};

export default memo(UserMenu);
