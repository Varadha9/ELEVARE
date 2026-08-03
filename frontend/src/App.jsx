// React Router — handles client-side navigation without full page reloads
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// AnimatePresence — enables exit animations when routes change
import { AnimatePresence } from 'framer-motion';
// Global auth state provider and hook
import { AuthProvider, useAuth } from './context/AuthContext';
// Global toast notification system
import { ToastProvider } from './components/ui/Toast';
// Catches unhandled React errors and shows a friendly fallback UI
import { ErrorBoundary } from './components/ui/ErrorBoundary';
// Full-screen loading spinner shown while auth state is being determined
import { Loading } from './components/ui/Loading';

// Page imports
import { Home }        from './pages/Home';
import { Login }       from './pages/Login';
import { Register }    from './pages/Register';
import { Dashboard }   from './pages/Dashboard';
import { Reflection }  from './pages/Reflection';
import { Personality } from './pages/Personality';
import { Careers }     from './pages/Careers';
import { Ikigai }      from './pages/Ikigai';
import { Progress }    from './pages/ProgressTracking';
import { Settings }    from './pages/Settings';
import { NotFound }    from './pages/NotFound';
import { SubscriptionWall } from './pages/SubscriptionWall';
import { AdminDashboard }   from './pages/AdminDashboard';

// RenewalBanner — shows for active subscribers within 7 days of expiry
function RenewalBanner() {
  const { user } = useAuth();
  if (!user || user.role === 'admin' || user.subscriptionStatus !== 'active') return null;
  const days = user.subDaysLeft;
  if (days === null || days === undefined || days > 7) return null;
  return (
    <div className="bg-orange-500 text-white text-center text-sm py-2 px-4">
      ⚠️ Your subscription expires in <strong>{days} day{days !== 1 ? 's' : ''}</strong> —{' '}
      <button onClick={() => window.location.href = '/subscribe'} className="underline font-semibold">Renew now</button>
    </div>
  );
}

// TrialBanner — shows days remaining for trial users
function TrialBanner() {
  const { user } = useAuth();
  if (!user || user.role === 'admin' || user.subscriptionStatus !== 'trial') return null;
  const days = user.trialDaysLeft ?? 7;
  if (days <= 0) return null;
  const urgent = days <= 2;
  return (
    <div className={`${urgent ? 'bg-red-600' : 'bg-indigo-600'} text-white text-center text-sm py-2 px-4`}>
      {urgent ? '⚠️' : '🎉'} Free trial:{' '}
      <strong>{days} day{days !== 1 ? 's' : ''}</strong> remaining —{' '}
      <button onClick={() => window.location.href = '/subscribe'} className="underline font-semibold">Subscribe now</button>
    </div>
  );
}

// AdminRoute — redirects non-admin users away from admin pages
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// ProtectedRoute — redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// AnimatedRoutes — renders routes with page transition animations
// useLocation is needed so AnimatePresence can detect route changes
function AnimatedRoutes() {
  const location = useLocation();
  return (
    // mode="wait" ensures the exit animation completes before the next page enters
    <AnimatePresence mode="wait">
      {/* key={location.pathname} forces re-mount on route change, triggering animations */}
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<ErrorBoundary><Home /></ErrorBoundary>} />
        <Route path="/login"    element={<ErrorBoundary><Login /></ErrorBoundary>} />
        <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
        <Route path="/subscribe" element={<ErrorBoundary><SubscriptionWall /></ErrorBoundary>} />
        <Route path="/admin"    element={<AdminRoute><ErrorBoundary><AdminDashboard /></ErrorBoundary></AdminRoute>} />

        <Route path="/dashboard"   element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/reflection"  element={<ProtectedRoute><ErrorBoundary><Reflection /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/personality" element={<ProtectedRoute><ErrorBoundary><Personality /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/careers"     element={<ProtectedRoute><ErrorBoundary><Careers /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/ikigai"      element={<ProtectedRoute><ErrorBoundary><Ikigai /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/progress"    element={<ProtectedRoute><ErrorBoundary><Progress /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/settings"    element={<ProtectedRoute><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

// AppContent — reads auth loading state and shows spinner until auth is resolved
// Prevents a flash of the login page before the token is validated
function AppContent() {
  const { loading } = useAuth();

  // Restore dark mode preference from localStorage on app startup
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

  // Show full-screen loader while checking if the user is already logged in
  if (loading) {
    return <Loading fullScreen message="Starting ELEVARE..." />;
  }

  return (
    <>
      <RenewalBanner />
      <TrialBanner />
      <AnimatedRoutes />
    </>
  );
}

// App — root component that wraps everything with global providers
// Order matters: AuthProvider must wrap Router so auth state is available in route components
function App() {
  return (
    <AuthProvider>       {/* Provides user/login/logout to all components */}
      <ToastProvider>    {/* Provides toast() notification function globally */}
        <Router>         {/* Enables client-side routing */}
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
