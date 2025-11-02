import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Item {
  tipo: string;
  quantidade: number;
}

interface Props {
  data: Item[];
}

const COLORS = ['#3b82f6', '#f59e0b'];

const TipoDiaChart: React.FC<Props> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.quantidade, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    porcentagem: ((item.quantidade / total) * 100).toFixed(1)
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie 
          data={dataWithPercentage} 
          dataKey="quantidade" 
          nameKey="tipo" 
          outerRadius={110} 
          label={({ tipo, porcentagem }) => `${tipo}: ${porcentagem}%`}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => `${v.toLocaleString('pt-BR')} pedidos`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TipoDiaChart;

