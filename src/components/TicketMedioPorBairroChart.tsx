import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface TicketMedioPorBairroChartProps {
  data: { bairro: string; ticket_medio: number }[];
}

const TicketMedioPorBairroChart: React.FC<TicketMedioPorBairroChartProps> = ({ data }) => {
  
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="bairro" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: number) => [currency.format(value), 'Ticket Médio']}
        />
        <Bar dataKey="ticket_medio" radius={[8, 8, 0, 0]} fill={CHART_COLORS.azul}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS.azul} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TicketMedioPorBairroChart;


