// React hooks for state, side effects, refs, and memoized callbacks
import { useState, useEffect, useRef, useCallback } from 'react';
// Lucide icons for the navbar UI elements
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
// Auth context — provides current user data and logout function
import { useAuth } from '../../context/AuthContext';
// useNavigate — programmatic navigation after logout or menu clicks
import { useNavigate } from 'react-router-dom';
// Shared axios instance with JWT interceptor
import api from '../../services/api';

// Navbar — sticky top bar shown on all authenticated pages
// Displays the page title, notification bell, and user dropdown menu
export function Navbar({ title = 'Dashboard' }) {
  const [showDropdown, setShowDropdown]         = useState(false); // User menu open/closed
  const [showNotifications, setShowNotifications] = useState(false); // Notification panel open/closed
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Refs used to detect clicks outside the dropdowns (click-away to close)
  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);

  // Derive display name and initials from the user object
  // Handles both nested (user.user.name) and flat (user.name) structures
  const userName = user?.user?.name || user?.name || 'User';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Close dropdowns when clicking outside them (mousedown fires before blur)
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdowns when pressing Escape — keyboard accessibility
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setShowDropdown(false); setShowNotifications(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // handleLogout — closes dropdown, calls auth logout, then redirects to login
  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  const [notifications, setNotifications] = useState([]);
  // readIds — persisted in localStorage so read state survives page refreshes
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('elevare_read_notifs') || '[]'); } catch { return []; }
  });

  // buildNotifications — fetches profile, conversations, and recommendations in parallel
  // then generates contextual notification messages based on the data
  const buildNotifications = useCallback(async () => {
    try {
      // Promise.allSettled — continues even if some requests fail
      const [profileRes, historyRes, recsRes] = await Promise.allSettled([
        api.get('/profile'),
        api.get('/conversations/history'),
        api.get('/recommendations'),
      ]);

      const profile = profileRes.status === 'fulfilled' ? profileRes.value.data?.data?.profile : null;
      const convs   = historyRes.status === 'fulfilled' ? (historyRes.value.data?.data?.conversations || []) : [];
      const recs    = recsRes.status === 'fulfilled'    ? (recsRes.value.data?.data || []) : [];

      const notifs = [];

      // Remind user to reflect if they haven't chatted today
      const todayStr     = new Date().toDateString();
      const chattedToday = convs.some(c => new Date(c.timestamp).toDateString() === todayStr);
      if (!chattedToday) {
        notifs.push({ id: 'daily', text: 'Complete your daily reflection', time: 'Today', unread: true });
      }

      // Notify when career matches are available
      if (recs.length > 0) {
        notifs.push({ id: 'careers', text: `${recs.length} career matches ready for you!`, time: 'Updated', unread: true });
      }

      // Encourage profile completion if below 80%
      const completeness = profile?.profileCompleteness ?? 0;
      if (completeness < 80) {
        notifs.push({ id: 'profile', text: `Your profile is ${completeness}% complete — keep reflecting!`, time: 'Tip', unread: completeness < 40 });
      }

      // Celebrate streak milestones every 3 days
      const streak = profile?.streak ?? 0;
      if (streak > 0 && streak % 3 === 0) {
        notifs.push({ id: `streak-${streak}`, text: `🔥 ${streak}-day streak! Keep it up!`, time: 'Achievement', unread: true });
      }

      setNotifications(notifs);
    } catch { /* Silent fail — notifications are non-critical */ }
  }, []);

  // Fetch notifications once on mount
  useEffect(() => { buildNotifications(); }, [buildNotifications]);

  // Count unread notifications that haven't been manually dismissed
  const unreadCount = notifications.filter(n => n.unread && !readIds.includes(n.id)).length;

  // markAllRead — persists all notification IDs as read in localStorage
  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    localStorage.setItem('elevare_read_notifs', JSON.stringify(ids));
    setReadIds(ids);
  };

  return (
    // sticky top-0 — navbar stays visible while scrolling; z-40 keeps it above page content
    <nav className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Page title — passed from DashboardLayout */}
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 pl-10 lg:pl-0">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Notification bell with unread count badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(v => !v); setShowDropdown(false); }}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label={`${unreadCount} unread notifications`}
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {/* Red badge — only shown when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">{unreadCount}</span>
              </span>
            )}
          </button>

          {/* Notification dropdown panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-in">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Notifications</h3>
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline" onClick={markAllRead}>Mark all read</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-700 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">You're all caught up!</div>
                ) : notifications.map(n => {
                  const isRead = readIds.includes(n.id);
                  return (
                    // Highlight unread notifications with a subtle indigo background
                    <div key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${n.unread && !isRead ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : ''}`}>
                      {/* Colored dot — filled for unread, grey for read */}
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread && !isRead ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{n.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            {/* Avatar circle with user initials */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-700 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            {/* Name — hidden on small screens to save space */}
            <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">{userName}</span>
            {/* Chevron rotates 180° when dropdown is open */}
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* User dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-slide-in">
              {/* User info header */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.user?.email || user?.email || ''}</p>
              </div>
              {/* Profile and Settings both navigate to /settings */}
              <button onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                <User className="w-4 h-4 text-slate-400" /> Profile
              </button>
              <button onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                <Settings className="w-4 h-4 text-slate-400" /> Settings
              </button>
              <hr className="my-1 border-slate-100 dark:border-slate-700" />
              {/* Sign out — red color signals a destructive/exit action */}
              <button onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
