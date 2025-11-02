import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface Item {
  dia_semana: string;
  total_pedidos: number;
  media_pedidos: number;
}

interface Props {
  data: Item[];
}

const TendenciasDiariasChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 8, right: 16, left: 80, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="dia_semana" type="category" width={70} />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'media_pedidos') {
              return [`${Number(value).toFixed(2)} pedidos/dia`, 'Média de Pedidos'];
            }
            return [`${value.toLocaleString('pt-BR')} pedidos`, 'Total de Pedidos'];
          }}
        />
        <Legend />
        <Bar dataKey="media_pedidos" name="Média de Pedidos" fill={CHART_COLORS.azul} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TendenciasDiariasChart;

