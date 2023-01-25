import Banner from '@/layouts/Banner';
import UpdateProfile from '@/layouts/UpdateProfile';
import { Container } from '@mui/material';

const ProfilePage = () => {
	return (
		<Container sx={{ mt: 5 }}>
			<Banner />
			<UpdateProfile />
		</Container>
	);
};

export default ProfilePage;
