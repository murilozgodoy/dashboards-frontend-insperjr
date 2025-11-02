import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

type Ponto = { periodo: string; receita: number; pedidos: number };

interface Props {
  data: Ponto[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const LineChartReceita: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: any, n: any) => (n === 'receita' ? currency.format(v as number) : v)} />
        <Legend />
        <Line type="monotone" yAxisId="left" dataKey="receita" stroke={CHART_COLORS.amarelo} name="Receita" strokeWidth={2} dot={false} />
        <Line type="monotone" yAxisId="right" dataKey="pedidos" stroke={CHART_COLORS.marrom} name="Pedidos" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartReceita;


