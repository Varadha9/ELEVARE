import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Big 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span className="text-[120px] font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-none block">
            404
          </span>
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/dashboard">
            <Button icon={Home}>Go to Dashboard</Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} icon={ArrowLeft}>
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
