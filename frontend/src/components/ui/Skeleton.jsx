// cn — utility for merging Tailwind classes conditionally
import { cn } from '../../lib/utils';

// Skeleton — base animated placeholder block shown while content is loading
// Uses animate-pulse to create a pulsing shimmer effect
// Prevents layout shift by occupying the same space as the real content
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg', className)}
      {...props}
    />
  );
}

// SkeletonCard — placeholder for a single data card (icon + title + text lines)
// Used in SkeletonList and SkeletonDashboard while API data loads
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" /> {/* Icon placeholder */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />           {/* Title placeholder */}
          <Skeleton className="h-3 w-1/3" />           {/* Subtitle placeholder */}
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />         {/* Text line 1 */}
      <Skeleton className="h-3 w-4/5" />               {/* Text line 2 (shorter for realism) */}
    </div>
  );
}

// SkeletonDashboard — full dashboard layout placeholder
// Shown while the Dashboard page fetches profile and recommendation data
export function SkeletonDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome banner placeholder */}
      <Skeleton className="h-32 w-full rounded-2xl" />
      {/* Stats row — 3 cards side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1,2,3].map(i => <SkeletonCard key={i} />)}
      </div>
      {/* Main content grid — 2 large cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

// SkeletonList — renders N skeleton cards in a vertical list
// Used on the Careers page while recommendations are loading
export function SkeletonList({ rows = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
