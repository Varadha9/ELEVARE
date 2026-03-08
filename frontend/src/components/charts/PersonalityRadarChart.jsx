import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export function PersonalityRadarChart({ data }) {
  const chartData = [
    { trait: 'Openness', value: data?.openness || 0 },
    { trait: 'Conscientiousness', value: data?.conscientiousness || 0 },
    { trait: 'Extraversion', value: data?.extraversion || 0 },
    { trait: 'Agreeableness', value: data?.agreeableness || 0 },
    { trait: 'Neuroticism', value: data?.neuroticism || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis 
          dataKey="trait" 
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#6B7280' }} />
        <Radar
          name="Personality"
          dataKey="value"
          stroke="#4F46E5"
          fill="#4F46E5"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
