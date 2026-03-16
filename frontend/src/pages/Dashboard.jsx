import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tooltip } from '../components/ui/Tooltip';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { TraitsRadarChart } from '../components/charts/TraitsRadarChart';
import { Sparkles, TrendingUp, Target, MessageSquare, AlertCircle, ArrowRight, CheckCircle, Circle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const traitDescriptions = {
  creativity:        'How often you generate original ideas and think outside the box',
  analyticalThinking:'Your ability to break down complex problems logically',
  communication:     'How clearly and effectively you express your thoughts',
  leadership:        'Your tendency to guide, motivate, and influence others',
  empathy:           'How well you understand and share the feelings of others',
  problemSolving:    'Your skill at finding solutions to difficult challenges',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, recsRes] = await Promise.all([
        api.get('/profile').catch(() => ({ data: { data: null } })),
        api.get('/recommendations').catch(() => ({ data: { data: [] } })),
      ]);
      setProfile(profileRes.data?.data?.profile || profileRes.data?.data || profileRes.data);
      const recsData = recsRes.data?.data || recsRes.data || [];
      setRecommendations((Array.isArray(recsData) ? recsData : []).slice(0, 3));
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const userName          = user?.user?.name || user?.name || 'there';
  const conversationCount = profile?.conversationCount || 0;
  const streak            = profile?.streak || 0;
  const isNewUser         = conversationCount === 0;

  /* Onboarding steps */
  const onboardingSteps = [
    { label: 'Create your account',          done: true },
    { label: 'Complete your first reflection',done: conversationCount >= 1,  action: () => navigate('/reflection'), cta: 'Start Chat' },
    { label: 'Complete 5 reflections',        done: conversationCount >= 5,  action: () => navigate('/reflection'), cta: 'Keep Going' },
    { label: 'View your personality profile', done: !!profile?.personality,  action: () => navigate('/personality'), cta: 'View Profile' },
    { label: 'Get career recommendations',    done: recommendations.length > 0, action: () => navigate('/careers'), cta: 'View Careers' },
  ];
  const onboardingProgress = onboardingSteps.filter(s => s.done).length;
  const onboardingPct      = Math.round((onboardingProgress / onboardingSteps.length) * 100);
  const showOnboarding     = onboardingPct < 100;

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <SkeletonDashboard />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={fetchData}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">

        {/* Welcome banner */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-primary to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
            <CardContent className="py-7 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">
                    {isNewUser ? `Welcome, ${userName}! 🎉` : `Welcome back, ${userName}! 👋`}
                  </h2>
                  <p className="text-white/85 text-sm">
                    {isNewUser
                      ? "Let's start your career discovery journey — it only takes 5 minutes a day"
                      : `You've completed ${conversationCount} reflection${conversationCount !== 1 ? 's' : ''} · ${streak > 0 ? `🔥 ${streak}-day streak` : 'Start a streak today!'}`
                    }
                  </p>
                </div>
                <Sparkles className="w-14 h-14 md:w-16 md:h-16 text-white/20 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Onboarding checklist — shown until 100% complete */}
        {showOnboarding && (
          <motion.div variants={item}>
            <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Getting Started</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{onboardingProgress} of {onboardingSteps.length} steps complete</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{onboardingPct}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${onboardingPct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  {onboardingSteps.map((step, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {step.done
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          : <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                        }
                        <span className={`text-sm ${step.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                          {step.label}
                        </span>
                      </div>
                      {!step.done && step.action && (
                        <Button size="sm" variant="ghost" onClick={step.action} className="text-primary text-xs flex-shrink-0">
                          {step.cta} <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats row */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card hover onClick={() => navigate('/reflection')} className="cursor-pointer group">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{conversationCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reflections</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{streak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{streak === 0 ? 'Start a streak' : `Day streak 🔥`}</p>
              </div>
            </CardContent>
          </Card>

          <Card hover onClick={() => navigate('/careers')} className="cursor-pointer group">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{recommendations.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Career Matches</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Behavioral Traits radar */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Traits</CardTitle>
                <CardDescription>Your personality profile — hover chart points for details</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.behavioralTraits ? (
                  <>
                    <TraitsRadarChart data={profile.behavioralTraits} />
                    {/* Trait score pills with tooltips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {Object.entries(traitDescriptions).map(([key, desc]) => {
                        const val = profile.behavioralTraits?.[key];
                        if (val === undefined) return null;
                        return (
                          <Tooltip key={key} content={desc} position="top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 cursor-default">
                              {key.replace(/([A-Z])/g, ' $1').trim()} · <span className="text-primary font-bold">{val.toFixed(1)}</span>
                            </span>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Start conversations to build your behavioral profile</p>
                    <Button onClick={() => navigate('/reflection')}>Start First Reflection</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Career recommendations */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Career Matches</CardTitle>
                    <CardDescription>Based on your behavioral analysis</CardDescription>
                  </div>
                  {recommendations.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => navigate('/careers')}>
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate('/careers')}
                      className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {rec.careerTitle || rec.title}
                          </h4>
                        </div>
                        <Badge variant={idx === 0 ? 'success' : 'default'}>
                          {Math.round(rec.confidenceScore || rec.score || 0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {rec.reasoning || 'Great match based on your profile'}
                      </p>
                      {rec.matchedTraits?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {rec.matchedTraits.slice(0, 3).map((t, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">No career matches yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Complete 10+ reflections to unlock personalized career matches</p>
                    <Button size="sm" onClick={() => navigate('/reflection')}>Start Reflecting</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
