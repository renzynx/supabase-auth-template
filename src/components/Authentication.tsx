import {
	Container,
	Paper,
	Typography,
	Box,
	Button,
	CircularProgress,
	Link,
	TextField as TextInput,
} from '@mui/material';
import PasswordInput from '../layouts/PasswordInput';
import { FC, useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { emailRegex, passwordRegex } from '@/lib/regex';
import router from 'next/router';
import useNotification from '@/hooks/useNotification';

type AuthPageProps = {
	type: 'login' | 'register' | 'forgot';
};

type Inputs = {
	email: string;
	password: string;
	confirmPassword?: string;
};

const AuthPage: FC<AuthPageProps> = ({ type }) => {
	const [auth, setAuth] = useState<AuthPageProps['type']>(type);
	const [loading, setLoading] = useState(false);
	const [fetched, setFetched] = useState(false);
	const supabase = useSupabaseClient();
	const {
		control,
		register,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
	} = useForm<Inputs>();
	const { showNotification } = useNotification();
	const code = typeof window !== 'undefined' ? router.query.code : null;

	useEffect(() => {
		if (fetched) {
			return;
		}
		router.prefetch(`/auth/${auth === 'login' ? 'register' : 'login'}`);
		router.prefetch('/auth/forgot-password');
		return () => {
			setFetched(true);
		};
	}, [auth, fetched]);

	useEffect(() => {
		const abortController = new AbortController();

		if (code === 'verify') {
			showNotification({
				message:
					'You have successfully verfied your email, login to get started.',
				severity: 'success',
			});
		}
		return () => {
			abortController.abort();
		};
	}, [code, showNotification]);

	const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
		setLoading(true);
		const { error, data } =
			auth === 'register'
				? await supabase.auth.signUp({
						email,
						password,
						options: {
							emailRedirectTo:
								window.location.origin + '/auth/login?code=verify',
						},
				  })
				: await supabase.auth.signInWithPassword({
						email,
						password,
				  });
		setLoading(false);

		if (error) {
			setError('email', {
				message: error.message,
			});
			setError('password', {
				message: error.message,
			});
			return;
		}

		if (data) {
			switch (auth) {
				case 'register':
					showNotification({
						message: 'Please check your email for a confirmation link',
						severity: 'success',
					});
					break;
				case 'login':
					showNotification({
						message: 'Logged in successfully',
						severity: 'success',
					});
					router.push('/');
					break;
				case 'forgot':
					showNotification({
						message: 'Please check your email for a password reset link',
						severity: 'success',
					});
					break;
				default:
					({
						message: 'Hmm, something went wrong',
						severity: 'error',
					});
					break;
			}
		}

		return;
	};

	const handleAuthChange = () => {
		setAuth(auth === 'login' ? 'register' : 'login');
		router.push(`/auth/${auth === 'login' ? 'register' : 'login'}`);
	};

	return (
		<>
			<Container
				maxWidth="sm"
				sx={{
					marginTop: '5rem',
					marginBottom: '3rem',
				}}
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Paper
						elevation={3}
						sx={{
							p: '2.5rem 2rem',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							gap: '1rem',
							'@media (max-width: 600px)': {
								p: '1.5rem 1rem',
							},
						}}
					>
						{auth === 'forgot' ? (
							<ForgotPassword setAuth={setAuth} />
						) : (
							<>
								<Typography variant="h4">
									Welcome to statusfy, please{' '}
									{auth === 'login' ? 'login' : 'register'} with
								</Typography>
								<div>
									<Controller
										name="email"
										control={control}
										rules={{
											required: {
												value: true,
												message: 'Please enter your email',
											},
											pattern: {
												value: emailRegex,
												message: 'Please enter a valid email',
											},
										}}
										render={({ field }) => (
											<TextInput
												{...register('email', {})}
												{...field}
												label="Email"
												variant="filled"
												fullWidth
												error={!!errors.email}
												helperText={errors.email && errors.email.message}
												sx={{ marginTop: 2 }}
											/>
										)}
									/>
								</div>
								<div>
									<Controller
										name="password"
										control={control}
										rules={{
											required: 'Please enter your password',
											minLength: {
												value: 8,
												message: 'Password must be at least 8 characters',
											},
											maxLength: {
												value: 64,
												message: 'Password must be at most 64 characters',
											},
											pattern: {
												value: passwordRegex,
												message:
													'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
											},
										}}
										render={({ field }) => (
											<PasswordInput
												{...field}
												label="Password"
												variant="filled"
												fullWidth
												error={!!errors.password}
												helperText={errors.password && errors.password.message}
												sx={{ marginTop: 2 }}
											/>
										)}
									/>
								</div>

								{auth === 'register' && (
									<div>
										<Controller
											name="confirmPassword"
											control={control}
											rules={{
												required: 'Please confirm your password',
												validate: (value) =>
													value === watch('password') ||
													'Passwords do not match',
											}}
											render={({ field }) => (
												<PasswordInput
													{...field}
													label="Confirm Password"
													variant="filled"
													fullWidth
													error={!!errors.confirmPassword}
													helperText={
														errors.confirmPassword &&
														errors.confirmPassword.message
													}
													sx={{ marginTop: 2 }}
												/>
											)}
										/>
									</div>
								)}
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginTop: 2,
										flexWrap: 'wrap',
										'@media (max-width: 600px)': {
											justifyContent: 'center',
											alignItems: 'center',
											gap: '1rem',
										},
									}}
								>
									<Link
										underline="hover"
										variant="body2"
										onClick={handleAuthChange}
									>
										{auth === 'login'
											? "Don't have an account?"
											: 'Already have an account?'}
									</Link>
									<Link
										underline="hover"
										variant="body2"
										onClick={() => {
											setAuth('forgot');
											router.push('/auth/forgot-password');
										}}
									>
										Forgot Password?
									</Link>
									<Button
										type="submit"
										variant="contained"
										size="large"
										endIcon={
											loading ? (
												<CircularProgress color="secondary" size="1rem" />
											) : null
										}
									>
										{auth === 'login' ? 'Login' : 'Register'}
									</Button>
								</Box>
							</>
						)}
					</Paper>
				</form>
			</Container>
		</>
	);
};

type ForgotPasswordProps = {
	setAuth: (auth: AuthPageProps['type']) => void;
};

const ForgotPassword: FC<ForgotPasswordProps> = ({ setAuth }) => {
	return (
		<>
			<Typography variant="h4">Forgot Password</Typography>
			<TextInput
				label="Email"
				type="email"
				variant="filled"
				fullWidth
				sx={{ marginTop: 2 }}
			/>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginTop: 2,
					flexWrap: 'wrap',
					'@media (max-width: 600px)': {
						justifyContent: 'center',
						alignItems: 'center',
						gap: '1rem',
					},
				}}
			>
				<Link
					underline="hover"
					variant="body2"
					onClick={() => {
						setAuth('register');
						router.push('/auth/register');
					}}
				>
					Don&apos;t have an account?
				</Link>
				<Link
					underline="hover"
					variant="body2"
					onClick={() => {
						setAuth('login');
						router.push('/auth/login');
					}}
				>
					Already have an account?
				</Link>

				<Button variant="contained" size="large">
					Submit
				</Button>
			</Box>
		</>
	);
};

export default AuthPage;
