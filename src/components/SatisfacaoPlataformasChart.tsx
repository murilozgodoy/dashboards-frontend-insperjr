import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components';

interface SatisfacaoPlataformasChartProps {
  dados: {
    plataforma: string;
    satisfacao_media: number;
    total_avaliacoes: number;
    distribuicao: {
      nivel_1: number;
      nivel_2: number;
      nivel_3: number;
      nivel_4: number;
      nivel_5: number;
    };
  }[];
}

const SatisfacaoPlataformasChart: React.FC<SatisfacaoPlataformasChartProps> = ({ dados }) => {
  if (dados.length === 0) {
    return (
      <Container>
        <TituloGrafico>Satisfação do Cliente por Plataforma</TituloGrafico>
        <MensagemVazio>Sem dados para exibir</MensagemVazio>
      </Container>
    );
  }

  const chartData = dados.map(item => ({
    plataforma: item.plataforma,
    satisfacao_media: item.satisfacao_media,
    total_avaliacoes: item.total_avaliacoes
  }));

  return (
    <Container>
      <TituloGrafico>Satisfação do Cliente por Plataforma</TituloGrafico>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="plataforma" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 5]}
            label={{ value: 'Nota (1-5)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'satisfacao_media') {
                return [`${value.toFixed(2)}`, 'Satisfação Média'];
              }
              return [value.toLocaleString('pt-BR'), 'Total de Avaliações'];
            }}
          />
          <Legend />
          <Bar dataKey="satisfacao_media" name="Satisfação Média" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default SatisfacaoPlataformasChart;

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


