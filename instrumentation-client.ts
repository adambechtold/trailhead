// Sentry setup for the browser. Runs before the app loads.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fc4cf46d5059519678f77cd16979858c@o4506108247015424.ingest.sentry.io/4506108249374720",

  // Send events through this site's own server so ad-blockers don't drop them.
  // The server side is handled by serveTunnelIntegration() in sentry.server.config.ts.
  tunnel: true,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Session Replay: record 10% of sessions, and every session that hits an error.
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});
