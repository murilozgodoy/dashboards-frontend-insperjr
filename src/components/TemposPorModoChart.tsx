import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface TemposPorModoChartProps {
  data: { modo: string; tempo_preparo_medio: number; tempo_entrega_medio: number; quantidade: number }[];
}

const COLORS_PREPARO = '#3b82f6';
const COLORS_ENTREGA = '#10b981';

const TemposPorModoChart: React.FC<TemposPorModoChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="modo" 
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
          formatter={(value: number, name: string) => {
            if (name === 'tempo_preparo_medio') {
              return [`${value.toFixed(1)} min`, 'Tempo Preparo'];
            }
            if (name === 'tempo_entrega_medio') {
              return [`${value.toFixed(1)} min`, 'Tempo Entrega'];
            }
            return [value, name];
          }}
        />
        <Legend />
        <Bar 
          dataKey="tempo_preparo_medio" 
          name="Tempo Preparo" 
          fill={COLORS_PREPARO}
          radius={[8, 0, 0, 8]}
        />
        <Bar 
          dataKey="tempo_entrega_medio" 
          name="Tempo Entrega" 
          fill={COLORS_ENTREGA}
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TemposPorModoChart;

