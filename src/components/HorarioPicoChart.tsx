import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Item {
  hora: number;
  quantidade: number;
}

interface Props {
  data: Item[];
}

const HorarioPicoChart: React.FC<Props> = ({ data }) => {
  // Preencher horas faltantes com 0
  const horasCompletas = Array.from({ length: 24 }, (_, i) => {
    const item = data.find(d => d.hora === i);
    return {
      hora: i,
      quantidade: item ? item.quantidade : 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={horasCompletas} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hora" 
          label={{ value: 'Hora do Dia', position: 'insideBottom', offset: -5 }}
        />
        <YAxis label={{ value: 'Pedidos', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(v: any) => `${v.toLocaleString('pt-BR')} pedidos`} />
        <Legend />
        <Bar dataKey="quantidade" name="Pedidos" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorarioPicoChart;

