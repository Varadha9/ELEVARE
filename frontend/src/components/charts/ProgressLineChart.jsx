import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ProgressLineChart({ data = [] }) {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { date: 'Week 1', creativity: 5, analytical: 6, communication: 4 },
    { date: 'Week 2', creativity: 6, analytical: 6.5, communication: 5 },
    { date: 'Week 3', creativity: 6.5, analytical: 7, communication: 5.5 },
    { date: 'Week 4', creativity: 7, analytical: 7.5, communication: 6 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          domain={[0, 10]}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #E5E7EB',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="creativity" 
          stroke="#4F46E5" 
          strokeWidth={2}
          dot={{ fill: '#4F46E5' }}
        />
        <Line 
          type="monotone" 
          dataKey="analytical" 
          stroke="#22C55E" 
          strokeWidth={2}
          dot={{ fill: '#22C55E' }}
        />
        <Line 
          type="monotone" 
          dataKey="communication" 
          stroke="#F59E0B" 
          strokeWidth={2}
          dot={{ fill: '#F59E0B' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
