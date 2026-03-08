import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export function Careers() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      await api.post('/recommendations/generate');
      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Career Insights">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-primary to-primary-600 text-white border-0">
          <CardContent className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Career Matches</h2>
                <p className="text-white/90">AI-powered recommendations based on your profile</p>
              </div>
              <Button onClick={generateRecommendations} disabled={loading} variant="secondary">
                {loading ? 'Generating...' : 'Refresh Recommendations'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{rec.careerTitle}</h3>
                        <p className="text-gray-600">{rec.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{Math.round(rec.confidenceScore)}%</div>
                      <p className="text-sm text-gray-600">Match Score</p>
                    </div>
                  </div>

                  <Progress value={rec.confidenceScore} className="mb-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Why This Matches You
                      </h4>
                      <p className="text-gray-700 mb-3">{rec.reasoning}</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.matchedTraits?.map((trait, i) => (
                          <Badge key={i} variant="success">{trait}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Key Skills Required
                      </h4>
                      <ul className="space-y-2">
                        {rec.requiredSkills?.slice(0, 5).map((skill, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-4">Complete more reflections to get personalized career recommendations</p>
              <Button onClick={generateRecommendations} disabled={loading}>
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
