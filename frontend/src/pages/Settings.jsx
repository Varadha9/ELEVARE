import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Moon, Sun, Bell, Lock, Trash2, User, Mail, 
  Download, Shield, Eye, EyeOff, Save, Check, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export function Settings() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications') !== 'false');
  const [emailNotifications, setEmailNotifications] = useState(() => localStorage.getItem('emailNotifications') !== 'false');
  
  const [profile, setProfile] = useState({
    name: user?.user?.name || user?.name || '',
    email: user?.user?.email || user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('notifications', notifications);
    localStorage.setItem('emailNotifications', emailNotifications);
  }, [notifications, emailNotifications]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleProfileUpdate = async () => {
    if (!profile.name.trim()) {
      showMessage('Name cannot be empty', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/profile', profile);
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      showMessage('All password fields are required', 'error');
      return;
    }
    
    if (passwordData.new.length < 6) {
      showMessage('New password must be at least 6 characters', 'error');
      return;
    }
    
    if (passwordData.new !== passwordData.confirm) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      showMessage('Password changed successfully!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error changing password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await api.get('/profile/export');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elevare-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('Data exported successfully!', 'success');
    } catch (error) {
      showMessage('Error exporting data', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account?\n\n' +
      'This will permanently delete:\n' +
      '• All your conversations\n' +
      '• Your behavioral analysis data\n' +
      '• Career recommendations\n' +
      '• All progress tracking\n\n' +
      'This action CANNOT be undone!'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
    if (doubleConfirm !== 'DELETE') {
      showMessage('Account deletion cancelled', 'info');
      return;
    }
    
    try {
      await api.delete('/auth/account');
      showMessage('Account deleted successfully', 'success');
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      showMessage('Error deleting account', 'error');
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{label}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          enabled ? 'bg-primary shadow-lg' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success/Error Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
            <CardDescription>Update your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-800 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-800 dark:text-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <Button 
              onClick={handleProfileUpdate} 
              disabled={loading} 
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize your visual experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleSwitch
              enabled={darkMode}
              onChange={setDarkMode}
              label="Dark Mode"
              description="Switch between light and dark themes"
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ToggleSwitch
              enabled={notifications}
              onChange={setNotifications}
              label="Daily Reminders"
              description="Get reminded to complete your daily reflections"
            />
            <ToggleSwitch
              enabled={emailNotifications}
              onChange={setEmailNotifications}
              label="Email Updates"
              description="Receive weekly progress reports and insights"
            />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  placeholder="Current password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <input
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                placeholder="New password (min. 6 characters)"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-800 dark:text-white"
              />
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-800 dark:text-white"
              />
              <Button onClick={handlePasswordChange} disabled={loading}>
                {loading ? 'Updating...' : 'Change Password'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Manage your personal data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3 mb-3">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Export Your Data</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Download all your conversations, behavioral analysis, and recommendations in JSON format
                  </p>
                </div>
              </div>
              <Button onClick={handleDataExport} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 dark:text-red-100">Delete Account</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Permanently delete your account and all data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
