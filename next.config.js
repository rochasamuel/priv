/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "d384rvovcanpvp.cloudfront.net",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "api.qrserver.com",
				port: "",
				pathname: "**",
			},
		],
	},
};

module.exports = nextConfig;
