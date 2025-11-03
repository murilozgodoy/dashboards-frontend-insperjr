import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { CHART_COLORS } from '../config/colors';

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
        <Bar yAxisId="left" dataKey="receita_bruta" name="Receita Bruta" fill={CHART_COLORS.amarelo}>
          {data.map((entry, index) => (
            <Cell key={`cell-receita-bruta-${index}`} fill={CHART_COLORS.amarelo} />
          ))}
        </Bar>
        <Bar yAxisId="left" dataKey="receita_liquida" name="Receita Líquida" fill={CHART_COLORS.marrom}>
          {data.map((entry, index) => (
            <Cell key={`cell-receita-liquida-${index}`} fill={CHART_COLORS.marrom} />
          ))}
        </Bar>
        <Bar yAxisId="right" dataKey="margem_pct" name="Margem %" fill={CHART_COLORS.azul}>
          {data.map((entry, index) => (
            <Cell key={`cell-margem-${index}`} fill={CHART_COLORS.azul} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RentabilidadePorTipoChart;

