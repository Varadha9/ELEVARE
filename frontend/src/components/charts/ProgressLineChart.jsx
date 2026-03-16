import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const sampleData = [
  { date: 'Week 1', creativity: 4, analytical: 5, communication: 3 },
  { date: 'Week 2', creativity: 5, analytical: 5.5, communication: 4 },
  { date: 'Week 3', creativity: 6, analytical: 6.5, communication: 5 },
  { date: 'Week 4', creativity: 6.5, analytical: 7, communication: 5.5 },
];

export function ProgressLineChart({ data }) {
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor  = isDark ? '#94A3B8' : '#6B7280';
  const gridColor  = isDark ? '#334155' : '#E5E7EB';
  const bgColor    = isDark ? '#1E293B' : '#ffffff';
  const borderColor= isDark ? '#334155' : '#E5E7EB';
  const textColor  = isDark ? '#F1F5F9' : '#0F172A';

  const chartData = (data && data.length > 0) ? data : sampleData;
  const isDemo = !data || data.length === 0;

  return (
    <div className="relative">
      {isDemo && (
        <div className="absolute top-2 right-2 z-10">
          <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
            Sample data — complete reflections to see real trends
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fill: tickColor, fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              color: textColor,
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: tickColor }} />
          <Line type="monotone" dataKey="creativity"    stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="analytical"   stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="communication"stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
