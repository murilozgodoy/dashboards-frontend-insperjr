import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PrecisaoEtaHoraChartProps {
  data: { hora: number; precisao_pct: number; total_pedidos: number }[];
}

const getColor = (precisao: number, totalPedidos: number) => {
  if (totalPedidos === 0) return '#cbd5e0'; // cinza claro
  if (precisao >= 80) return '#10b981'; // verde
  if (precisao >= 60) return '#f59e0b'; // amarelo
  return '#ef4444'; // vermelho
};

const PrecisaoEtaHoraChart: React.FC<PrecisaoEtaHoraChartProps> = ({ data }) => {

  const sortedData = [...data].sort((a, b) => a.hora - b.hora);
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={sortedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="hora" 
          tick={{ fontSize: 10 }}
          label={{ value: 'Hora do Dia', position: 'insideBottom', offset: -5 }}
          type="number"
          domain={[0, 23]}
          ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]}
          tickFormatter={(value) => `${value}h`}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ value: 'Precisão (%)', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          labelFormatter={(label) => `Hora: ${label}:00`}
          formatter={(value: number, name: string, props: any) => {
            
            if (name === 'precisao_pct' || name === 'Precisão (%)' || name?.includes('Precisão')) {
              const totalPedidos = props.payload?.total_pedidos || 0;
              if (totalPedidos === 0) {
                return ['Sem dados', 'Precisão'];
              }
              const dentroPrazo = Math.round((value / 100) * totalPedidos);
              return [
                `${value.toFixed(1)}% (${dentroPrazo} de ${totalPedidos} pedidos)`,
                'Precisão'
              ];
            }
           
            return null;
          }}
        />
        <Bar dataKey="precisao_pct" name="Precisão (%)" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.precisao_pct, entry.total_pedidos)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PrecisaoEtaHoraChart;

