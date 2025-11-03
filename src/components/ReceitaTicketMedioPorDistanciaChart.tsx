import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface ReceitaTicketDistanciaProps {
  data: { faixa: string; receita: number; ticket_medio?: number }[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const ReceitaTicketMedioPorDistanciaChart: React.FC<ReceitaTicketDistanciaProps> = ({ data }) => {
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="faixa" 
          tick={{ fontSize: 12 }}
        />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(value) => currency.format(value)} />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value: any) => currency.format(value)}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: any, name: string) => {
            if (name === 'receita') return [currency.format(value), 'Receita'];
            if (name === 'ticket_medio') return [currency.format(value), 'Ticket Médio'];
            return value;
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="receita" name="Receita" fill={CHART_COLORS.amarelo} radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS.amarelo} />
          ))}
        </Bar>
        {data.some(d => d.ticket_medio !== undefined) && (
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="ticket_medio" 
            name="Ticket Médio" 
            stroke={CHART_COLORS.marrom} 
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.marrom, r: 4 }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ReceitaTicketMedioPorDistanciaChart;

