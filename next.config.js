const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    // Needed on Next.js 14 for instrumentation.ts (Sentry). Stable in Next.js 15.
    experimental: {
      instrumentationHook: true,
    },
    publicRuntimeConfig: {
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    },
  }),
);

module.exports = nextConfig;

// Sentry: https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require("@sentry/nextjs/config");

module.exports = withSentryConfig(module.exports, {
  org: "adam-bechtold",
  project: "trailhead",

  // Suppresses source map uploading logs during build
  silent: true,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Remove Sentry's debug logging from the production bundle
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
