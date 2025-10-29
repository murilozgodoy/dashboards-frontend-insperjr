import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

interface Item {
  nome: string;
  pedidos?: number;
  receita?: number;
  pct: number;
}

interface Props {
  data: Item[];
  mode?: 'pie' | 'bar';
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];

const DistribuicaoPlataformasChart: React.FC<Props> = ({ data, mode = 'pie' }) => {
  if (mode === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip formatter={(v: any) => `${(v * 100).toFixed(1)}%`} />
          <Legend />
          <Bar dataKey="pct" name="% do total">
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={data} dataKey="pct" nameKey="nome" outerRadius={110} label>
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => `${(v * 100).toFixed(1)}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DistribuicaoPlataformasChart;


