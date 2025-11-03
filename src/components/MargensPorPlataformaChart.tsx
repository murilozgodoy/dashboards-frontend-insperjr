import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface Plataforma {
  plataforma: string;
  receita_bruta: number;
  comissao_pct: number;
  comissao_brl: number;
  receita_liquida: number;
  margem_pct: number;
}

interface Props {
  data: Plataforma[];
}

const MargensPorPlataformaChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="plataforma" 
          tick={{ fontSize: 12 }} 
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
        <Tooltip 
          formatter={(value: any) => `${value.toFixed(2)}%`}
          labelFormatter={(label) => `Plataforma: ${label}`}
        />
        <Bar dataKey="margem_pct" name="Margem %" fill={CHART_COLORS.amarelo}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS.amarelo} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MargensPorPlataformaChart;

