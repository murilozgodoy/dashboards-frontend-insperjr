import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';
import { CHART_COLORS_ARRAY, getChartColor } from '../config/colors';

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
              <Cell key={idx} fill={getChartColor(idx)} />
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
            <Cell key={idx} fill={getChartColor(idx)} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => `${(v * 100).toFixed(1)}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DistribuicaoPlataformasChart;


