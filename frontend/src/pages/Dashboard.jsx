import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { TraitsRadarChart } from '../components/charts/TraitsRadarChart';
import { ProgressLineChart } from '../components/charts/ProgressLineChart';
import { Sparkles, TrendingUp, Target, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, recsRes] = await Promise.all([
        api.get('/profile'),
        api.get('/recommendations')
      ]);
      setProfile(profileRes.data);
      setRecommendations(recsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
          <Card className="bg-gradient-to-br from-primary to-primary-600 text-white border-0">
            <CardContent className="py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, {profile?.userId?.name || 'User'}! 👋
                  </h2>
                  <p className="text-white/90">
                    Continue your journey of self-discovery and career exploration
                  </p>
                </div>
                <Sparkles className="w-16 h-16 text-white/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reflection')}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Today's Reflection</h3>
                <p className="text-sm text-gray-600">Start AI conversation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">7 Day Streak</h3>
                <p className="text-sm text-gray-600">Keep it going!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">3 Careers Matched</h3>
                <p className="text-sm text-gray-600">View insights</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Personality Snapshot */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Personality Snapshot</CardTitle>
                <CardDescription>Your behavioral traits overview</CardDescription>
              </CardHeader>
              <CardContent>
                <TraitsRadarChart data={profile?.behavioralTraits} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Career Suggestions */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Top Career Matches</CardTitle>
                <CardDescription>Based on your profile analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{rec.careerTitle}</h4>
                        <Badge variant="success">{Math.round(rec.confidenceScore)}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.reasoning}</p>
                      <div className="flex gap-2">
                        {rec.matchedTraits?.slice(0, 3).map((trait, i) => (
                          <Badge key={i} variant="secondary">{trait}</Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Complete more reflections to get career recommendations</p>
                    <Button className="mt-4" onClick={() => navigate('/reflection')}>
                      Start Reflection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Your behavioral trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressLineChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Trait Details */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Traits</CardTitle>
              <CardDescription>Detailed breakdown of your strengths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Creativity', value: profile?.behavioralTraits?.creativity || 0 },
                  { name: 'Analytical Thinking', value: profile?.behavioralTraits?.analyticalThinking || 0 },
                  { name: 'Communication', value: profile?.behavioralTraits?.communication || 0 },
                  { name: 'Leadership', value: profile?.behavioralTraits?.leadership || 0 },
                  { name: 'Empathy', value: profile?.behavioralTraits?.empathy || 0 },
                  { name: 'Problem Solving', value: profile?.behavioralTraits?.problemSolving || 0 },
                ].map((trait) => (
                  <div key={trait.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{trait.name}</span>
                      <span className="text-sm text-gray-600">{trait.value.toFixed(1)}/10</span>
                    </div>
                    <Progress value={trait.value * 10} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
