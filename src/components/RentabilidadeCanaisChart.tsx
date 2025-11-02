import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { CHART_COLORS } from '../config/colors';

interface CanaisData {
  marketplaces: {
    receita_bruta: number;
    comissao_pct: number;
    comissao_brl: number;
    receita_liquida: number;
    margem_pct: number;
  };
  canais_proprios: {
    receita_bruta: number;
    comissao_brl: number;
    receita_liquida: number;
    margem_pct: number;
  };
}

interface Props {
  data: CanaisData;
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const RentabilidadeCanaisChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    {
      tipo: 'Marketplaces',
      receita_bruta: data.marketplaces.receita_bruta,
      receita_liquida: data.marketplaces.receita_liquida,
      margem: data.marketplaces.margem_pct
    },
    {
      tipo: 'Canais Próprios',
      receita_bruta: data.canais_proprios.receita_bruta,
      receita_liquida: data.canais_proprios.receita_liquida,
      margem: data.canais_proprios.margem_pct
    }
  ];

  const comparacaoData = [
    {
      tipo: 'Marketplaces',
      receita_bruta: data.marketplaces.receita_bruta,
      comissao: data.marketplaces.comissao_brl,
      receita_liquida: data.marketplaces.receita_liquida
    },
    {
      tipo: 'Canais Próprios',
      receita_bruta: data.canais_proprios.receita_bruta,
      comissao: 0,
      receita_liquida: data.canais_proprios.receita_liquida
    }
  ];

  return (
    <Container>
      <ChartSection>
        <ChartTitle>Margem % por Tipo de Canal</ChartTitle>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="margem" name="Margem %" fill={CHART_COLORS.azul} />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      <DetailsSection>
        <DetailsTitle>Comparação Detalhada</DetailsTitle>
        
        <DetailsCard>
          <DetailsCardTitle>Marketplaces</DetailsCardTitle>
          <DetailRow>
            <DetailLabel>Receita Bruta:</DetailLabel>
            <DetailValue>{currency.format(data.marketplaces.receita_bruta)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Comissão %:</DetailLabel>
            <DetailValue>{data.marketplaces.comissao_pct.toFixed(2)}%</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Comissão (R$):</DetailLabel>
            <DetailValue color="#ef4444">-{currency.format(data.marketplaces.comissao_brl)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Receita Líquida:</DetailLabel>
            <DetailValue>{currency.format(data.marketplaces.receita_liquida)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Margem %:</DetailLabel>
            <DetailValue>{data.marketplaces.margem_pct.toFixed(2)}%</DetailValue>
          </DetailRow>
        </DetailsCard>

        <DetailsCard>
          <DetailsCardTitle>Canais Próprios</DetailsCardTitle>
          <DetailRow>
            <DetailLabel>Receita Bruta:</DetailLabel>
            <DetailValue>{currency.format(data.canais_proprios.receita_bruta)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Comissão:</DetailLabel>
            <DetailValue color="#22c55e">R$ 0,00</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Receita Líquida:</DetailLabel>
            <DetailValue>{currency.format(data.canais_proprios.receita_liquida)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Margem %:</DetailLabel>
            <DetailValue color="#22c55e">{data.canais_proprios.margem_pct.toFixed(2)}%</DetailValue>
          </DetailRow>
        </DetailsCard>
      </DetailsSection>
    </Container>
  );
};

export default RentabilidadeCanaisChart;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChartTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const DetailsCard = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
`;

const DetailsCardTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #718096;
`;

const DetailValue = styled.span<{ color?: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.color || '#1a202c'};
`;

