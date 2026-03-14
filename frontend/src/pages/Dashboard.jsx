import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Loading } from '../components/ui/Loading';
import { TraitsRadarChart } from '../components/charts/TraitsRadarChart';
import { Sparkles, TrendingUp, Target, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, recsRes] = await Promise.all([
        api.get('/profile').catch(() => ({ data: { data: null } })),
        api.get('/recommendations').catch(() => ({ data: { data: [] } }))
      ]);

      const profileData = profileRes.data?.data?.profile || profileRes.data?.data || profileRes.data;
      setProfile(profileData);
      const recsData = recsRes.data?.data || recsRes.data || [];
      setRecommendations((Array.isArray(recsData) ? recsData : []).slice(0, 3));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.user?.name || user?.name || 'there';
  const conversationCount = profile?.conversationCount || 0;
  const streak = profile?.streak || 0;
  const recommendationCount = recommendations.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <Loading fullScreen message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Welcome Card */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-primary to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
            <CardContent className="py-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, {userName}! 👋
                  </h2>
                  <p className="text-white/90 text-lg">
                    {conversationCount === 0 
                      ? "Let's start your career discovery journey today"
                      : `You've completed ${conversationCount} reflection${conversationCount !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
                <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card 
            className="hover:shadow-lg transition-all cursor-pointer group" 
            onClick={() => navigate('/reflection')}
          >
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Daily Reflection</h3>
                <p className="text-sm text-gray-600">
                  {conversationCount === 0 ? 'Start your first chat' : 'Continue chatting'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{streak} Day Streak</h3>
                <p className="text-sm text-gray-600">
                  {streak === 0 ? 'Start your streak today!' : 'Keep it going! 🔥'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{recommendationCount} Career Matches</h3>
                <p className="text-sm text-gray-600">
                  {recommendationCount === 0 ? 'Complete 10+ chats' : 'View your matches'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Behavioral Traits */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Traits</CardTitle>
                <CardDescription>Your personality profile overview</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.behavioralTraits ? (
                  <TraitsRadarChart data={profile.behavioralTraits} />
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Start conversations to build your behavioral profile
                    </p>
                    <Button onClick={() => navigate('/reflection')}>
                      Start First Reflection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Career Recommendations */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Career Matches</CardTitle>
                    <CardDescription>Based on your behavioral analysis</CardDescription>
                  </div>
                  {recommendations.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/careers')}
                    >
                      View All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate('/careers')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {rec.careerTitle || rec.title}
                        </h4>
                        <Badge variant="success">
                          {Math.round(rec.confidenceScore || rec.score || 0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {rec.reasoning || rec.description || 'Great match based on your profile'}
                      </p>
                      {rec.matchedTraits && rec.matchedTraits.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {rec.matchedTraits.slice(0, 3).map((trait, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2 font-medium">
                      No career recommendations yet
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Complete at least 10 reflections to get personalized career matches
                    </p>
                    <Button onClick={() => navigate('/reflection')}>
                      Start Reflecting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Trait Details */}
        {profile?.behavioralTraits && (
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Trait Breakdown</CardTitle>
                <CardDescription>Detailed view of your behavioral strengths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Creativity', value: profile.behavioralTraits.creativity || 0, color: 'bg-purple-500' },
                    { name: 'Analytical Thinking', value: profile.behavioralTraits.analyticalThinking || 0, color: 'bg-blue-500' },
                    { name: 'Communication', value: profile.behavioralTraits.communication || 0, color: 'bg-green-500' },
                    { name: 'Leadership', value: profile.behavioralTraits.leadership || 0, color: 'bg-orange-500' },
                    { name: 'Empathy', value: profile.behavioralTraits.empathy || 0, color: 'bg-pink-500' },
                    { name: 'Problem Solving', value: profile.behavioralTraits.problemSolving || 0, color: 'bg-indigo-500' },
                  ].map((trait) => (
                    <div key={trait.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">{trait.name}</span>
                        <span className="text-sm font-semibold text-gray-600">
                          {trait.value.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${trait.value * 10}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${trait.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
