import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';
import { PersonalityRadarChart } from '../components/charts/PersonalityRadarChart';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const oceanTraits = [
  { key: 'openness',          label: 'Openness',          desc: 'Curiosity, creativity, and willingness to try new experiences',       color: 'bg-purple-500' },
  { key: 'conscientiousness', label: 'Conscientiousness', desc: 'Organization, responsibility, and goal-oriented behavior',             color: 'bg-blue-500' },
  { key: 'extraversion',      label: 'Extraversion',      desc: 'Sociability, assertiveness, and energy in social situations',          color: 'bg-yellow-500' },
  { key: 'agreeableness',     label: 'Agreeableness',     desc: 'Compassion, cooperation, and trust in others',                        color: 'bg-green-500' },
  { key: 'neuroticism',       label: 'Neuroticism',       desc: 'Emotional stability and stress management (lower = more stable)',      color: 'bg-red-400' },
];

const behavioralTraits = [
  { key: 'creativity',        label: 'Creativity',        icon: '🎨', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { key: 'analyticalThinking',label: 'Analytical',        icon: '🧠', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { key: 'communication',     label: 'Communication',     icon: '💬', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { key: 'leadership',        label: 'Leadership',        icon: '👑', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { key: 'empathy',           label: 'Empathy',           icon: '❤️', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { key: 'motivation',        label: 'Motivation',        icon: '🚀', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { key: 'stressTolerance',   label: 'Stress Tolerance',  icon: '🧘', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { key: 'problemSolving',    label: 'Problem Solving',   icon: '🔧', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
];

export function Personality() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      // Fix: correct data path
      setProfile(res.data?.data?.profile || res.data?.data || res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasPersonality = profile?.personality && Object.values(profile.personality).some(v => v > 0);
  const hasBehavioral  = profile?.behavioralTraits && Object.values(profile.behavioralTraits).some(v => v > 0);

  const topStrength = hasBehavioral
    ? Object.entries(profile.behavioralTraits).sort(([,a],[,b]) => b - a)[0]?.[0]
    : null;
  const growthArea = hasBehavioral
    ? Object.entries(profile.behavioralTraits).sort(([,a],[,b]) => a - b)[0]?.[0]
    : null;

  if (loading) return <DashboardLayout title="Personality Profile"><Loading fullScreen message="Loading your profile..." /></DashboardLayout>;

  return (
    <DashboardLayout title="Personality Profile">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Big Five */}
        <Card>
          <CardHeader>
            <CardTitle>Big Five Personality (OCEAN)</CardTitle>
            <CardDescription>Your personality profile based on the OCEAN model</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasPersonality ? (
              <div className="text-center py-12">
                <MessageSquare className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Complete more reflections to build your personality profile</p>
                <Button onClick={() => navigate('/reflection')}>Start Reflecting</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PersonalityRadarChart data={profile.personality} />
                <div className="space-y-3">
                  {oceanTraits.map(t => {
                    const val = profile.personality?.[t.key] || 0;
                    return (
                      <div key={t.key} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 capitalize">{t.label}</h4>
                          <Badge variant="secondary">{val.toFixed(1)}/10</Badge>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden mb-1.5">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${val * 10}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full ${t.color} rounded-full`}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Behavioral Traits */}
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Traits</CardTitle>
            <CardDescription>Skills and characteristics identified through your reflections</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasBehavioral ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No behavioral data yet — start chatting with the AI</p>
                <Button onClick={() => navigate('/reflection')}>Go to Reflection</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {behavioralTraits.map(t => {
                  const val = profile.behavioralTraits?.[t.key] || 0;
                  return (
                    <motion.div
                      key={t.key}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${t.color}`}>{t.icon}</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{val.toFixed(1)}/10</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-slate-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${val * 10}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        {(topStrength || growthArea) && (
          <Card>
            <CardHeader>
              <CardTitle>Personality Insights</CardTitle>
              <CardDescription>What your profile reveals about you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1 text-sm">🌟 Top Strength</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{topStrength?.replace(/([A-Z])/g, ' $1')}</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1 text-sm">📈 Growth Area</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{growthArea?.replace(/([A-Z])/g, ' $1')}</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-1 text-sm">💡 Tip</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Continue daily reflections to refine your profile</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
