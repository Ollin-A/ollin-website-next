import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import type { BlogPostRecord } from "@/types/blog";
import BlogFilter from "@/components/blog/BlogFilter";
import StructuredData from "@/components/ui/StructuredData";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, playbooks, and updates on systems that help service businesses grow calmly — and scale deliberately.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "OLLIN - Blog",
    description:
      "Insights, playbooks, and updates on systems that help service businesses grow calmly.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OLLIN - Blog",
    description:
      "Insights, playbooks, and updates on systems that help service businesses grow calmly.",
  },
};

export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(
      "slug,title,excerpt,content_md,cover_image_url,tags,published_at,seo_description",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const typedPosts = (posts ?? []) as BlogPostRecord[];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "OLLIN Blog",
    description:
      "Insights, playbooks, and updates on systems that help service businesses grow calmly.",
    url: `${siteUrl}/blog`,
    blogPost: typedPosts.slice(0, 50).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteUrl}/blog/${p.slug}`,
    })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog`,
    },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <BlogFilter posts={typedPosts} />
    </>
  );
}
