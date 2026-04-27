// Recharts components for building the radar (spider) chart
// Radar — the filled polygon shape; RadarChart — the chart container
// PolarGrid — the circular grid lines; PolarAngleAxis — the trait labels around the edge
// PolarRadiusAxis — the numeric scale axis; ResponsiveContainer — makes chart fill its parent
// Tooltip — the hover popup showing exact values
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

// TraitsRadarChart — visualizes the user's 6 behavioral traits as a radar/spider chart
// Used on the Dashboard and Personality pages
// data — object with trait keys matching the behavioralTraits schema (0-10 scale)
export function TraitsRadarChart({ data }) {
  // Detect dark mode to apply appropriate colors to chart elements
  const isDark     = document.documentElement.classList.contains('dark');
  const tickColor  = isDark ? '#94A3B8' : '#6B7280'; // Axis label color
  const gridColor  = isDark ? '#334155' : '#E5E7EB'; // Grid line color

  // Transform the flat traits object into the array format Recharts expects
  // || 0 fallback ensures the chart renders even if a trait value is missing
  const chartData = [
    { trait: 'Creativity',    value: data?.creativity         || 0 },
    { trait: 'Analytical',    value: data?.analyticalThinking || 0 },
    { trait: 'Communication', value: data?.communication      || 0 },
    { trait: 'Leadership',    value: data?.leadership         || 0 },
    { trait: 'Empathy',       value: data?.empathy            || 0 },
    { trait: 'Problem Solving', value: data?.problemSolving   || 0 },
  ];

  return (
    // ResponsiveContainer makes the chart fill 100% of its parent width
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={chartData}>
        {/* PolarGrid — draws the concentric circles and spoke lines */}
        <PolarGrid stroke={gridColor} />
        {/* PolarAngleAxis — renders trait names around the outer edge */}
        <PolarAngleAxis dataKey="trait" tick={{ fill: tickColor, fontSize: 11 }} />
        {/* PolarRadiusAxis — shows the 0-10 scale; angle=90 places it at the top */}
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
          formatter={(value) => [`${value}/10`, 'Score']} // Format: "7.5/10"
        />
        {/* Radar — the filled polygon; indigo color matches the ELEVARE brand */}
        <Radar name="Traits" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
