export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen pt-32 pb-20 px-[5vw]">
      <div className="max-w-[1500px] mx-auto">{children}</div>
    </div>
  );
}
