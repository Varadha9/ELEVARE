import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  User,
  Lightbulb,
  Target,
  TrendingUp,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard' },
  { icon: MessageSquare,   label: 'AI Reflection', path: '/reflection' },
  { icon: User,            label: 'Personality',  path: '/personality' },
  { icon: Lightbulb,       label: 'Careers',      path: '/careers' },
  { icon: Target,          label: 'Ikigai',       path: '/ikigai' },
  { icon: TrendingUp,      label: 'Progress',     path: '/progress' },
  { icon: Settings,        label: 'Settings',     path: '/settings' },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50',
          'flex flex-col transition-all duration-300',
          /* mobile: slide in/out as full-width drawer */
          'w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          /* desktop: collapsed (w-20) by default, expand on hover */
          'lg:w-20 lg:hover:w-64 group/sidebar overflow-hidden'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {/* Label visible on mobile always; on desktop only when sidebar is hovered */}
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent whitespace-nowrap lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200">
              ELEVARE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item',
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary'
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
                  {/* Active dot indicator when collapsed */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 lg:group-hover/sidebar:hidden" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom hint — only visible on desktop collapsed state */}
        <div className="p-3 border-t border-gray-100 lg:group-hover/sidebar:hidden hidden lg:flex justify-center">
          <div className="w-1 h-8 bg-gray-200 rounded-full" />
        </div>
      </aside>
    </>
  );
}
