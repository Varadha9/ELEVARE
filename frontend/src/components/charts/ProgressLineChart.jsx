// Recharts components for the line chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// sampleData — shown when the user has no real conversation data yet
// Gives new users a preview of what the chart will look like after they start reflecting
const sampleData = [
  { date: 'Week 1', creativity: 4, analytical: 5, communication: 3 },
  { date: 'Week 2', creativity: 5, analytical: 5.5, communication: 4 },
  { date: 'Week 3', creativity: 6, analytical: 6.5, communication: 5 },
  { date: 'Week 4', creativity: 6.5, analytical: 7, communication: 5.5 },
];

// buildChartData — transforms raw conversation history into time-bucketed chart data
// Groups conversations into weekly or monthly buckets and averages trait scores per bucket
// Exported so ProgressTracking page can call it with the timeRange toggle
export function buildChartData(conversations, timeRange = 'weekly') {
  if (!conversations || conversations.length === 0) return [];

  // Sort conversations oldest-first so buckets are in chronological order
  const sorted = [...conversations].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const bucketSize = timeRange === 'monthly' ? 30 : 7; // Days per bucket

  const first   = new Date(sorted[0].timestamp); // Reference point for bucket calculation
  const buckets = {};

  sorted.forEach(conv => {
    // Calculate how many days since the first conversation
    const daysDiff   = Math.floor((new Date(conv.timestamp) - first) / (1000 * 60 * 60 * 24));
    const bucketIndex = Math.floor(daysDiff / bucketSize);
    const label      = timeRange === 'monthly' ? `Month ${bucketIndex + 1}` : `Week ${bucketIndex + 1}`;

    // Initialize bucket if it doesn't exist yet
    if (!buckets[label]) buckets[label] = { date: label, _counts: {}, creativity: 0, analytical: 0, communication: 0 };

    // Extract detected traits from the conversation's NLP analysis
    // Supports both array format [{trait, value}] and object format {trait: value}
    const traits   = conv.detectedTraits || conv.analysis?.detectedTraits || [];
    const traitMap = Array.isArray(traits)
      ? Object.fromEntries(traits.map(t => [t.trait, t.value]))
      : traits;

    // Accumulate trait scores and counts for averaging later
    ['creativity', 'analyticalThinking', 'communication'].forEach(key => {
      const shortKey = key === 'analyticalThinking' ? 'analytical' : key; // Rename for chart display
      if (traitMap[key] !== undefined) {
        buckets[label][shortKey] += traitMap[key];
        buckets[label]._counts[shortKey] = (buckets[label]._counts[shortKey] || 0) + 1;
      }
    });
  });

  // Convert accumulated sums to averages; null if no data in that bucket
  return Object.values(buckets).map(b => ({
    date:          b.date,
    creativity:    b._counts.creativity    ? +(b.creativity    / b._counts.creativity).toFixed(1)    : null,
    analytical:    b._counts.analytical    ? +(b.analytical    / b._counts.analytical).toFixed(1)    : null,
    communication: b._counts.communication ? +(b.communication / b._counts.communication).toFixed(1) : null,
  }));
}

// ProgressLineChart — renders a multi-line chart showing trait trends over time
// Used on the ProgressTracking page with weekly/monthly toggle
// data — pre-processed chart data from buildChartData(); falls back to sampleData if empty
export function ProgressLineChart({ data }) {
  // Detect dark mode for chart color theming
  const isDark      = document.documentElement.classList.contains('dark');
  const tickColor   = isDark ? '#94A3B8' : '#6B7280';
  const gridColor   = isDark ? '#334155' : '#E5E7EB';
  const bgColor     = isDark ? '#1E293B' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#E5E7EB';
  const textColor   = isDark ? '#F1F5F9' : '#0F172A';

  // Use real data if available, otherwise show sample data for new users
  const chartData = (data && data.length > 0) ? data : sampleData;
  const isDemo    = !data || data.length === 0; // True when showing sample data

  return (
    <div className="relative">
      {/* Sample data badge — shown when displaying demo data to set expectations */}
      {isDemo && (
        <div className="absolute top-2 right-2 z-10">
          <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
            Sample data — complete reflections to see real trends
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          {/* CartesianGrid — dashed background grid for readability */}
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          {/* XAxis — shows week/month labels */}
          <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 11 }} />
          {/* YAxis — fixed 0-10 scale matching the trait scoring range */}
          <YAxis domain={[0, 10]} tick={{ fill: tickColor, fontSize: 11 }} />
          {/* Tooltip — shows all three trait values on hover */}
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              color: textColor,
              fontSize: '12px',
            }}
          />
          {/* Legend — identifies each line by color */}
          <Legend wrapperStyle={{ fontSize: '12px', color: tickColor }} />
          {/* Three lines — one per trait, each with a distinct brand color */}
          <Line type="monotone" dataKey="creativity"    stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="analytical"    stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="communication" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
