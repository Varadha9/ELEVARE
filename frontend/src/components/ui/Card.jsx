// cn — utility for merging Tailwind classes conditionally
import { cn } from '../../lib/utils';

// Card — base container component used throughout the dashboard
// Supports glass morphism effect and hover lift animation
export function Card({ className, children, glass = false, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        // glass=true: semi-transparent with backdrop blur (used on hero sections)
        // glass=false: solid white/dark background (used for data cards)
        glass
          ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-white/20'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        // hover=true: adds lift effect on mouse over (used for clickable cards)
        hover && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        'shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// CardHeader — top section of a card, contains title and description
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pt-6 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

// CardTitle — main heading inside a card
export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)} {...props}>
      {children}
    </h3>
  );
}

// CardDescription — subtitle or helper text below the card title
export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-slate-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

// CardContent — main body area of a card with consistent padding
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-6 py-6', className)} {...props}>
      {children}
    </div>
  );
}
