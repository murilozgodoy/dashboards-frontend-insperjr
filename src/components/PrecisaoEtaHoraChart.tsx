import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PrecisaoEtaHoraChartProps {
  data: { hora: number; precisao_pct: number; total_pedidos: number }[];
}

const getColor = (precisao: number) => {
  if (precisao >= 80) return '#10b981'; // verde
  if (precisao >= 60) return '#f59e0b'; // amarelo
  return '#ef4444'; // vermelho
};

const PrecisaoEtaHoraChart: React.FC<PrecisaoEtaHoraChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="hora" 
          tick={{ fontSize: 12 }}
          label={{ value: 'Hora do Dia', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ value: 'Precisão (%)', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: number, name: string, props: any) => {
            if (name === 'precisao_pct') {
              return [`${value.toFixed(1)}%`, 'Precisão'];
            }
            return [value, 'Total de Pedidos'];
          }}
        />
        <Bar dataKey="precisao_pct" name="Precisão (%)" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.precisao_pct)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PrecisaoEtaHoraChart;

