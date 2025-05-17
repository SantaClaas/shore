import { createMiddleware } from "@solidjs/start/middleware";
import { randomBytes } from "node:crypto";

/**
 * Based on https://docs.solidjs.com/solid-start/guides/security
 */
export default createMiddleware({
  onRequest: (event) => {
    if (import.meta.env.DEV) {
      // I really want to but could not figure out how to get vite dev stuff to load with nonce
      console.warn("Not setting Content Security Policy for development");
      event.locals.nonce = "UNUSED_DEVELOPMENT_NONCE";
      return;
    }

    const nonce = randomBytes(16).toString("base64");

    // Set nonce to be picked up by server entry point
    event.locals.nonce = nonce;

    const contentSecurityPolicy = `
      default-src 'self';
      script-src 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';
      object-src 'none';
      base-uri 'none';
      frame-ancestors 'none';
      form-action 'self';
    `.replace(/\s+/g, " ");

    event.response.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicy,
    );
  },
});
