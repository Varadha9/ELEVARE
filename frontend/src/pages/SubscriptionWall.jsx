import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function SubscriptionWall() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Your Free Trial Has Ended
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Hi {user?.name}, your 7-day free trial is over. Subscribe to keep discovering your career path with ELEVARE.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-5 mb-6 text-left">
          <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">What you get with a subscription:</p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {['Unlimited AI career conversations', 'Full personality & Ikigai analysis', 'Career recommendations with confidence scores', 'Progress tracking & streak analytics'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">₹499<span className="text-base font-normal text-slate-500">/month</span></p>
          <p className="text-sm text-slate-500 mt-1">Cancel anytime</p>
        </div>

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold mb-3"
          onClick={() => alert('Payment integration coming soon! Contact admin@elevare.com to activate your subscription.')}
        >
          Subscribe Now
        </Button>
        <button onClick={logout} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          Sign out
        </button>
      </div>
    </div>
  );
}
