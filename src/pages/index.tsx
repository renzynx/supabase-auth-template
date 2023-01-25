import { Typography } from '@mui/material';
import { useSession } from '@supabase/auth-helpers-react';

const Home = () => {
	const session = useSession();

	return (
		<>
			{session ? (
				<Typography align="center" variant="h6">
					Welcome {session.user.email}
				</Typography>
			) : (
				<Typography align="center" variant="h6">
					You are not logged in
				</Typography>
			)}
		</>
	);
};

export default Home;
