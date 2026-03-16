import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Loading } from './components/ui/Loading';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Reflection } from './pages/Reflection';
import { Personality } from './pages/Personality';
import { Careers } from './pages/Careers';
import { Ikigai } from './pages/Ikigai';
import { Progress } from './pages/ProgressTracking';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/"         element={<ErrorBoundary><Home /></ErrorBoundary>} />
        <Route path="/login"    element={<ErrorBoundary><Login /></ErrorBoundary>} />
        <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />

        {/* Protected */}
        <Route path="/dashboard"  element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/reflection" element={<ProtectedRoute><ErrorBoundary><Reflection /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/personality"element={<ProtectedRoute><ErrorBoundary><Personality /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/careers"    element={<ProtectedRoute><ErrorBoundary><Careers /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/ikigai"     element={<ProtectedRoute><ErrorBoundary><Ikigai /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/progress"   element={<ProtectedRoute><ErrorBoundary><Progress /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { loading } = useAuth();

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

  if (loading) {
    return <Loading fullScreen message="Starting ELEVARE..." />;
  }

  return <AnimatedRoutes />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
