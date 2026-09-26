/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["node:sqlite"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
import('@opennextjs/cloudflare')
  .then(m => m.initOpenNextCloudflareForDev?.())
  .catch(() => {});
