/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1920],
  },

  // The site collapsed from six routes into one page; keep old links alive.
  async redirects() {
    const legacy = {
      "/home-3": "#about",
      "/about-2": "#about",
      "/resume-3": "#experience",
      "/portfolio-3": "#projects",
      "/blog-3": "#certificates",
      "/contact-3": "#contact",
    };
    return Object.entries(legacy).map(([source, hash]) => ({
      source,
      destination: `/${hash}`,
      permanent: true,
    }));
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
