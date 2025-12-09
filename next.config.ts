import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',

  // TypeScript build configuration
  typescript: {
    // Type checking is now enabled - all TS errors have been fixed
    ignoreBuildErrors: false,
  },

  // ============================================
  // SECURITY HEADERS
  // ============================================
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            // Prevent XSS attacks by controlling resources the browser can load
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline/eval needed for Next.js dev
              "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for styled-components
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.openai.com https://*.stripe.com",
              "frame-src 'self' https://*.stripe.com", // Stripe checkout iframe
              "frame-ancestors 'none'",
              "form-action 'self'", // Security: Prevent form submissions to external sites
              "base-uri 'self'", // Security: Prevent base tag hijacking
              "object-src 'none'", // Security: Prevent plugins (Flash, Java, etc.)
              "upgrade-insecure-requests", // Security: Upgrade HTTP to HTTPS
            ].join('; '),
          },
          {
            // Prevent clickjacking attacks
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Prevent MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Control referrer information
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Control browser features
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
            ].join(', '),
          },
          {
            // Enforce HTTPS (only in production)
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            // Prevent XSS attacks (legacy header, but still useful)
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
