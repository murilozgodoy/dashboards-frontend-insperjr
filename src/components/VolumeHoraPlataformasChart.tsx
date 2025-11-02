import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

interface DadosHora {
  hora: number;
  [key: string]: number;
}

interface DadosDiaSemana {
  dia: string;
  dia_ordem: number;
  [key: string]: string | number;
}

interface VolumeHoraPlataformasChartProps {
  dados: DadosHora[];
  dadosDiaSemana?: DadosDiaSemana[];
}

const CORES_PLATAFORMAS: { [key: string]: string } = {
  'ifood': '#EA1D2C',
  'rappi': '#FF6B00',
  'site_proprio': '#3b82f6',
  'whatsapp': '#25D366'
};

const NOMES_PLATAFORMAS: { [key: string]: string } = {
  'ifood': 'iFood',
  'rappi': 'Rappi',
  'site_proprio': 'Site Próprio',
  'whatsapp': 'WhatsApp'
};

const VolumeHoraPlataformasChart: React.FC<VolumeHoraPlataformasChartProps> = ({ dados, dadosDiaSemana = [] }) => {
  const [modoVisualizacao, setModoVisualizacao] = useState<'hora' | 'diaSemana'>('hora');

  const plataformas = useMemo(() => {
    const dadosAtivos = modoVisualizacao === 'hora' ? dados : dadosDiaSemana;
    if (dadosAtivos.length === 0) return [];
    
    const platforms = new Set<string>();
    dadosAtivos.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'hora' && key !== 'dia' && key !== 'dia_ordem') {
          platforms.add(key);
        }
      });
    });
    return Array.from(platforms);
  }, [dados, dadosDiaSemana, modoVisualizacao]);

  const dadosParaGrafico = modoVisualizacao === 'hora' ? dados : dadosDiaSemana;
  const ordenarDias = modoVisualizacao === 'diaSemana' && dadosDiaSemana.length > 0;

  const dadosOrdenados = useMemo(() => {
    if (modoVisualizacao === 'diaSemana' && ordenarDias) {
      return [...dadosDiaSemana].sort((a, b) => a.dia_ordem - b.dia_ordem);
    }
    return dadosParaGrafico;
  }, [dadosParaGrafico, modoVisualizacao, ordenarDias, dadosDiaSemana]);

  if (dadosParaGrafico.length === 0 || plataformas.length === 0) {
    return (
      <Container>
        <Cabecalho>
          <TituloGrafico>Volume de Pedidos</TituloGrafico>
        </Cabecalho>
        <MensagemVazio>Sem dados para exibir</MensagemVazio>
      </Container>
    );
  }

  return (
    <Container>
      <Cabecalho>
        <TituloGrafico>Volume de Pedidos</TituloGrafico>
        <ToggleGroup>
          <ToggleButton 
            $active={modoVisualizacao === 'hora'}
            onClick={() => setModoVisualizacao('hora')}
          >
            Por Hora do Dia
          </ToggleButton>
          <ToggleButton 
            $active={modoVisualizacao === 'diaSemana'}
            onClick={() => setModoVisualizacao('diaSemana')}
          >
            Por Dia da Semana
          </ToggleButton>
        </ToggleGroup>
      </Cabecalho>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosOrdenados} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey={modoVisualizacao === 'hora' ? 'hora' : 'dia'}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (modoVisualizacao === 'hora') {
                return `${value}h`;
              }
              return value;
            }}
            domain={modoVisualizacao === 'hora' ? [0, 23] : undefined}
            type={modoVisualizacao === 'hora' ? 'number' : 'category'}
            ticks={modoVisualizacao === 'hora' ? Array.from({ length: 24 }, (_, i) => i) : undefined}
            interval={modoVisualizacao === 'hora' ? 0 : undefined}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Pedidos', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Pedidos']}
            labelFormatter={(label) => {
              if (modoVisualizacao === 'hora') {
                return `${label}h`;
              }
              return label;
            }}
          />
          <Legend />
          {plataformas.map((plat) => (
            <Line
              key={plat}
              type="monotone"
              dataKey={plat}
              name={NOMES_PLATAFORMAS[plat] || plat}
              stroke={CORES_PLATAFORMAS[plat] || '#3b82f6'}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default VolumeHoraPlataformasChart;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TituloGrafico = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${props => props.$active ? '#792810' : '#e2e8f0'};
  background-color: ${props => props.$active ? '#792810' : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #792810;
    background-color: ${props => props.$active ? '#5C1F0C' : '#f7f1ef'};
  }
`;

const MensagemVazio = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #a0aec0;
  font-size: 0.875rem;
`;


