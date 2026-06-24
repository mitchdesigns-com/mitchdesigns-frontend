import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// No R2 incremental cache: the CI deploy token can't reach the R2 REST API, and
// OpenNext's deploy step provisions/checks the R2 bucket unconditionally whenever
// an R2 cache is configured. Dropping it lets deploys run without R2 access; ISR
// pages re-render on demand instead of being served from a persistent cache.
export default defineCloudflareConfig({
  queue: doQueue,
});
