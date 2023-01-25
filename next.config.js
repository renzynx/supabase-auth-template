/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	modularizeImports: {
		'@mui/material': {
			transform: '@mui/material/{{member}}',
		},
		'@mui/icons-material': {
			transform: '@mui/icons-material/{{member}}',
		},
	},
	experimental: {
		fontLoaders: [
			{ loader: '@next/font/google', options: { subsets: ['latin'] } },
		],
	},
};

module.exports = nextConfig;
