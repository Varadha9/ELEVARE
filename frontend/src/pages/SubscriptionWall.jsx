import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { subscriptionAPI } from '../services/api';

const FEATURES = [
  'Unlimited AI career conversations',
  'Full personality & Ikigai analysis',
  'Career recommendations with confidence scores',
  'Progress tracking & streak analytics',
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// method: 'upi' opens Razorpay directly on the UPI tab
// method: null  opens Razorpay with all methods (card, UPI, netbanking, wallet)
async function openRazorpay({ user, loadUser, method = null, upiId = '' }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Failed to load payment gateway. Check your internet connection.');

  const { data } = await subscriptionAPI.createOrder();
  if (!data.success) throw new Error(data.error?.message || 'Could not create order');

  const { orderId, amount, currency, keyId } = data.data;

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount,
      currency,
      name: 'ELEVARE',
      description: 'Monthly Subscription – ₹499/month',
      order_id: orderId,
      // Pre-select UPI tab when user clicks "Pay via UPI"
      ...(method === 'upi' && {
        method: { upi: true, card: false, netbanking: false, wallet: false, emi: false },
      }),
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        // Pre-fill UPI ID if user entered one
        vpa: upiId || '',
      },
      config: {
        display: {
          // Show UPI first in the method list
          preferences: { show_default_blocks: true },
          blocks: {
            utib: { name: 'Pay via UPI', instruments: [{ method: 'upi' }] },
            other: { name: 'Other Methods', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }] },
          },
          sequence: ['block.utib', 'block.other'],
        },
      },
      handler: async (response) => {
        try {
          const verifyRes = await subscriptionAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (!verifyRes.data.success) throw new Error('Payment verification failed');
          await loadUser();
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      theme: { color: '#4f46e5' },
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => reject(new Error(resp.error?.description || 'Payment failed')));
    rzp.open();
  });
}

export function SubscriptionWall() {
  const { user, loadUser, logout } = useAuth();
  const [loading, setLoading] = useState(null); // 'upi' | 'all' | null
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const handlePay = async (method) => {
    setError('');
    setLoading(method);
    try {
      await openRazorpay({ user, loadUser, method, upiId });
    } catch (err) {
      if (err.message !== 'Payment cancelled') setError(err.message);
    } finally {
      setLoading(null);
    }
  };

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
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            ₹499<span className="text-base font-normal text-slate-500">/month</span>
          </p>
          <p className="text-sm text-slate-500 mt-1">Cancel anytime · Secure payment via Razorpay</p>
        </div>

        {/* UPI section */}
        <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 mb-4 text-left">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png"
              alt="UPI" className="h-5 object-contain" />
            Pay via UPI
          </p>
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. name@upi) — optional"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 mb-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold disabled:opacity-60"
            onClick={() => handlePay('upi')}
            disabled={!!loading}
          >
            {loading === 'upi' ? 'Opening UPI…' : '⚡ Pay ₹499 via UPI'}
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-slate-200 dark:border-slate-600" />
          <span className="text-xs text-slate-400">or</span>
          <hr className="flex-1 border-slate-200 dark:border-slate-600" />
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold mb-3 disabled:opacity-60"
          onClick={() => handlePay('all')}
          disabled={!!loading}
        >
          {loading === 'all' ? 'Processing…' : '💳 Pay via Card / Netbanking / Wallet'}
        </Button>

        <button onClick={logout} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          Sign out
        </button>
      </div>
    </div>
  );
}
