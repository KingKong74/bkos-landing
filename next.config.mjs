/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' }, // Spotify album art
      { protocol: 'https', hostname: 'mosaic.scdn.co' }, // Spotify playlist art
    ],
  },
};
export default nextConfig;
