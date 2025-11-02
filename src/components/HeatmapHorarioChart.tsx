import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Item {
  dia_semana: string;
  hora: number;
  quantidade: number;
}

interface Props {
  data: Item[];
}

const DIAS_ORDEM = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const HORAS = Array.from({ length: 24 }, (_, i) => i);

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const HeatmapHorarioChart: React.FC<Props> = ({ data }) => {
  // Agrupar dados por dia da semana
  const dadosPorDia = useMemo(() => {
    const agrupado: Record<string, Record<number, number>> = {};
    
    DIAS_ORDEM.forEach(dia => {
      agrupado[dia] = {};
      HORAS.forEach(hora => {
        agrupado[dia][hora] = 0;
      });
    });

    data.forEach(item => {
      if (!agrupado[item.dia_semana]) {
        agrupado[item.dia_semana] = {};
      }
      agrupado[item.dia_semana][item.hora] = item.quantidade;
    });

    return DIAS_ORDEM.map(dia => ({
      dia,
      ...agrupado[dia]
    }));
  }, [data]);

  // Para o heatmap, vamos mostrar a média de pedidos por hora em todos os dias
  const dadosPorHora = useMemo(() => {
    return HORAS.map(hora => {
      const total = data.filter(d => d.hora === hora).reduce((sum, d) => sum + d.quantidade, 0);
      const count = new Set(data.filter(d => d.hora === hora).map(d => d.dia_semana)).size;
      return {
        hora: `${hora}h`,
        media: count > 0 ? Math.round(total / count) : 0
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dadosPorHora} margin={{ top: 8, right: 16, left: 8, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hora" 
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis label={{ value: 'Média de Pedidos', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(v: any) => `${v} pedidos (média)`} />
        <Legend />
        <Bar dataKey="media" name="Média de Pedidos por Hora" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HeatmapHorarioChart;

