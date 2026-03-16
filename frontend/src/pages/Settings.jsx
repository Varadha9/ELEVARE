import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Moon, Sun, Bell, Lock, Trash2, User, Mail, Download, Shield, Eye, EyeOff, Save, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <div>
        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        aria-checked={enabled}
        role="switch"
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );
}

function StatusBanner({ message, type, onDismiss }) {
  if (!message) return null;
  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    error:   'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info:    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };
  const Icon = type === 'success' ? CheckCircle : XCircle;
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${styles[type]}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </motion.div>
  );
}

const inputCls = 'w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm bg-white dark:bg-slate-700 dark:text-gray-100';

export function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode]     = useState(() => document.documentElement.classList.contains('dark'));
  const [notifs, setNotifs]         = useState(() => localStorage.getItem('notifications') !== 'false');
  const [emailNotifs, setEmailNotifs] = useState(() => localStorage.getItem('emailNotifications') !== 'false');
  const [profile, setProfile]       = useState({ name: user?.user?.name || user?.name || '', email: user?.user?.email || user?.email || '' });
  const [passwords, setPasswords]   = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState({ text: '', type: '' });

  /* Dark mode — toggle CSS class on <html> */
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else          document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('notifications', notifs);
    localStorage.setItem('emailNotifications', emailNotifs);
  }, [notifs, emailNotifs]);

  const flash = (text, type = 'success') => {
    setStatus({ text, type });
    setTimeout(() => setStatus({ text: '', type: '' }), 4000);
  };

  const saveProfile = async () => {
    if (!profile.name.trim()) { flash('Name cannot be empty', 'error'); return; }
    setLoading(true);
    try {
      await api.put('/profile', profile);
      flash('Profile updated successfully!');
    } catch (err) {
      flash(err.response?.data?.message || 'Error updating profile', 'error');
    } finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) { flash('All fields are required', 'error'); return; }
    if (passwords.new.length < 6) { flash('New password must be at least 6 characters', 'error'); return; }
    if (passwords.new !== passwords.confirm) { flash('Passwords do not match', 'error'); return; }
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.new });
      flash('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      flash(err.response?.data?.message || 'Error changing password', 'error');
    } finally { setLoading(false); }
  };

  const exportData = async () => {
    try {
      const res = await api.get('/profile/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `elevare-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click(); URL.revokeObjectURL(url);
      flash('Data exported!');
    } catch { flash('Error exporting data', 'error'); }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Permanently delete your account and all data? This cannot be undone.')) return;
    if (window.prompt('Type DELETE to confirm:') !== 'DELETE') { flash('Cancelled', 'info'); return; }
    try {
      await api.delete('/auth/account');
      logout(); navigate('/');
    } catch { flash('Error deleting account', 'error'); }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-5">

        <AnimatePresence>
          {status.text && <StatusBanner message={status.text} type={status.type} onDismiss={() => setStatus({ text: '', type: '' })} />}
        </AnimatePresence>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-4 h-4" /> Account Information</CardTitle>
            <CardDescription>Update your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className={inputCls} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className={`${inputCls} pl-10`} placeholder="you@example.com" />
              </div>
            </div>
            <Button onClick={saveProfile} loading={loading} icon={Save}>{!loading && 'Save Changes'}</Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Appearance
            </CardTitle>
            <CardDescription>Customize your visual experience</CardDescription>
          </CardHeader>
          <CardContent>
            <Toggle enabled={darkMode} onChange={setDarkMode} label="Dark Mode" description="Switch between light and dark themes" />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle>
            <CardDescription>Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Toggle enabled={notifs}      onChange={setNotifs}      label="Daily Reminders"  description="Get reminded to complete your daily reflections" />
            <Toggle enabled={emailNotifs} onChange={setEmailNotifs} label="Email Updates"    description="Receive weekly progress reports and insights" />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="w-4 h-4" /> Security</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                placeholder="Current password" className={`${inputCls} pl-10 pr-10`} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input type="password" value={passwords.new}
              onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
              placeholder="New password (min. 6 characters)" className={inputCls} />
            <input type="password" value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              placeholder="Confirm new password" className={inputCls} />
            <Button onClick={changePassword} loading={loading} variant="secondary">
              {!loading && 'Change Password'}
            </Button>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4" /> Data & Privacy</CardTitle>
            <CardDescription>Manage your personal data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3 mb-3">
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Export Your Data</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    Download all conversations, analysis, and recommendations as JSON
                  </p>
                </div>
              </div>
              <Button onClick={exportData} variant="outline" size="sm" icon={Download}>Export Data</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">Delete Account</p>
              <p className="text-xs text-red-700 dark:text-red-300 mb-3">
                Permanently deletes your account and all data. Cannot be undone.
              </p>
              <Button variant="danger" size="sm" onClick={deleteAccount} icon={Trash2}>Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
