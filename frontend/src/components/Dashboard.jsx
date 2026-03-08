import { useState, useEffect } from 'react';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Brain, Target, Award } from 'lucide-react';
import { profileAPI, recommendationAPI } from '../services/api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, recsRes] = await Promise.all([
        profileAPI.getUserProfile(),
        recommendationAPI.getRecommendations()
      ]);
      setProfile(profileRes.data);
      setRecommendations(recsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const behavioralData = profile?.behavioralTraits ? Object.entries(profile.behavioralTraits).map(([key, value]) => ({
    trait: key.replace(/([A-Z])/g, ' $1').trim(),
    value: value
  })) : [];

  const personalityData = profile?.personality ? Object.entries(profile.personality).map(([key, value]) => ({
    trait: key.charAt(0).toUpperCase() + key.slice(1),
    value: value
  })) : [];

  const latestRecs = recommendations[0]?.recommendations || [];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Brain />} title="Conversations" value={profile?.conversationStreak || 0} color="bg-blue-500" />
        <StatCard icon={<Target />} title="Traits Analyzed" value={Object.keys(profile?.behavioralTraits || {}).length} color="bg-green-500" />
        <StatCard icon={<Award />} title="Recommendations" value={latestRecs.length} color="bg-purple-500" />
        <StatCard icon={<TrendingUp />} title="Profile Strength" value={`${Math.round((profile?.personality?.openness || 50))}%`} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Behavioral Traits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={behavioralData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="trait" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Your Profile" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Personality Profile (Big Five)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={personalityData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="trait" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Personality" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Career Recommendations</h3>
        {latestRecs.length === 0 ? (
          <p className="text-gray-500">Keep chatting to receive personalized career recommendations!</p>
        ) : (
          <div className="space-y-4">
            {latestRecs.slice(0, 5).map((rec, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{rec.careerTitle}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.explanation?.summary}</p>
                    <div className="flex gap-2 mt-2">
                      {rec.explanation?.matchingTraits?.slice(0, 3).map((trait, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-primary">{rec.confidenceScore}%</div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
