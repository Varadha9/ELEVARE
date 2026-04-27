// useEffect for side effects, useRef for focusing the cancel button on open
import { useEffect, useRef } from 'react';
// motion — animated modal entry/exit; AnimatePresence — handles unmount animations
import { motion, AnimatePresence } from 'framer-motion';
// AlertTriangle — warning icon shown in the modal header
import { AlertTriangle, X } from 'lucide-react';
// Button — reusable button component for confirm/cancel actions
import { Button } from './Button';

// ConfirmModal — accessible confirmation dialog used before destructive actions
// e.g. deleting an account — prevents accidental clicks
export function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }) {
  // cancelRef — used to auto-focus the cancel button when modal opens
  // This is an accessibility best practice: default focus on the safe action
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus(); // Focus cancel button when modal opens
    // Allow closing the modal with the Escape key for keyboard accessibility
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler); // Cleanup on unmount
  }, [open, onCancel]);

  return (
    // AnimatePresence enables the exit animation when open becomes false
    <AnimatePresence>
      {open && (
        // z-[100] ensures the modal appears above all other UI elements including the navbar
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop — semi-transparent overlay; clicking it cancels the action */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* Modal panel — appears above the backdrop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            {/* X button in top-right corner for quick dismissal */}
            <button onClick={onCancel} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
              <X className="w-4 h-4" />
            </button>

            {/* Icon + title + message */}
            <div className="flex items-start gap-4 mb-5">
              {/* Icon color changes based on variant: danger=red, warning=amber */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
              </div>
            </div>

            {/* Action buttons — cancel is focused by default for safety */}
            <div className="flex gap-3 justify-end">
              <Button ref={cancelRef} variant="secondary" size="sm" onClick={onCancel}>{cancelLabel}</Button>
              <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
