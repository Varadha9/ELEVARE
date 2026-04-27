// Recharts components for the radar chart
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

// PersonalityRadarChart — visualizes the user's Big Five (OCEAN) personality traits
// Used on the Personality page alongside the trait breakdown list
// data — object with OCEAN keys from the personality schema (0-10 scale)
export function PersonalityRadarChart({ data }) {
  // Detect dark mode to apply appropriate colors to chart elements
  const isDark    = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#94A3B8' : '#6B7280'; // Axis label color
  const gridColor = isDark ? '#334155' : '#E5E7EB'; // Grid line color

  // Transform the flat personality object into the array format Recharts expects
  // || 0 fallback ensures the chart renders even if a trait value is missing
  const chartData = [
    { trait: 'Openness',      value: data?.openness          || 0 },
    { trait: 'Conscientious', value: data?.conscientiousness || 0 },
    { trait: 'Extraversion',  value: data?.extraversion      || 0 },
    { trait: 'Agreeableness', value: data?.agreeableness     || 0 },
    { trait: 'Neuroticism',   value: data?.neuroticism       || 0 },
  ];

  return (
    // ResponsiveContainer makes the chart fill 100% of its parent width
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={chartData}>
        {/* PolarGrid — draws the concentric circles and spoke lines */}
        <PolarGrid stroke={gridColor} />
        {/* PolarAngleAxis — renders OCEAN trait names around the outer edge */}
        <PolarAngleAxis dataKey="trait" tick={{ fill: tickColor, fontSize: 11 }} />
        {/* PolarRadiusAxis — shows the 0-10 scale */}
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: tickColor, fontSize: 10 }} />
        {/* Tooltip — shows exact score when hovering a data point */}
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
        {/* Radar — purple color distinguishes personality from behavioral traits (indigo) */}
        <Radar name="Personality" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
