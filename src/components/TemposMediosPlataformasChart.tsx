import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styled from 'styled-components';

interface TemposMediosPlataformasChartProps {
  dados: {
    plataforma: string;
    tempo_preparo_medio: number;
    tempo_entrega_medio: number;
    eta_medio: number;
  }[];
}

const CORES = {
  preparo: '#3b82f6',
  entrega: '#10b981',
  eta: '#8b5cf6'
};

const TemposMediosPlataformasChart: React.FC<TemposMediosPlataformasChartProps> = ({ dados }) => {
  if (dados.length === 0) {
    return (
      <Container>
        <TituloGrafico>Tempos Médios por Plataforma</TituloGrafico>
        <MensagemVazio>Sem dados para exibir</MensagemVazio>
      </Container>
    );
  }

  return (
    <Container>
      <TituloGrafico>Tempos Médios por Plataforma</TituloGrafico>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={dados}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="plataforma" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number) => `${value.toFixed(1)} min`}
          />
          <Legend />
          <Bar dataKey="tempo_preparo_medio" name="Tempo Preparo" fill={CORES.preparo} />
          <Bar dataKey="tempo_entrega_medio" name="Tempo Entrega" fill={CORES.entrega} />
          <Bar dataKey="eta_medio" name="ETA Estimado" fill={CORES.eta} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default TemposMediosPlataformasChart;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TituloGrafico = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const MensagemVazio = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: #a0aec0;
  font-size: 0.875rem;
`;


