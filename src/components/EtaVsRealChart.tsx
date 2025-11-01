import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EtaVsRealChartProps {
  data: { tipo: string; tempo: number }[];
}

const EtaVsRealChart: React.FC<EtaVsRealChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="tipo" 
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
          formatter={(value: number) => [`${value.toFixed(1)} min`, 'Tempo']}
        />
        <Bar dataKey="tempo" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.tipo === 'ETA Estimado' ? '#3b82f6' : '#ef4444'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EtaVsRealChart;

