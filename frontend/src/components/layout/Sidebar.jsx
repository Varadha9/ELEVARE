import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, User, Lightbulb,
  Target, TrendingUp, Settings, X, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navGroups = [
  {
    label: 'Discover',
    items: [
      { icon: MessageSquare, label: 'AI Reflection', path: '/reflection' },
      { icon: Lightbulb,     label: 'Careers',       path: '/careers' },
      { icon: Target,        label: 'Ikigai',         path: '/ikigai' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard' },
      { icon: User,            label: 'Personality', path: '/personality' },
      { icon: TrendingUp,      label: 'Progress',    path: '/progress' },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
  },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-50',
          'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700',
          'flex flex-col transition-all duration-300',
          'w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'lg:w-20 lg:hover:w-64 group/sidebar overflow-hidden'
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent whitespace-nowrap lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200">
              ELEVARE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation groups */}
        <nav className="flex-1 py-3 overflow-y-auto" aria-label="Sidebar navigation">
          {navGroups.map((group) => (
            <div key={group.label} className="px-3 mb-1">
              {/* Group label — only visible when expanded */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 py-2 whitespace-nowrap lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                {group.label}
              </p>

              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    title={item.label}
                    aria-label={item.label}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item outline-none',
                        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-indigo-400'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                            !isActive && 'group-hover/item:scale-110'
                          )}
                        />
                        <span className="font-medium text-sm whitespace-nowrap lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200">
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 lg:group-hover/sidebar:hidden" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Divider between groups — only when collapsed */}
              <div className="mt-2 mb-1 border-t border-slate-100 dark:border-slate-800 lg:group-hover/sidebar:hidden" />
            </div>
          ))}
        </nav>

        {/* Collapse hint */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 lg:group-hover/sidebar:hidden hidden lg:flex justify-center">
          <div className="w-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
      </aside>
    </>
  );
}
