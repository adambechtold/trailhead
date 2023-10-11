const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  publicRuntimeConfig: {
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
});

module.exports = nextConfig;
