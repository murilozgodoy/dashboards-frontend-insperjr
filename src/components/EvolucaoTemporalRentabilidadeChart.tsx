import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface DadosTemporais {
  periodo: string;
  receita_bruta: number;
  comissoes: number;
  receita_liquida: number;
  margem_pct: number;
}

interface Props {
  data: DadosTemporais[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const EvolucaoTemporalRentabilidadeChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(value) => currency.format(value)} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'receita_bruta' || name === 'comissoes' || name === 'receita_liquida') {
              return currency.format(value);
            }
            if (name === 'margem_pct') {
              return `${value.toFixed(2)}%`;
            }
            return value;
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          yAxisId="left" 
          dataKey="receita_bruta" 
          stroke={CHART_COLORS.amarelo} 
          name="Receita Bruta" 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          yAxisId="left" 
          dataKey="comissoes" 
          stroke={CHART_COLORS.marrom} 
          name="Comissões" 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          yAxisId="left" 
          dataKey="receita_liquida" 
          stroke={CHART_COLORS.amarelo} 
          name="Receita Líquida" 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          yAxisId="right" 
          dataKey="margem_pct" 
          stroke={CHART_COLORS.marrom} 
          name="Margem %" 
          strokeWidth={2} 
          dot={false} 
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoTemporalRentabilidadeChart;

