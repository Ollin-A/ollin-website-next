import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-montserrat text-[clamp(4rem,12vw,8rem)] font-normal tracking-tight leading-none text-ollin-black/20">
        404
      </h1>
      <p className="mt-4 text-lg text-ollin-black/70 max-w-md">
        This page doesn&apos;t exist — or it moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-ollin-black text-white text-sm font-medium rounded-[12px] hover:bg-black/80 transition"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 border border-black/10 text-ollin-black/70 text-sm font-medium rounded-[12px] hover:text-ollin-black transition"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
