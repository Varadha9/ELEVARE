import { cn } from '../../lib/utils';

export function Button({ 
  className, 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200',
    outline: 'border-2 border-primary text-primary hover:bg-primary-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    success: 'bg-accent text-white hover:bg-accent/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
