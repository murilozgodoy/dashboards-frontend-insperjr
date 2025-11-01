import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EtaVsRealScatterChartProps {
  data: { eta: number; real: number }[];
}

const EtaVsRealScatterChart: React.FC<EtaVsRealScatterChartProps> = ({ data }) => {
  //isso sseria linha de x=y
  const { maxValue, dataComCores } = useMemo(() => {
    if (data.length === 0) {
      return { maxValue: 100, dataComCores: [] };
    }
    const maxEta = Math.max(...data.map(d => d.eta));
    const maxReal = Math.max(...data.map(d => d.real));
    const max = Math.ceil(Math.max(maxEta, maxReal) * 1.1);
    
    const dataColored = data.map(d => {
      const diff = d.real - d.eta;
      //verde se estiver próximo da linha (diferença menor uou igual a 5 min)
      //vermelho se atrasado (real > eta)
      //aazul se antecipado (real < eta)
      let color = '#3b82f6';
      if (Math.abs(diff) <= 5) {
        color = '#10b981'; 
      } else if (diff > 5) {
        color = '#ef4444'; 
      } else {
        color = '#3b82f6';
      }
      return { ...d, color };
    });
    
    return {
      maxValue: max,
      dataComCores: dataColored
    };
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          type="number" 
          dataKey="eta" 
          name="ETA (min)" 
          label={{ value: 'ETA Estimado (min)', position: 'insideBottom', offset: -5 }}
          domain={[0, maxValue]}
        />
        <YAxis 
          type="number" 
          dataKey="real" 
          name="Real (min)" 
          label={{ value: 'Tempo Real (min)', angle: -90, position: 'insideLeft' }}
          domain={[0, maxValue]}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          formatter={(value: number, name: string, props: any) => {
            if (name === 'real') {
              const diff = props.payload.real - props.payload.eta;
              const diffText = diff > 0 ? `+${diff.toFixed(1)} min` : `${diff.toFixed(1)} min`;
              return [`${value.toFixed(1)} min (${diffText})`, 'Tempo Real'];
            }
            if (name === 'eta') return [`${value.toFixed(1)} min`, 'ETA Estimado'];
            return [value, name];
          }}
        />
        <Scatter 
          name="Pedidos" 
          data={dataComCores}
          fillOpacity={0.6}
        >
          {dataComCores.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default EtaVsRealScatterChart;

