import {
	useDeleteAvatarMutation,
	useUploadAvatarMutation,
} from '@/features/supabase.slice';
import { selectAuth } from '@/features/user.slice';
import useNotification from '@/hooks/useNotification';
import { CopyAll as CopyIcon } from '@mui/icons-material';
import {
	Avatar,
	Box,
	Button,
	Chip,
	IconButton,
	InputAdornment,
	Menu,
	MenuItem,
	MenuList,
	Paper,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Banner = () => {
	const { data: user, loading } = useSelector(selectAuth);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [upload, { isLoading: avatarUploading }] = useUploadAvatarMutation();
	const [deleteAvatar] = useDeleteAvatarMutation();
	const inputRef = useRef<HTMLButtonElement>(null);
	const { showNotification } = useNotification();
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleUploadAvatar = async (file: File) => {
		if (!file) return;

		await upload({
			id: user?.id!,
			file,
		});

		handleClose();
	};
	const handleDeleteAvatar = async () => {
		await deleteAvatar(user?.id!);
		handleClose();
	};
	return (
		<Paper
			elevation={3}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: '5rem',
				flexGrow: 1,
				flexWrap: 'wrap',
				p: 6,
				'@media (max-width: 755px)': {
					justifyContent: 'center',
					alignItems: 'center',
					gap: '2rem',
					p: 3,
				},
			}}
		>
			<Stack
				spacing={2}
				sx={{
					justifyContent: 'center',
					flexGrow: 1,
					'@media (max-width: 805px)': {
						alignItems: 'center',
						textAlign: 'center',
					},
				}}
			>
				<Box>
					<Typography sx={{ ml: 0.3 }} variant="body1">
						Role
					</Typography>
					<Chip
						size="medium"
						sx={{ width: '4rem' }}
						color="info"
						label={user?.role === 'authenticated' ? 'User' : 'Unknown'}
					/>
				</Box>
				<Box>
					<TextField
						variant="filled"
						label="User Identifier"
						size="small"
						value={user?.id ?? ''}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => {
											navigator.clipboard.writeText(user?.id ?? '');
											showNotification({
												message: 'Copied to clipboard',
											});
										}}
									>
										{loading ? (
											<Skeleton variant="circular" width={20} height={20} />
										) : (
											<CopyIcon />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Box>
			</Stack>

			<Box sx={{ position: 'relative', mx: 'auto' }}>
				{loading ? (
					<SkeletonAvatar />
				) : (
					<IconButton onClick={() => inputRef.current?.click()}>
						<Avatar
							draggable={false}
							sx={{
								width: 200,
								height: 200,
								outline: `1px solid ${grey[700]}`,
								'@media (max-width: 755px)': {
									width: 150,
									height: 150,
								},
							}}
							src={
								user?.avatar_url ??
								`https://api.dicebear.com/5.x/identicon/svg?seed=${user?.id!}`
							}
							alt="User avatar"
						/>
					</IconButton>
				)}
				<Button
					size="small"
					variant="contained"
					color="info"
					sx={{ position: 'absolute', bottom: 5, right: 0 }}
					id="edit-button"
					aria-controls={open ? 'edit-button' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
					disabled={loading}
					ref={inputRef}
				>
					Edit
				</Button>
				<Menu
					id="edit-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'edit-button',
					}}
				>
					<MenuList dense>
						<MenuItem>
							<label htmlFor="file">Upload avatar</label>
						</MenuItem>
						<input
							multiple={false}
							accept="image/*"
							disabled={avatarUploading}
							onChange={(event) => {
								const file = event.target.files?.[0];
								handleUploadAvatar(file!);
							}}
							id="file"
							type="file"
							hidden
						/>
						<MenuItem onClick={handleDeleteAvatar}>Reset to default</MenuItem>
					</MenuList>
				</Menu>
			</Box>
		</Paper>
	);
};

const SkeletonAvatar = () => {
	return (
		<Skeleton
			sx={{
				height: 200,
				width: 200,
				outline: `1px solid ${grey[700]}`,
				'@media (max-width: 755px)': {
					width: 150,
					height: 150,
				},
			}}
			variant="circular"
		/>
	);
};

export default Banner;
