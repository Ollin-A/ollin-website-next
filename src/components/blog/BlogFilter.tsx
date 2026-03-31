"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Tag } from "lucide-react";
import type { BlogPostRecord } from "@/types/blog";
import {
  formatDate,
  estimateReadingMinutes,
  clampText,
} from "@/lib/blog";

interface BlogFilterProps {
  posts: BlogPostRecord[];
}

export default function BlogFilter({ posts }: BlogFilterProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => {
      if (p?.tags) p.tags.forEach((t) => s.add(t));
    });
    return Array.from(s);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (!p) return false;
      const matchesTag =
        activeTag === "all" || (p.tags || []).includes(activeTag);
      const matchesQuery =
        !q ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => (t || "").toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  return (
    <div className="space-y-10">
      <h1 className="text-4xl md:text-6xl font-semibold text-ollin-black">
        Blogs
      </h1>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-[20px_1fr] items-center gap-2 max-w-md w-full border border-black/10 bg-white/60 px-3 py-3 leading-none">
          <div className="w-5 h-5 grid place-items-center">
            <Search
              className="block w-4 h-4 text-black/40"
              aria-hidden="true"
            />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-0 bg-transparent text-sm leading-normal focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTag("all")}
            className={`inline-flex items-center gap-2 px-3 py-1 text-xs border border-black/10 ${
              activeTag === "all"
                ? "bg-black text-white"
                : "bg-white/50 text-black/70 hover:text-black"
            }`}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`inline-flex items-center gap-2 px-3 py-1 text-xs border border-black/10 ${
                activeTag === t
                  ? "bg-black text-white"
                  : "bg-white/50 text-black/70 hover:text-black"
              }`}
            >
              <Tag className="w-3 h-3" />
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-black/10 bg-white/40 p-6 text-sm text-black/70">
          No published posts found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {filtered.map((p) => {
            const readMins = estimateReadingMinutes(p.content_md);
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group border border-black/10 bg-white/40 hover:bg-white/55 transition overflow-hidden focus:outline-none"
              >
                {p.cover_image_url ? (
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={p.cover_image_url}
                      alt={p.title || "Post cover"}
                      fill
                      className="object-cover opacity-95 group-hover:opacity-100 transition"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
                  </div>
                ) : (
                  <div className="h-3 bg-black/5" />
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-black/55">
                    <span>{formatDate(p.published_at)}</span>
                    <span className="opacity-40">•</span>
                    <span>{readMins} min read</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-ollin-black">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-black/65 leading-relaxed">
                      {clampText(p.excerpt)}
                    </p>
                  )}
                  {!!p.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center border border-black/10 bg-white/40 px-2.5 py-1 text-[11px] text-black/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 text-xs font-medium text-black/70 group-hover:text-black transition">
                    Read →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
