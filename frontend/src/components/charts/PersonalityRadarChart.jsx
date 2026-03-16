import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function PersonalityRadarChart({ data }) {
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#94A3B8' : '#6B7280';
  const gridColor = isDark ? '#334155' : '#E5E7EB';

  const chartData = [
    { trait: 'Openness',          value: data?.openness          || 0 },
    { trait: 'Conscientious',     value: data?.conscientiousness || 0 },
    { trait: 'Extraversion',      value: data?.extraversion      || 0 },
    { trait: 'Agreeableness',     value: data?.agreeableness     || 0 },
    { trait: 'Neuroticism',       value: data?.neuroticism       || 0 },
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
        <Radar name="Personality" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
