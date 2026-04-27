// useState — tracks whether the mobile sidebar is open or closed
import { useState } from 'react';
// Sidebar — collapsible navigation panel
import { Sidebar } from './Sidebar';
// Navbar — top bar with page title, notifications, and user menu
import { Navbar } from './Navbar';
// PageTransition — wraps page content with a fade+slide animation on route change
import { PageTransition } from '../ui/PageTransition';
// Menu — hamburger icon for the mobile sidebar toggle button
import { Menu } from 'lucide-react';

// DashboardLayout — shared shell used by all authenticated pages
// Provides: sidebar navigation, top navbar, and animated page content area
// children — the page-specific content rendered inside the main area
// title — passed to Navbar to display the current page name
export function DashboardLayout({ children, title }) {
  // sidebarOpen — controls mobile sidebar visibility (hidden by default on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile hamburger button — only visible on screens smaller than lg (1024px)
          Fixed position so it stays accessible while scrolling */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </button>

      {/* Sidebar — on desktop it's always visible (collapsed to icons); on mobile it slides in */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area — offset by sidebar width (lg:ml-20) on desktop */}
      <div className="lg:ml-20 transition-all duration-300 flex flex-col min-h-screen">
        {/* Navbar — sticky top bar with page title and user controls */}
        <Navbar title={title} />
        {/* main — flex-1 makes it fill remaining vertical space */}
        <main className="flex-1 p-4 md:p-6">
          {/* PageTransition — wraps content with enter/exit animations */}
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
