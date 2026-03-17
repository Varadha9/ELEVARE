import { cn } from '../../lib/utils';

export function Progress({ value = 0, className, showLabel = false }) {
  return (
    <div className="w-full">
      <div className={cn("h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", className)}>
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">{value}%</span>
      )}
    </div>
  );
}
