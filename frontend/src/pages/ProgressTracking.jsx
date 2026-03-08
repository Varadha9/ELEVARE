import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressLineChart } from '../components/charts/ProgressLineChart';
import { TrendingUp, Calendar, MessageSquare, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function Progress() {
  const [timeRange, setTimeRange] = useState('weekly');

  const stats = [
    { label: 'Total Reflections', value: '24', icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
    { label: 'Current Streak', value: '7 days', icon: Calendar, color: 'bg-green-100 text-green-600' },
    { label: 'Traits Improved', value: '5', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    { label: 'Goals Achieved', value: '3', icon: Target, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <DashboardLayout title="Progress Tracking">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Behavioral Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Behavioral Trends</CardTitle>
                <CardDescription>Track your trait development over time</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={timeRange === 'weekly' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange('weekly')}
                >
                  Weekly
                </Button>
                <Button
                  variant={timeRange === 'monthly' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressLineChart />
          </CardContent>
        </Card>

        {/* Activity Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Reflection Activity</CardTitle>
            <CardDescription>Your daily reflection consistency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg ${
                    i % 3 === 0 ? 'bg-primary' : i % 2 === 0 ? 'bg-primary/50' : 'bg-gray-200'
                  }`}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <span>No activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/50 rounded" />
                <span>Some activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded" />
                <span>High activity</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>Your achievements and progress markers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'First Reflection', date: '2 weeks ago', completed: true },
                { title: '7 Day Streak', date: 'Today', completed: true },
                { title: 'Complete Personality Profile', date: 'In progress', completed: false },
                { title: '30 Day Streak', date: 'Upcoming', completed: false },
              ].map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {milestone.completed && <span className="text-white text-xl">✓</span>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
