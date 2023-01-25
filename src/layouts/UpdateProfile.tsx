import { Box, Button, Stack, TextField } from '@mui/material';

const UpdateProfile = () => {
	return (
		<Stack spacing={5} sx={{ my: 5 }}>
			<TextField variant="filled" label="Email" fullWidth />
			<TextField variant="filled" label="Name" fullWidth />
			<TextField variant="filled" label="Website" fullWidth />
			<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
				<Button fullWidth variant="contained" size="large" color="warning">
					Update
				</Button>
			</Box>
		</Stack>
	);
};

export default UpdateProfile;
