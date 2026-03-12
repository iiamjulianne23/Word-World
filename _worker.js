// ============================================================
// _worker.js — Cloudflare Pages Worker
// Deploy to: https://dash.cloudflare.com → Pages → Functions
// This runs at the edge for security headers & routing
// ============================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route: serve index.html for all paths (SPA)
    const response = await env.ASSETS.fetch(request);

    // Clone and add security headers
    const newResponse = new Response(response.body, response);

    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    newResponse.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com",
        "img-src 'self' data:"
      ].join("; ")
    );

    // Cache static assets aggressively
    if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2|ico)$/)) {
      newResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      newResponse.headers.set("Cache-Control", "public, max-age=3600, must-revalidate");
    }

    return newResponse;
  }
};
