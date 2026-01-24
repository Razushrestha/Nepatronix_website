export default function BlogLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Skeleton */}
      <div className="relative bg-[#020617] px-6 pt-48 pb-32 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="h-6 w-32 bg-white/10 rounded-full animate-pulse mx-auto"></div>
            <div className="h-20 w-full bg-white/10 rounded-2xl animate-pulse"></div>
            <div className="h-16 w-full max-w-2xl bg-white/10 rounded-2xl animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 -mt-16 relative z-20 pb-24">
        <div className="pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-20">
            {/* Main skeleton */}
            <div className="lg:col-span-8 h-[600px] bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>
            {/* Side skeleton */}
            <div className="lg:col-span-4 h-[600px] bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
              <div className="aspect-video bg-slate-100 animate-pulse"></div>
              <div className="p-8 space-y-6">
                <div className="h-4 w-24 bg-slate-50 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-slate-50 rounded animate-pulse"></div>
                <div className="h-20 w-full bg-slate-50 rounded animate-pulse"></div>
                <div className="flex justify-between items-center">
                   <div className="h-8 w-24 bg-slate-50 rounded animate-pulse"></div>
                   <div className="h-8 w-8 bg-slate-50 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
