import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface VolumePorBairroChartProps {
  data: { bairro: string; volume: number; satisfacao?: number }[];
}

const VolumePorBairroChart: React.FC<VolumePorBairroChartProps> = ({ data }) => {
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
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
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: 'Volume de Pedidos', angle: -90, position: 'insideLeft' }} />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tick={{ fontSize: 12 }} 
          label={{ value: 'Satisfação', angle: 90, position: 'insideRight' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: any, name: string) => {
            if (name === 'volume') return [`${value} pedidos`, 'Volume'];
            if (name === 'satisfacao') return [value.toFixed(2), 'Satisfação'];
            return value;
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="volume" name="Volume de Pedidos" fill={CHART_COLORS.amarelo} radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS.amarelo} />
          ))}
        </Bar>
        {data.some(d => d.satisfacao !== undefined) && (
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="satisfacao" 
            name="Satisfação Média" 
            stroke={CHART_COLORS.marrom} 
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.marrom, r: 4 }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default VolumePorBairroChart;


