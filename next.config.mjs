/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'www.pccoepune.com',
          },
      ],
  },
};

export default nextConfig;
