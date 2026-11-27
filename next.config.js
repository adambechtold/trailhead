const { randomUUID } = require("node:crypto");

const withSerwist = require("@serwist/next").default({
  swSrc: "worker/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  // The offline fallback page must be precached; the revision changes every build.
  additionalPrecacheEntries: [{ url: "/_offline", revision: randomUUID() }],
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer(
  withSerwist({
    reactStrictMode: true,
    // Inlined into the client bundle at build time
    env: {
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

  // Show source map upload logs in CI (Vercel sets CI=1), so a failed upload is visible
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Remove Sentry's debug logging from the production bundle
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
