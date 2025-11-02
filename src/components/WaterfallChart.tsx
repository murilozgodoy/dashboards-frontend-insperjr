import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WaterfallData {
  receita_bruta: number;
  menos_comissao_ifood: number;
  menos_comissao_rappi: number;
  receita_liquida_final: number;
}

interface Props {
  data: WaterfallData;
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const WaterfallChart: React.FC<Props> = ({ data }) => {
  // Preparar dados para o gráfico de cascata (waterfall)
  // As barras de comissão devem começar do eixo X e ser negativas
  const waterfallData = [
    {
      name: 'Receita\nBruta',
      value: data.receita_bruta,
      color: '#22c55e'
    },
    {
      name: 'Menos\niFood',
      value: -Math.abs(data.menos_comissao_ifood), // Negativo para ir para baixo
      color: '#ef4444'
    },
    {
      name: 'Menos\nRappi',
      value: -Math.abs(data.menos_comissao_rappi), // Negativo para ir para baixo
      color: '#ef4444'
    },
    {
      name: 'Receita\nLíquida',
      value: data.receita_liquida_final,
      color: '#3b82f6'
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={waterfallData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => currency.format(value)} />
        <Tooltip 
          formatter={(value: any) => {
            return currency.format(Math.abs(value));
          }}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="value">
          {waterfallData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaterfallChart;

