"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogPostRecord, SlugRow } from "@/types/blog";
import { formatDate, estimateReadingMinutes } from "@/lib/blog";

interface BlogContentProps {
  post: BlogPostRecord;
  newerPost: SlugRow | null;
  olderPost: SlugRow | null;
}

export default function BlogContent({
  post,
  newerPost,
  olderPost,
}: BlogContentProps) {
  const readMins = estimateReadingMinutes(post.content_md);

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-black/70 hover:text-black"
        >
          <span aria-hidden>←</span> Back to blog
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ollin-black/55">
        {post.published_at && <span>{formatDate(post.published_at)}</span>}
        <span className="opacity-40">•</span>
        <span>{readMins} min read</span>

        {!!post.tags?.length && (
          <>
            <span className="opacity-40">•</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center border border-black/10 bg-white/40 px-2.5 py-1 text-[11px] text-black/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-ollin-black">
        {post.title}
      </h1>

      {post.cover_image_url && (
        <div className="mt-10 overflow-hidden border border-black/10 bg-white/40 relative aspect-video">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      )}

      <article className="mt-10 pb-10 prose prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ollin-black prose-h2:mt-10 prose-h2:mb-3 prose-h3:mt-8 prose-h3:mb-2 prose-p:leading-relaxed prose-p:my-4 prose-blockquote:border-l prose-blockquote:border-black/10 prose-blockquote:pl-4 prose-blockquote:text-black/70 prose-a:text-ollin-black prose-a:underline prose-a:decoration-black/20 hover:prose-a:decoration-black/40 prose-strong:text-ollin-black prose-ul:pl-6 prose-ul:my-4 prose-ul:list-disc prose-ol:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-li:my-1 prose-pre:bg-black/5 prose-pre:border prose-pre:border-black/10 prose-pre:rounded-none prose-pre:p-4 prose-code:bg-black/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-6 my-4" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-6 my-4" />
            ),
            li: ({ node, ...props }) => <li {...props} className="my-1" />,
            p: ({ node, ...props }) => (
              <p {...props} className="my-4 leading-relaxed" />
            ),
          }}
        >
          {post.content_md ?? ""}
        </ReactMarkdown>
      </article>

      <div className="mt-10 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {newerPost ? (
          <Link
            href={`/blog/${newerPost.slug}`}
            className="group border border-black/10 bg-white/35 px-6 py-5 hover:bg-white/55 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            rel="prev"
            aria-label="Newer post"
          >
            <div className="text-[11px] text-black/55 mb-2 inline-flex items-center gap-2">
              <span
                className="transition-transform duration-200 group-hover:-translate-x-1"
                aria-hidden
              >
                ←
              </span>
              <span>Newer</span>
            </div>
            <div className="text-base font-semibold text-ollin-black group-hover:underline decoration-black/20">
              {newerPost.title}
            </div>
            {newerPost.published_at && (
              <div className="mt-2 text-xs text-black/55">
                {formatDate(newerPost.published_at)}
              </div>
            )}
          </Link>
        ) : (
          <div className="border border-black/10 bg-white/15 px-6 py-5">
            <div className="text-[11px] text-black/55 inline-flex items-center gap-2">
              <span className="opacity-70" aria-hidden>
                ←
              </span>
              <span>No newer post</span>
            </div>
          </div>
        )}

        {olderPost ? (
          <Link
            href={`/blog/${olderPost.slug}`}
            className="group border border-black/10 bg-white/35 px-6 py-5 hover:bg-white/55 transition md:text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            rel="next"
            aria-label="Older post"
          >
            <div className="text-[11px] text-black/55 mb-2 inline-flex items-center gap-2 md:justify-end w-full">
              <span>Older</span>
              <span
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </div>
            <div className="text-base font-semibold text-ollin-black group-hover:underline decoration-black/20">
              {olderPost.title}
            </div>
            {olderPost.published_at && (
              <div className="mt-2 text-xs text-black/55">
                {formatDate(olderPost.published_at)}
              </div>
            )}
          </Link>
        ) : (
          <div className="border border-black/10 bg-white/15 px-6 py-5 md:text-right">
            <div className="text-[11px] text-black/55 inline-flex items-center gap-2 md:justify-end w-full">
              <span>No older post</span>
              <span className="opacity-70" aria-hidden>
                →
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
