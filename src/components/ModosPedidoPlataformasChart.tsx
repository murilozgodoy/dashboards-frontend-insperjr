import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { CHART_COLORS } from '../config/colors';

interface ModosPedidoPlataformasChartProps {
  dados: {
    plataforma: string;
    delivery: number;
    retirada: number;
    total: number;
  }[];
}

const CORES = {
  delivery: CHART_COLORS.vermelho,
  retirada: CHART_COLORS.amarelo
};

const ModosPedidoPlataformasChart: React.FC<ModosPedidoPlataformasChartProps> = ({ dados }) => {
  const [modoVisualizacao, setModoVisualizacao] = useState<'absoluto' | 'percentual' | 'comparativo'>('absoluto');

  if (dados.length === 0) {
    return (
      <Container>
        <TituloGrafico>Modos de Pedido por Plataforma</TituloGrafico>
        <MensagemVazio>Sem dados para exibir</MensagemVazio>
      </Container>
    );
  }

  const dadosAbsolutos = dados.map(p => ({
    plataforma: p.plataforma,
    delivery: p.delivery,
    retirada: p.retirada,
    total: p.total
  }));

  const dadosPercentual = dados.map(p => ({
    plataforma: p.plataforma,
    delivery: p.total > 0 ? (p.delivery / p.total) * 100 : 0,
    retirada: p.total > 0 ? (p.retirada / p.total) * 100 : 0,
    total: 100
  }));

  const dadosComparativo = dados.map(p => ({
    plataforma: p.plataforma,
    Delivery: p.delivery,
    Retirada: p.retirada,
    total: p.total
  }));

  const dadosParaGrafico = 
    modoVisualizacao === 'absoluto' ? dadosAbsolutos :
    modoVisualizacao === 'percentual' ? dadosPercentual :
    dadosComparativo;

  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const dadosOriginais = dados.find(d => d.plataforma === label);
    if (!dadosOriginais) return null;

    return (
      <TooltipContainer>
        <TooltipTitle>{label}</TooltipTitle>
        {modoVisualizacao === 'comparativo' ? (
          <>
            {payload.map((entry: any, idx: number) => (
              <TooltipLine key={idx}>
                <span style={{ color: entry.color }}>●</span>
                <strong>{entry.name}:</strong> {entry.value.toLocaleString('pt-BR')} pedidos
              </TooltipLine>
            ))}
            <TooltipLine>
              <strong>Total:</strong> {dadosOriginais.total.toLocaleString('pt-BR')} pedidos
            </TooltipLine>
          </>
        ) : modoVisualizacao === 'percentual' ? (
          <>
            {payload.map((entry: any, idx: number) => {
              const valorPercentual = entry.value;
              const valorAbsoluto = entry.dataKey === 'delivery' 
                ? dadosOriginais.delivery 
                : dadosOriginais.retirada;
              return (
                <TooltipLine key={idx}>
                  <span style={{ color: entry.color }}>●</span>
                  <strong>{entry.name}:</strong> {valorPercentual.toFixed(1)}% ({valorAbsoluto.toLocaleString('pt-BR')} pedidos)
                </TooltipLine>
              );
            })}
            <TooltipLine>
              <strong>Total:</strong> {dadosOriginais.total.toLocaleString('pt-BR')} pedidos
            </TooltipLine>
          </>
        ) : (
          <>
            {payload.map((entry: any, idx: number) => (
              <TooltipLine key={idx}>
                <span style={{ color: entry.color }}>●</span>
                <strong>{entry.name}:</strong> {entry.value.toLocaleString('pt-BR')} pedidos
              </TooltipLine>
            ))}
            <TooltipLine>
              <strong>Total:</strong> {dadosOriginais.total.toLocaleString('pt-BR')} pedidos
            </TooltipLine>
          </>
        )}
      </TooltipContainer>
    );
  };

  return (
    <Container>
      <Cabecalho>
        <TituloGrafico>Modos de Pedido por Plataforma</TituloGrafico>
        <ToggleGroup>
          <ToggleButton 
            $active={modoVisualizacao === 'absoluto'}
            onClick={() => setModoVisualizacao('absoluto')}
          >
            Absoluto
          </ToggleButton>
          <ToggleButton 
            $active={modoVisualizacao === 'percentual'}
            onClick={() => setModoVisualizacao('percentual')}
          >
            Percentual
          </ToggleButton>
          <ToggleButton 
            $active={modoVisualizacao === 'comparativo'}
            onClick={() => setModoVisualizacao('comparativo')}
          >
            Comparativo
          </ToggleButton>
        </ToggleGroup>
      </Cabecalho>

      <ResponsiveContainer width="100%" height={400}>
        {modoVisualizacao === 'comparativo' ? (
          <BarChart
            data={dadosComparativo}
            margin={{ top: 8, right: 16, left: 8, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="plataforma" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Pedidos', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
            />
            <Legend />
            <Bar dataKey="Delivery" name="Delivery" fill={CORES.delivery} />
            <Bar dataKey="Retirada" name="Retirada" fill={CORES.retirada} />
          </BarChart>
        ) : (
          <BarChart
            data={dadosParaGrafico}
            margin={{ top: 8, right: 16, left: 8, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="plataforma" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ 
                value: modoVisualizacao === 'percentual' ? 'Percentual (%)' : 'Pedidos', 
                angle: -90, 
                position: 'insideLeft' 
              }}
              domain={modoVisualizacao === 'percentual' ? [0, 100] : undefined}
            />
            <Tooltip 
              content={<CustomTooltip />}
            />
            <Legend />
            <Bar dataKey="delivery" name="Delivery" stackId="a" fill={CORES.delivery} />
            <Bar dataKey="retirada" name="Retirada" stackId="a" fill={CORES.retirada} />
          </BarChart>
        )}
      </ResponsiveContainer>

      <LegendaAdicional>
        <LegendaItem>
          <LegendaCor cor={CORES.delivery} />
          <span><strong>Delivery:</strong> Pedidos entregues</span>
        </LegendaItem>
        <LegendaItem>
          <LegendaCor cor={CORES.retirada} />
          <span><strong>Retirada:</strong> Pedidos retirados pelo cliente</span>
        </LegendaItem>
      </LegendaAdicional>
    </Container>
  );
};

export default ModosPedidoPlataformasChart;

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
  border: 1px solid ${props => props.$active ? CHART_COLORS.marrom : '#e2e8f0'};
  background-color: ${props => props.$active ? CHART_COLORS.marrom : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${CHART_COLORS.marrom};
    background-color: ${props => props.$active ? '#78350f' : '#f7f1ef'};
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

const TooltipContainer = styled.div`
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  padding: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 8px;
  color: #1a202c;
  text-transform: capitalize;
`;

const TooltipLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  span {
    font-size: 12px;
  }
  
  strong {
    margin-right: 4px;
  }
`;

const LegendaAdicional = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
`;

const LegendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const LegendaCor = styled.div<{ cor: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.cor};
`;
