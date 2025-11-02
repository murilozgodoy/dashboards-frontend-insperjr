import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface TipoData {
  tipo: string;
  ticket_medio: number;
  receita_bruta: number;
  comissao_brl: number;
  receita_liquida: number;
  margem_pct: number;
}

interface Props {
  data: TipoData[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

const RentabilidadePorTipoChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(value) => currency.format(value)} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'receita_bruta' || name === 'receita_liquida') {
              return currency.format(value);
            }
            if (name === 'margem_pct') {
              return `${value.toFixed(2)}%`;
            }
            return value;
          }}
          labelFormatter={(label) => `Tipo: ${label}`}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="receita_bruta" name="Receita Bruta" fill="#3b82f6" />
        <Bar yAxisId="left" dataKey="receita_liquida" name="Receita Líquida" fill="#22c55e" />
        <Bar yAxisId="right" dataKey="margem_pct" name="Margem %" fill="#f59e0b">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="#f59e0b" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RentabilidadePorTipoChart;

