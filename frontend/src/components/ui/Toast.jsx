// React context and state for managing the global toast queue
import { createContext, useContext, useState } from 'react';
// motion — animated toast entry/exit; AnimatePresence — handles unmount animations
import { motion, AnimatePresence } from 'framer-motion';
// Icons for each toast type
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// ToastContext — shared state that lets any component trigger a toast notification
const ToastContext = createContext();

// useToast — custom hook to access toast.success / toast.error / etc. from any component
// Throws if used outside ToastProvider to catch developer mistakes early
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// ToastProvider — wraps the app and manages the list of active toasts
// Renders all toasts in a fixed top-right container
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]); // Array of active toast objects

  // addToast — adds a new toast and auto-removes it after 5 seconds
  const addToast = (message, type = 'info') => {
    const id = Date.now(); // Unique ID based on timestamp
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000); // Auto-dismiss after 5s
  };

  // removeToast — filters out the toast with the given ID
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose typed shorthand methods so callers don't need to pass type manually
  const toast = {
    success: (message) => addToast(message, 'success'),
    error:   (message) => addToast(message, 'error'),
    warning: (message) => addToast(message, 'warning'),
    info:    (message) => addToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Fixed container — toasts stack vertically in the top-right corner */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* AnimatePresence enables exit animations when toasts are removed */}
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Toast — individual notification pill with icon, message, and close button
function Toast({ message, type, onClose }) {
  // Map each type to its corresponding icon component
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error:   <XCircle    className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info:    <Info        className="w-5 h-5 text-blue-600" />,
  };

  // Map each type to its background and border color classes
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error:   'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    info:    'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  };

  return (
    // Animated toast — slides down and fades in on mount, fades out on dismiss
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md ${colors[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{message}</p>
      {/* Manual close button — allows dismissing before the 5s auto-dismiss */}
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
