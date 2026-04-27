// motion — Framer Motion component for page transition animations
import { motion } from 'framer-motion';

// PageTransition — wraps page content with a smooth fade + slide animation
// Used in DashboardLayout to animate between route changes
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}   // Start slightly below and invisible
      animate={{ opacity: 1, y: 0 }}    // Slide up and fade in
      exit={{ opacity: 0, y: -8 }}      // Slide up and fade out on exit
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
