import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Image optimisation would need a paid Cloudflare service; our only
    // raster image is the logo, so serve images as they are.
    unoptimized: true,
  },
  // Old links used /shop?category=Photobooks — send them to the category page
  // without running any server code.
  async redirects() {
    const legacy = { Photobooks: "photobooks", Journals: "journals", Planners: "planners", Notebooks: "notebooks" };
    return Object.entries(legacy).map(([name, slug]) => ({
      source: "/shop",
      has: [{ type: "query", key: "category", value: name }],
      destination: `/shop/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

// Lets `next dev` reach Cloudflare bindings (the PHOTOS store) locally.
if (process.env.NODE_ENV === "development") initOpenNextCloudflareForDev();
