/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.pccoepune.com',
        },
      ],
      domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push({
          bufferutil: "bufferutil",
          "utf-8-validate": "utf-8-validate",
        });
      }
      return config;
    },
  };
  
  export default nextConfig;