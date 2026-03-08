import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { PersonalityRadarChart } from '../components/charts/PersonalityRadarChart';
import { motion } from 'framer-motion';
import api from '../services/api';

const traitDescriptions = {
  openness: 'Curiosity, creativity, and willingness to try new experiences',
  conscientiousness: 'Organization, responsibility, and goal-oriented behavior',
  extraversion: 'Sociability, assertiveness, and energy in social situations',
  agreeableness: 'Compassion, cooperation, and trust in others',
  neuroticism: 'Emotional stability and stress management'
};

const behavioralTraits = [
  { key: 'creativity', label: 'Creativity', icon: '🎨', color: 'bg-purple-100 text-purple-700' },
  { key: 'analyticalThinking', label: 'Analytical Thinking', icon: '🧠', color: 'bg-blue-100 text-blue-700' },
  { key: 'communication', label: 'Communication', icon: '💬', color: 'bg-green-100 text-green-700' },
  { key: 'leadership', label: 'Leadership', icon: '👑', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'empathy', label: 'Empathy', icon: '❤️', color: 'bg-red-100 text-red-700' },
  { key: 'motivation', label: 'Motivation', icon: '🚀', color: 'bg-indigo-100 text-indigo-700' },
  { key: 'stressTolerance', label: 'Stress Tolerance', icon: '🧘', color: 'bg-teal-100 text-teal-700' },
  { key: 'problemSolving', label: 'Problem Solving', icon: '🔧', color: 'bg-orange-100 text-orange-700' },
];

export function Personality() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
    <DashboardLayout title="Personality Profile">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Big Five Personality */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Big Five Personality Traits</CardTitle>
              <CardDescription>Your personality profile based on the OCEAN model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <PersonalityRadarChart data={profile?.personality} />
                </div>
                <div className="space-y-4">
                  {Object.entries(traitDescriptions).map(([key, description]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold capitalize">{key}</h4>
                        <Badge variant="secondary">
                          {(profile?.personality?.[key] || 0).toFixed(1)}/10
                        </Badge>
                      </div>
                      <Progress value={(profile?.personality?.[key] || 0) * 10} className="mb-2" />
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Behavioral Traits */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Traits</CardTitle>
              <CardDescription>Skills and characteristics identified through your reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {behavioralTraits.map((trait) => (
                  <motion.div
                    key={trait.key}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${trait.color}`}>
                        {trait.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{trait.label}</h4>
                        <span className="text-xs text-gray-600">
                          {(profile?.behavioralTraits?.[trait.key] || 0).toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                    <Progress value={(profile?.behavioralTraits?.[trait.key] || 0) * 10} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Personality Insights</CardTitle>
              <CardDescription>What your profile reveals about you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">🌟 Top Strength</h4>
                  <p className="text-sm text-gray-700">
                    Your highest trait is {
                      Object.entries(profile?.behavioralTraits || {})
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'developing'
                    }
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-2">📈 Growth Area</h4>
                  <p className="text-sm text-gray-700">
                    Focus on developing your {
                      Object.entries(profile?.behavioralTraits || {})
                        .sort(([,a], [,b]) => a - b)[0]?.[0] || 'skills'
                    }
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-700 mb-2">💡 Recommendation</h4>
                  <p className="text-sm text-gray-700">
                    Continue daily reflections to refine your profile
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
