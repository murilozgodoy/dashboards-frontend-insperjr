import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TempoEntregaDistanciaChartProps {
  data: { faixa: string; tempo_medio: number; quantidade: number }[];
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

const TempoEntregaDistanciaChart: React.FC<TempoEntregaDistanciaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="faixa" 
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
          formatter={(value: number, name: string, props: any) => {
            if (name === 'tempo_medio') {
              return [`${value.toFixed(1)} min`, 'Tempo Médio'];
            }
            return [value, 'Quantidade'];
          }}
        />
        <Bar dataKey="tempo_medio" name="Tempo Médio" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TempoEntregaDistanciaChart;

