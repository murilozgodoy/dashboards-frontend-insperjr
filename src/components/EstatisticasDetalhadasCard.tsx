import React from 'react';
import styled from 'styled-components';

interface EstatisticasDetalhadasCardProps {
  preparo: { min: number; max: number; media: number; p50: number; p75: number; p95: number };
  entrega: { min: number; max: number; media: number; p50: number; p75: number; p95: number };
}

const EstatisticasDetalhadasCard: React.FC<EstatisticasDetalhadasCardProps> = ({ preparo, entrega }) => {
  const formatValue = (value: number) => value.toFixed(1);

  return (
    <CardContainer>
      <CardTitle>Estatísticas Detalhadas</CardTitle>
      <CardDescription>
        Percentis mostram a distribuição: P50 = mediana (50% abaixo), P75 = 75% abaixo, P95 = 95% abaixo
      </CardDescription>
      
      <StatsGrid>
        <StatsSection>
          <SectionTitle>Preparo (minutos)</SectionTitle>
          <StatRow>
            <StatLabel>Mínimo:</StatLabel>
            <StatValue>{formatValue(preparo.min)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Máximo:</StatLabel>
            <StatValue>{formatValue(preparo.max)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Média:</StatLabel>
            <StatValue $highlight>{formatValue(preparo.media)}</StatValue>
          </StatRow>
          <Divider />
          <StatRow>
            <StatLabel>P50 (Mediana):</StatLabel>
            <StatValue>{formatValue(preparo.p50)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>P75:</StatLabel>
            <StatValue>{formatValue(preparo.p75)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>P95:</StatLabel>
            <StatValue>{formatValue(preparo.p95)}</StatValue>
          </StatRow>
        </StatsSection>

        <StatsSection>
          <SectionTitle>Entrega (minutos)</SectionTitle>
          <StatRow>
            <StatLabel>Mínimo:</StatLabel>
            <StatValue>{formatValue(entrega.min)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Máximo:</StatLabel>
            <StatValue>{formatValue(entrega.max)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Média:</StatLabel>
            <StatValue $highlight>{formatValue(entrega.media)}</StatValue>
          </StatRow>
          <Divider />
          <StatRow>
            <StatLabel>P50 (Mediana):</StatLabel>
            <StatValue>{formatValue(entrega.p50)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>P75:</StatLabel>
            <StatValue>{formatValue(entrega.p75)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>P95:</StatLabel>
            <StatValue>{formatValue(entrega.p95)}</StatValue>
          </StatRow>
        </StatsSection>
      </StatsGrid>
    </CardContainer>
  );
};

export default EstatisticasDetalhadasCard;

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
`;

const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #718096;
  margin: 0 0 1.5rem 0;
  font-style: italic;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
`;

const StatValue = styled.span<{ $highlight?: boolean }>`
  font-size: ${props => props.$highlight ? '1rem' : '0.875rem'};
  font-weight: ${props => props.$highlight ? 700 : 600};
  color: ${props => props.$highlight ? '#1a202c' : '#4a5568'};
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
`;

