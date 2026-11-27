// Sentry setup for the server. Loaded from instrumentation.ts.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fc4cf46d5059519678f77cd16979858c@o4506108247015424.ingest.sentry.io/4506108249374720",

  // Forward browser events sent with `tunnel: true` (see instrumentation-client.ts).
  integrations: [Sentry.serveTunnelIntegration()],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
});
