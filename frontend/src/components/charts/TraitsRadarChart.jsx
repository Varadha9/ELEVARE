import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export function TraitsRadarChart({ data }) {
  const chartData = [
    { trait: 'Creativity', value: data?.creativity || 0 },
    { trait: 'Analytical', value: data?.analyticalThinking || 0 },
    { trait: 'Communication', value: data?.communication || 0 },
    { trait: 'Leadership', value: data?.leadership || 0 },
    { trait: 'Empathy', value: data?.empathy || 0 },
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
          name="Traits"
          dataKey="value"
          stroke="#22C55E"
          fill="#22C55E"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
