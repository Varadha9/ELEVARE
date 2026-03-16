import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function TraitsRadarChart({ data }) {
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor  = isDark ? '#94A3B8' : '#6B7280';
  const gridColor  = isDark ? '#334155' : '#E5E7EB';

  const chartData = [
    { trait: 'Creativity',   value: data?.creativity        || 0 },
    { trait: 'Analytical',   value: data?.analyticalThinking || 0 },
    { trait: 'Communication',value: data?.communication     || 0 },
    { trait: 'Leadership',   value: data?.leadership        || 0 },
    { trait: 'Empathy',      value: data?.empathy           || 0 },
    { trait: 'Problem Solving', value: data?.problemSolving || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={chartData}>
        <PolarGrid stroke={gridColor} />
        <PolarAngleAxis dataKey="trait" tick={{ fill: tickColor, fontSize: 11 }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: tickColor, fontSize: 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#1E293B' : '#fff',
            border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
            borderRadius: '10px',
            color: isDark ? '#F1F5F9' : '#0F172A',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value}/10`, 'Score']}
        />
        <Radar name="Traits" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
