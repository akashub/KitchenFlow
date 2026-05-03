import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
