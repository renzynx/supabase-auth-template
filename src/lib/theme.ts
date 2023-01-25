import { createTheme } from '@mui/material/styles';
import { Quicksand } from '@next/font/google';

const quicksand = Quicksand({ subsets: ['latin'] });

export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		background: {
			default: '#080404',
			paper: '#080404',
		},
	},
	typography: {
		fontFamily: quicksand.style.fontFamily,
	},
});

export const fontClassName = quicksand.className;

export const createColorMode = (mode: 'dark' | 'light' = 'dark') => {
	return createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'dark' ? '#080404' : '#fff',
				paper: mode === 'dark' ? '#080404' : '#fff',
			},
		},
		typography: {
			fontFamily: quicksand.style.fontFamily,
		},
	});
};

export default createColorMode;
