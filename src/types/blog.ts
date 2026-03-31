export type SlugRow = Pick<BlogPostRecord, "slug" | "title" | "published_at">;

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  status: "draft" | "published" | "archived";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
};
