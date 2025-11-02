import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Item {
  dia_semana: string;
  valor: number;
}

interface Props {
  data: Item[];
  metric?: 'pedidos' | 'receita';
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const SazonalidadeSemanalChart: React.FC<Props> = ({ data, metric = 'pedidos' }) => {
  const formatter = (value: any) => {
    if (metric === 'receita') {
      return currency.format(value);
    }
    return `${value.toLocaleString('pt-BR')} pedidos`;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dia_semana" />
        <YAxis />
        <Tooltip formatter={formatter} />
        <Legend />
        <Bar dataKey="valor" name={metric === 'receita' ? 'Receita' : 'Pedidos'} fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SazonalidadeSemanalChart;

