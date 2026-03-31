import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug,updated_at")
    .eq("status", "published");

  const base = "https://ollin.agency";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services/foundation`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services/demand`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services/retention`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services/audit`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/packages`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/packages/personalized`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/chat`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/data-deletion`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
