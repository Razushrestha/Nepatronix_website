export default function BlogLoading() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Skeleton */}
      <div className="relative bg-[#020617] px-6 py-20 lg:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="h-6 w-20 bg-white/10 rounded-full mx-auto animate-pulse"></div>
          <div className="h-12 w-3/4 bg-white/10 rounded-xl mx-auto animate-pulse sm:h-16"></div>
          <div className="h-6 w-1/2 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
          <div className="h-14 w-full max-w-lg bg-white/10 rounded-xl mx-auto animate-pulse"></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 mb-20">
          {/* Main skeleton */}
          <div className="lg:col-span-2 aspect-video bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
          {/* Side skeleton */}
          <div className="lg:col-span-1 space-y-8">
            <div className="h-full bg-white rounded-3xl animate-pulse border border-slate-100"></div>
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="h-12 w-96 bg-white rounded-full mx-auto mb-12 animate-pulse shadow-sm"></div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <div className="aspect-video bg-slate-100 animate-pulse"></div>
              <div className="p-8 space-y-4">
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-slate-100 rounded animate-pulse"></div>
                <div className="h-20 w-full bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
