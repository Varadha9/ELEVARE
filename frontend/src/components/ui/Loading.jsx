// Loader2 — spinning icon from lucide-react
// Sparkles — ELEVARE brand icon shown in the full-screen loader
import { Loader2, Sparkles } from 'lucide-react';
// motion — Framer Motion component for entrance animation
import { motion } from 'framer-motion';

// Loading — reusable loading indicator with two modes:
// fullScreen=true: covers the entire viewport (used during app startup and auth check)
// fullScreen=false: inline spinner (used inside page sections while data loads)
export function Loading({ fullScreen = false, message = 'Loading...' }) {
  if (fullScreen) {
    return (
      // Fixed overlay that covers the entire screen
      <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
        {/* Fade-in + scale animation on mount */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-4">
            {/* Brand icon in the center */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            {/* Spinning ring overlaid on the brand icon */}
            <Loader2 className="w-20 h-20 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin opacity-30" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>
        </motion.div>
      </div>
    );
  }

  // Inline loading state — used inside cards and page sections
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
