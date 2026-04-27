// Loader2 — spinning icon shown when the button is in loading state
import { Loader2 } from 'lucide-react';
// cn — utility for merging Tailwind classes conditionally
import { cn } from '../../lib/utils';

// Button — reusable button component with variant, size, loading, and icon support
// Used throughout the app for all clickable actions
export function Button({
  className,
  children,
  variant = 'primary',  // Visual style: primary, secondary, outline, ghost, success, danger
  size = 'md',          // Size: sm, md, lg
  loading = false,      // Shows spinner and disables button when true
  icon: Icon,           // Optional leading icon component
  ...props
}) {
  // Variant styles — each maps to a different color scheme
  const variants = {
    primary:   'bg-primary text-white hover:bg-indigo-700 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
    outline:   'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost:     'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
    success:   'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm',
    danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  };

  // Size styles — control padding and font size
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2', // Accessibility: visible focus ring
        'disabled:opacity-50 disabled:cursor-not-allowed',                        // Visual feedback when disabled
        variants[variant],
        sizes[size],
        className
      )}
      // Disable button during loading to prevent double-submission
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Show spinner during loading, icon otherwise, or nothing */}
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
