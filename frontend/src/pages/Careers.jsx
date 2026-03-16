import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { Briefcase, TrendingUp, CheckCircle, RefreshCw, MessageSquare, Crown } from 'lucide-react';
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
  const [loading, setLoading]                 = useState(true);
  const [generating, setGenerating]           = useState(false);
  const navigate = useNavigate();
  const toast    = useToast();

  useEffect(() => { fetchRecommendations(); }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res  = await api.get('/recommendations');
      const data = res.data?.data || res.data || [];
      setRecommendations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      await api.post('/recommendations/generate');
      await fetchRecommendations();
      toast.success('Career recommendations updated!');
    } catch {
      toast.error('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <DashboardLayout title="Career Insights">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        <SkeletonList rows={3} />
      </div>
    </DashboardLayout>
  );

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
              <Button onClick={generateRecommendations} loading={generating} variant="secondary" icon={RefreshCw}>
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
            const score        = Math.round(rec.confidenceScore || rec.score || 0);
            const scoreVariant = score >= 80 ? 'success' : score >= 60 ? 'default' : 'warning';
            const isBest       = idx === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card hover className={isBest ? 'ring-2 ring-amber-400 dark:ring-amber-500' : ''}>
                  <CardContent className="p-6">
                    {/* Best match banner */}
                    {isBest && (
                      <div className="flex items-center gap-1.5 mb-3 text-amber-600 dark:text-amber-400">
                        <Crown className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Best Match</span>
                      </div>
                    )}

                    {/* Top row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isBest ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                        <Briefcase className={`w-7 h-7 ${isBest ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {rec.careerTitle || rec.title}
                            </h3>
                            {rec.category && <p className="text-sm text-gray-500 dark:text-gray-400">{rec.category}</p>}
                          </div>
                          <Badge variant={scoreVariant} className="text-sm px-3 py-1 flex-shrink-0">{score}% match</Badge>
                        </div>
                        <div className="mt-2">
                          <MatchBar score={score} />
                        </div>
                      </div>
                    </div>

                    {/* Details */}
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
