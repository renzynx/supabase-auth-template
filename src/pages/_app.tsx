import { Database } from '@/generated/types';
import Wrapper from '@/layouts/Wrapper';
import { darkTheme } from '@/lib/theme';
import { store } from '@/redux/store';
import '@/styles/globals.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';

const clientSideEmotionCache = createCache({
	key: 'css',
	prepend: true,
});

export default function App({
	Component,
	pageProps: { layout = true, initialSession, ...pageProps },
}: AppProps<{
	layout: boolean;
	initialSession: Session;
	emotionCache?: EmotionCache;
}>) {
	const [supabase] = useState(() => createBrowserSupabaseClient<Database>());

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>App Name</title>
			</Head>
			<Provider store={store}>
				<SessionContextProvider
					supabaseClient={supabase}
					initialSession={initialSession}
				>
					<CacheProvider value={clientSideEmotionCache}>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							{layout ? (
								<Wrapper>
									<Component {...pageProps} />
								</Wrapper>
							) : (
								<Component {...pageProps} />
							)}
						</ThemeProvider>
					</CacheProvider>
				</SessionContextProvider>
			</Provider>
		</>
	);
}
