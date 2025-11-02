import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Item {
  periodo: string;
  pedidos: number;
  receita: number;
  variacao_pedidos_pct: number;
  variacao_receita_pct: number;
}

interface Props {
  data: Item[];
  granularidade?: 'semana' | 'mes';
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const ComparacaoTendenciasChart: React.FC<Props> = ({ data, granularidade = 'semana' }) => {
  // Formatar data para exibição
  const formatPeriodo = (periodo: string) => {
    try {
      const date = new Date(periodo);
      if (granularidade === 'semana') {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else {
        return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      }
    } catch {
      return periodo;
    }
  };

  const dataFormatted = data.map(item => ({
    ...item,
    periodoFormatado: formatPeriodo(item.periodo)
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={dataFormatted} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="periodoFormatado" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'variacao_pedidos_pct') {
              return [`${value >= 0 ? '+' : ''}${Number(value).toFixed(2)}%`, 'Variação Pedidos'];
            }
            if (name === 'variacao_receita_pct') {
              return [`${value >= 0 ? '+' : ''}${Number(value).toFixed(2)}%`, 'Variação Receita'];
            }
            return value;
          }}
        />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="variacao_pedidos_pct" 
          name="Variação Pedidos (%)" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="variacao_receita_pct" 
          name="Variação Receita (%)" 
          stroke="#22c55e" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComparacaoTendenciasChart;

