// useState — controls tooltip visibility; useRef — references the wrapper element
import { useState, useRef, useEffect } from 'react';
// motion — animated tooltip appearance; AnimatePresence — handles unmount animation
import { motion, AnimatePresence } from 'framer-motion';

// Tooltip — shows a small floating label when hovering or focusing a child element
// Used on Dashboard trait pills to explain what each trait means
export function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false); // Controls whether tooltip is shown
  const ref = useRef(null);                       // Reference to the wrapper div

  // CSS classes for each tooltip position relative to the trigger element
  const positions = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2', // Above the element
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',   // Below the element
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',  // Left of the element
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',   // Right of the element
  };

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      // Show tooltip on mouse hover
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      // Also show on keyboard focus for accessibility
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {/* AnimatePresence enables the fade-out animation when tooltip hides */}
      <AnimatePresence>
        {visible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            // pointer-events-none prevents the tooltip itself from triggering mouse events
            className={`absolute z-50 ${positions[position]} pointer-events-none`}
          >
            <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap max-w-[200px] text-center shadow-lg">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
