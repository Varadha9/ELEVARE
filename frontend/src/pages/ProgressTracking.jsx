import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { ProgressLineChart, buildChartData } from '../components/charts/ProgressLineChart';
import { TrendingUp, Calendar, MessageSquare, Target, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Progress() {
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('weekly');
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [profileRes, convsRes] = await Promise.all([
        api.get('/profile').catch(() => ({ data: {} })),
        api.get('/conversations/history').catch(() => ({ data: {} })),
      ]);
      setProfile(profileRes.data?.data?.profile || profileRes.data?.data || profileRes.data);
      setConversations(convsRes.data?.data?.conversations || []);
    } catch (err) {
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout title="Progress Tracking"><Loading fullScreen message="Loading your progress..." /></DashboardLayout>;

  const totalReflections = profile?.conversationCount ?? conversations.length;
  const streak           = profile?.streak ?? 0;
  const traits           = profile?.behavioralTraits || {};
  const improvedTraits   = Object.values(traits).filter(v => v > 5).length;

  const stats = [
    { label: 'Total Reflections', value: totalReflections, icon: MessageSquare, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Current Streak',    value: `${streak} days`,  icon: Calendar,     color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Strong Traits',     value: improvedTraits,    icon: TrendingUp,   color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Goals Achieved',    value: totalReflections >= 10 ? '1+' : '0',   icon: Target, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  ];

  /* Build activity grid from real conversation timestamps */
  const today = new Date();
  const activityMap = new Set(
    conversations.map(c => new Date(c.timestamp).toDateString())
  );
  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (27 - i));
    return { date: d, active: activityMap.has(d.toDateString()) };
  });

  /* Dynamic milestones */
  const milestones = [
    { title: 'First Reflection',          done: totalReflections >= 1,  date: totalReflections >= 1  ? 'Completed' : 'Pending' },
    { title: '5 Reflections',             done: totalReflections >= 5,  date: totalReflections >= 5  ? 'Completed' : `${totalReflections}/5` },
    { title: '7-Day Streak',              done: streak >= 7,            date: streak >= 7            ? 'Completed' : `${streak}/7 days` },
    { title: 'Get Career Recommendations',done: totalReflections >= 10, date: totalReflections >= 10 ? 'Completed' : `${totalReflections}/10 reflections` },
    { title: '30-Day Streak',             done: streak >= 30,           date: streak >= 30           ? 'Completed' : `${streak}/30 days` },
  ];

  return (
    <DashboardLayout title="Progress Tracking">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trend chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Behavioral Trends</CardTitle>
                <CardDescription>Track your trait development over time</CardDescription>
              </div>
              <div className="flex gap-2">
                {['weekly','monthly'].map(r => (
                  <Button key={r} variant={timeRange === r ? 'primary' : 'ghost'} size="sm"
                    onClick={() => setTimeRange(r)} className="capitalize">{r}</Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent><ProgressLineChart data={buildChartData(conversations, timeRange)} /></CardContent>
        </Card>

        {/* Activity calendar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Reflection Activity</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Last 28 days</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-200 dark:bg-slate-700 inline-block" />None</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />Active</span>
              </div>
            </div>
            {conversations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">No activity yet.</p>
                <Button size="sm" onClick={() => navigate('/reflection')}>Start Reflecting</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-1 w-fit">
                <div className="grid grid-cols-7 gap-1.5 mb-0.5">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={i} className="w-7 text-center text-[10px] text-gray-400 dark:text-gray-500">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {last28.map((day, i) => (
                    <div
                      key={i}
                      title={day.date.toLocaleDateString()}
                      className={`w-7 h-7 rounded-md transition-colors ${
                        day.active
                          ? 'bg-primary opacity-90 hover:opacity-100'
                          : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>Your achievements and upcoming goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  m.done ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-50 dark:bg-slate-700/40'
                }`}>
                  {m.done
                    ? <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    : <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  }
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${m.done ? 'text-emerald-800 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {m.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.date}</p>
                  </div>
                  {m.done && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Done</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
