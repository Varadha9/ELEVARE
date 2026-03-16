import { cn } from '../../lib/utils';

export function Badge({ className, children, variant = 'default', dot = false, ...props }) {
  const variants = {
    default:   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    success:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    error:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    secondary: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    purple:    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  };

  const dotColors = {
    default: 'bg-indigo-500', success: 'bg-emerald-500',
    warning: 'bg-amber-500',  error: 'bg-red-500',
    secondary: 'bg-slate-400', purple: 'bg-purple-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
