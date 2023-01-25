import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import PasswordInput from './PasswordInput';

const ChangePassword = () => {
	return (
		<Paper>
			<Stack spacing={5} p={3}>
				<Typography>Change Password</Typography>
				<PasswordInput fullWidth label="Current Password" />
				<PasswordInput fullWidth label="Password" />
				<PasswordInput fullWidth label="Confirm Password" />
				<Box
					sx={{
						flexGrow: 1,
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Button variant="contained" size="large" color="warning">
						Change Password
					</Button>
				</Box>
			</Stack>
		</Paper>
	);
};

export default ChangePassword;
