import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// export default nextConfig;


// const nextConfig = {
//   // Your Next.js config here
// }

// Make sure you wrap your `nextConfig`
// with the `withPayload` plugin
export default withPayload(nextConfig) 
