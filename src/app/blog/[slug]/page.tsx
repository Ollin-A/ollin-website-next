import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { BlogPostRecord, SlugRow } from "@/types/blog";
import BlogContent from "@/components/blog/BlogContent";
import StructuredData from "@/components/ui/StructuredData";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");

  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select(
      "title,seo_title,seo_description,cover_image_url,published_at,tags",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) return { title: "Post Not Found" };

  const title = post.seo_title?.trim() || post.title;
  const description =
    post.seo_description?.trim() ||
    "Insights, playbooks, and updates from OLLIN on building calm systems that grow service businesses.";

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      url: `/blog/${slug}`,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
    twitter: {
      card: post.cover_image_url ? "summary_large_image" : "summary",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
    keywords: post.tags ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerSupabase();

  const [{ data: post }, { data: slugList }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle(),
    supabase
      .from("blog_posts")
      .select("slug,title,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  if (!post) notFound();

  const typedPost = post as BlogPostRecord;
  const list = (slugList ?? []) as SlugRow[];
  const idx = list.findIndex((p) => p.slug === slug);
  const newerPost = idx > 0 ? list[idx - 1] : null;
  const olderPost = idx >= 0 && idx + 1 < list.length ? list[idx + 1] : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: typedPost.seo_title?.trim() || typedPost.title,
    description: typedPost.seo_description?.trim() || undefined,
    datePublished: typedPost.published_at || undefined,
    dateModified: typedPost.updated_at || undefined,
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    image: typedPost.cover_image_url
      ? [typedPost.cover_image_url]
      : undefined,
    keywords: typedPost.tags?.length
      ? typedPost.tags.join(", ")
      : undefined,
    publisher: { "@type": "Organization", name: "OLLIN" },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <BlogContent
        post={typedPost}
        newerPost={newerPost}
        olderPost={olderPost}
      />
    </>
  );
}
