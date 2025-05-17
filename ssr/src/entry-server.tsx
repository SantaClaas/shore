// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(
  () => (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
            {assets}
          </head>
          <body class="h-dvh content-center">
            {children}
            {scripts}
          </body>
        </html>
      )}
    />
  ),
  (event) => {
    if (!("nonce" in event.locals))
      throw new Error(
        "Expected nonce to be defined by Content Security Policy middleware",
      );

    // Based on https://docs.solidjs.com/solid-start/guides/security
    console.debug("NONCE", event.locals.nonce);
    return { nonce: event.locals.nonce };
  },
);
