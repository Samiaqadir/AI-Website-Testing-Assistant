process.env.NEXT_PRIVATE_DISABLE_DEV_OVERLAY_UX = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
