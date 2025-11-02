import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Item {
  periodo: string;
  quantidade: number;
}

interface Props {
  data: Item[];
}

const COLORS = {
  'Madrugada': '#1e293b',
  'Manhã': '#3b82f6',
  'Tarde': '#f59e0b',
  'Noite': '#8b5cf6'
};

const PeriodoDiaChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="periodo" />
        <YAxis />
        <Tooltip formatter={(v: any) => `${v.toLocaleString('pt-BR')} pedidos`} />
        <Legend />
        <Bar dataKey="quantidade" name="Pedidos">
          {data.map((entry, idx) => (
            <Cell key={idx} fill={COLORS[entry.periodo as keyof typeof COLORS] || '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PeriodoDiaChart;

