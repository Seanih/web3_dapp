/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		dangerouslyAllowSVG: true,
		domains: ['ipfs-assets.animocabrands.com', 'ipfs.moralis.io'],
	},
};

module.exports = nextConfig;
