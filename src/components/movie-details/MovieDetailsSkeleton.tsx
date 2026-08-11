const MovieDetailsSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-slate-900" aria-hidden="true">
    <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:gap-12 lg:p-12">
      <div className="aspect-[2/3] w-36 shrink-0 self-center rounded-xl bg-slate-800 sm:w-44 lg:w-52 lg:self-auto" />
      <div className="flex flex-1 flex-col gap-4">
        <div className="h-10 w-2/3 rounded-xl bg-slate-800 sm:h-12" />
        <div className="h-4 w-1/3 rounded-xl bg-slate-800" />
        <div className="h-6 w-1/2 rounded-xl bg-slate-800" />
        <div className="h-4 w-3/4 rounded-xl bg-slate-800" />
        <div className="h-4 w-2/3 rounded-xl bg-slate-800" />
        <div className="mt-2 flex flex-wrap gap-3">
          <div className="h-12 w-32 rounded-xl bg-slate-800" />
          <div className="h-12 w-40 rounded-xl bg-slate-800" />
        </div>
      </div>
    </div>
  </div>
);

export default MovieDetailsSkeleton;