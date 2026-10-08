import type { MetadataRoute } from "next";

// Keep crawlers on real pages. Filtered/sorted views (?theme=…&sort=…) are
// endless combinations of the same products and cost server time for nothing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/*?", "/api/", "/admin", "/account", "/auth/", "/cart", "/checkout", "/search"],
      },
    ],
    sitemap: "https://www.rollbac.com/sitemap.xml",
  };
}
