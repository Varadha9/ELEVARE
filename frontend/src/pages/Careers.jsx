import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Briefcase, TrendingUp, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function MatchBar({ score }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <div className="h-2 bg-gray-100 dark:bg-slate-600 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8 }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  );
}

export function Careers() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchRecommendations(); }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations');
      const data = res.data?.data || res.data || [];
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      await api.post('/recommendations/generate');
      await fetchRecommendations();
    } catch (err) {
      console.error('Error generating recommendations:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <DashboardLayout title="Career Insights"><Loading fullScreen message="Loading career matches..." /></DashboardLayout>;

  return (
    <DashboardLayout title="Career Insights">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <Card className="bg-gradient-to-br from-primary to-indigo-700 border-0 text-white">
          <CardContent className="py-7">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold mb-1">Your Career Matches</h2>
                <p className="text-white/80 text-sm">AI-powered recommendations based on your behavioral profile</p>
              </div>
              <Button
                onClick={generateRecommendations}
                loading={generating}
                variant="secondary"
                icon={RefreshCw}
              >
                {!generating && 'Refresh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        {recommendations.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Complete at least 10 AI reflections to unlock personalized career matches.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={() => navigate('/reflection')} icon={MessageSquare}>Start Reflecting</Button>
                <Button onClick={generateRecommendations} loading={generating} variant="outline" icon={RefreshCw}>
                  {!generating && 'Try Generate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career cards */}
        <div className="space-y-4">
          {recommendations.map((rec, idx) => {
            const score = Math.round(rec.confidenceScore || rec.score || 0);
            const scoreVariant = score >= 80 ? 'success' : score >= 60 ? 'default' : 'warning';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card hover>
                  <CardContent className="p-6">
                    {/* Top row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {rec.careerTitle || rec.title}
                            </h3>
                            {rec.category && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{rec.category}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <Badge variant={scoreVariant} className="text-sm px-3 py-1">{score}% match</Badge>
                          </div>
                        </div>
                        <div className="mt-2">
                          <MatchBar score={score} />
                        </div>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Why This Matches You
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {rec.reasoning || 'Great match based on your behavioral profile'}
                        </p>
                        {rec.matchedTraits?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {rec.matchedTraits.slice(0, 4).map((t, i) => (
                              <Badge key={i} variant="success" dot>{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                          <TrendingUp className="w-4 h-4 text-primary" /> Key Skills Required
                        </h4>
                        <ul className="space-y-1.5">
                          {rec.requiredSkills?.slice(0, 5).map((skill, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
