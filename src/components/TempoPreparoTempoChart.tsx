import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TempoPreparoTempoChartProps {
  data: { periodo: string; tempo_medio: number }[];
}

const TempoPreparoTempoChart: React.FC<TempoPreparoTempoChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="periodo" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: number) => [`${value.toFixed(1)} min`, 'Tempo Médio']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="tempo_medio" 
          stroke="#3b82f6" 
          strokeWidth={3}
          name="Tempo Médio"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TempoPreparoTempoChart;

