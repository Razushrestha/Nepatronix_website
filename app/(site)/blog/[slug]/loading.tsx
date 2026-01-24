export default function PostLoading() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Skeleton */}
      <div className="relative bg-[#020617] px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="h-4 w-24 bg-white/10 rounded-full mx-auto animate-pulse"></div>
          <div className="h-12 w-full bg-white/10 rounded-xl mx-auto animate-pulse"></div>
          <div className="h-4 w-40 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        {/* Image Skeleton */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-3xl animate-pulse"></div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-3xl p-8 md:p-12 space-y-6 border border-slate-100 shadow-sm">
          <div className="h-6 w-full bg-slate-100 rounded animate-pulse"></div>
          <div className="h-6 w-5/6 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-6 w-full bg-slate-100 rounded animate-pulse"></div>
          <div className="h-32 w-full bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-6 w-4/6 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-6 w-full bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
