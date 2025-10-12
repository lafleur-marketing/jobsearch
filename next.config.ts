import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Reduce bundle size
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    
    // Optimize for Vercel
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a separate chunk for ChatKit
          chatkit: {
            name: 'chatkit',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@openai[\\/]chatkit/,
            priority: 20,
          },
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;
