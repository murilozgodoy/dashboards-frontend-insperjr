import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TemposPorHoraChartProps {
  data: { hora: number; tempo_preparo_medio: number; tempo_entrega_medio: number; quantidade: number }[];
}

const TemposPorHoraChart: React.FC<TemposPorHoraChartProps> = ({ data }) => {
  //isso seriria para formatar hora 
  const dataFormatada = data.map(item => ({
    ...item,
    horaLabel: `${item.hora}:00`
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={dataFormatada}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="horaLabel" 
          tick={{ fontSize: 12 }}
          label={{ value: 'Hora do Dia', position: 'insideBottom', offset: -5 }}
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
        <Line 
          type="monotone" 
          dataKey="tempo_preparo_medio" 
          stroke="#f59e0b" 
          strokeWidth={2}
          name="Tempo Preparo"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line 
          type="monotone" 
          dataKey="tempo_entrega_medio" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Tempo Entrega"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemposPorHoraChart;

