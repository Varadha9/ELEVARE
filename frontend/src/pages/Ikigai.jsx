import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Target, Heart, Star, DollarSign, Lightbulb, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../services/api';

const dimensions = [
  { key: 'whatYouLove',         label: 'What You Love',           icon: Heart,      bg: 'bg-red-50 dark:bg-red-900/20',    border: 'border-red-200 dark:border-red-800',    text: 'text-red-700 dark:text-red-300',    badge: 'bg-red-100 text-red-700',    circle: 'bg-red-100',    pos: 'top-0 left-1/2 -translate-x-1/2',          iconColor: 'text-red-500' },
  { key: 'whatYouAreGoodAt',    label: "What You're Good At",     icon: Star,       bg: 'bg-blue-50 dark:bg-blue-900/20',  border: 'border-blue-200 dark:border-blue-800',  text: 'text-blue-700 dark:text-blue-300',  badge: 'bg-blue-100 text-blue-700',  circle: 'bg-blue-100',   pos: 'right-0 top-1/2 -translate-y-1/2',         iconColor: 'text-blue-500' },
  { key: 'whatTheWorldNeeds',   label: 'What The World Needs',    icon: Target,     bg: 'bg-green-50 dark:bg-green-900/20',border: 'border-green-200 dark:border-green-800',text: 'text-green-700 dark:text-green-300',badge: 'bg-green-100 text-green-700',circle: 'bg-green-100',  pos: 'bottom-0 left-1/2 -translate-x-1/2',       iconColor: 'text-green-500' },
  { key: 'whatYouCanBePaidFor', label: 'What You Can Be Paid For',icon: DollarSign, bg: 'bg-yellow-50 dark:bg-yellow-900/20',border:'border-yellow-200 dark:border-yellow-800',text:'text-yellow-700 dark:text-yellow-300',badge:'bg-yellow-100 text-yellow-700',circle:'bg-yellow-100',pos:'left-0 top-1/2 -translate-y-1/2',          iconColor: 'text-yellow-500' },
];

export function Ikigai() {
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

  const ikigai = profile?.ikigai || {};
  const hasData = dimensions.some(d => ikigai[d.key]?.length > 0);

  if (loading) return <DashboardLayout title="Ikigai Analysis"><Loading fullScreen message="Loading your Ikigai..." /></DashboardLayout>;

  return (
    <DashboardLayout title="Ikigai Analysis">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-0 text-white">
          <CardContent className="py-8 text-center">
            <Target className="w-14 h-14 mx-auto mb-3 text-white/90" />
            <h2 className="text-3xl font-bold mb-1">Your Ikigai</h2>
            <p className="text-white/80">Where passion, talent, purpose and livelihood meet</p>
          </CardContent>
        </Card>

        {!hasData ? (
          /* Empty state */
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Ikigai is forming</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Complete more AI reflections so we can map your four Ikigai dimensions.
              </p>
              <Button onClick={() => navigate('/reflection')}>Start Reflecting</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diagram */}
            <Card>
              <CardContent className="p-8">
                <div className="relative w-full aspect-square max-w-xs mx-auto">
                  {/* Center */}
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                    className="absolute inset-0 m-auto w-28 h-28 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center z-10 shadow-xl"
                  >
                    <div className="text-center text-white">
                      <Lightbulb className="w-7 h-7 mx-auto mb-0.5" />
                      <p className="text-[10px] font-bold tracking-wide">IKIGAI</p>
                    </div>
                  </motion.div>

                  {dimensions.map((d, i) => (
                    <motion.div
                      key={d.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`absolute w-36 h-36 ${d.circle} rounded-full flex items-center justify-center ${d.pos}`}
                    >
                      <div className="text-center px-2">
                        <d.icon className={`w-5 h-5 mx-auto mb-1 ${d.iconColor}`} />
                        <p className={`text-[10px] font-semibold ${d.iconColor}`}>{d.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career result */}
            <Card>
              <CardHeader>
                <CardTitle>Your Ikigai Career</CardTitle>
                <CardDescription>The perfect intersection of your passions and purpose</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {ikigai.career || 'Still Discovering...'}
                  </h3>
                  {ikigai.career && <Badge variant="success" dot>Perfect Match</Badge>}
                </div>

                {dimensions.map((d) => (
                  <div key={d.key} className={`p-4 rounded-xl border ${d.bg} ${d.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <d.icon className={`w-4 h-4 ${d.iconColor}`} />
                      <h4 className={`text-sm font-semibold ${d.text}`}>{d.label}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ikigai[d.key]?.length > 0
                        ? ikigai[d.key].map((item, i) => (
                            <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.badge}`}>{item}</span>
                          ))
                        : <p className="text-xs text-gray-500 dark:text-gray-400">Complete more reflections</p>
                      }
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Explanation */}
        <Card>
          <CardHeader><CardTitle>Understanding Ikigai</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Ikigai is a Japanese concept meaning "reason for being." It sits at the intersection of
              what you <strong>love</strong>, what you're <strong>good at</strong>, what the <strong>world needs</strong>,
              and what you can be <strong>paid for</strong>. Your daily reflections help us map all four dimensions
              to surface your ideal career path.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
