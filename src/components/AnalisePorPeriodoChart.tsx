import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface AnalisePorPeriodoChartProps {
  data: { 
    periodo: string; 
    quantidade: number; 
    tempo_preparo_medio: number; 
    tempo_entrega_medio: number; 
    taxa_atraso_pct: number; 
    precisao_eta_pct: number 
  }[];
}

const COLORS = {
  atraso: CHART_COLORS.vermelho,
  precisao: CHART_COLORS.marrom
};

const AnalisePorPeriodoChart: React.FC<AnalisePorPeriodoChartProps> = ({ data }) => {
  const dadosFiltrados = data.filter(item => item.quantidade > 0);

  //taxa de atraso e precisão
  const dadosMetricas = dadosFiltrados.map(item => ({
    periodo: item.periodo,
    'Taxa de Atraso': item.taxa_atraso_pct,
    'Precisão ETA': item.precisao_eta_pct
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/*gráfico de metricas*/}
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4a5568', marginBottom: '1rem' }}>
          Métricas de Performance (%)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosMetricas} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="periodo" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Percentual (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px'
              }}
              formatter={(value: number, name: string) => {
                return [`${value.toFixed(1)}%`, name];
              }}
            />
            <Legend />
            <Bar 
              dataKey="Taxa de Atraso" 
              fill={COLORS.atraso}
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="Precisão ETA" 
              fill={COLORS.precisao}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/*cards comresumo */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {dadosFiltrados.map((item, index) => (
          <div 
            key={index}
            style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.5rem' }}>
              {item.periodo}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
              {item.quantidade}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4a5568' }}>
              pedidos
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalisePorPeriodoChart;

