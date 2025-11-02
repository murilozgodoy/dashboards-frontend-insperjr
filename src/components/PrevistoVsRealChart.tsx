import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface Item {
  periodo: string;
  pedidos_real: number;
  pedidos_previsto: number;
}

interface Props {
  data: Item[];
}

const PrevistoVsRealChart: React.FC<Props> = ({ data }) => {
  // Formatar data para exibição
  const formatPeriodo = (periodo: string) => {
    try {
      const date = new Date(periodo);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
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
        <YAxis />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'pedidos_real') {
              return [`${value.toLocaleString('pt-BR')} pedidos`, 'Pedidos Reais'];
            }
            if (name === 'pedidos_previsto') {
              return [`${Number(value).toFixed(0)} pedidos`, 'Pedidos Previstos (Média Histórica)'];
            }
            return value;
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="pedidos_real" 
          name="Pedidos Reais" 
          stroke={CHART_COLORS.marrom} 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="pedidos_previsto" 
          name="Pedidos Previstos (Média Histórica)" 
          stroke={CHART_COLORS.amarelo} 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PrevistoVsRealChart;

