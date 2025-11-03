import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../services/api';

interface SimulacaoProps {
  inicio?: string;
  fim?: string;
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const SimulacaoMix: React.FC<SimulacaoProps> = ({ inicio, fim }) => {
  const [pctCanalProprio, setPctCanalProprio] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulacao, setSimulacao] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inicio && fim) {
      loadSimulacao();
    }
  }, [pctCanalProprio, inicio, fim]);

  useEffect(() => {
    // Inicializar o valor do slider
    const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
    if (slider) {
      slider.style.setProperty('--value', `${pctCanalProprio}%`);
    }
  }, [pctCanalProprio]);

  const loadSimulacao = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getRentabilidadeSimulacao({
        pct_canal_proprio: pctCanalProprio,
        inicio,
        fim
      });
      setSimulacao(data);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar simulação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SliderSection>
        <SliderLabel>
          <span>Percentual de pedidos via canal próprio:</span>
          <SliderValue>{pctCanalProprio}%</SliderValue>
        </SliderLabel>
        <Slider
          type="range"
          min="0"
          max="100"
          value={pctCanalProprio}
          onChange={(e) => {
            const value = Number(e.target.value);
            setPctCanalProprio(value);
            e.currentTarget.style.setProperty('--value', `${value}%`);
          }}
          onInput={(e) => {
            const value = Number((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).style.setProperty('--value', `${value}%`);
          }}
          style={{ '--value': `${pctCanalProprio}%` } as React.CSSProperties}
        />
        <SliderMarks>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </SliderMarks>
      </SliderSection>

      {loading && <LoadingText>Calculando...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      
      {simulacao && !loading && (
        <ResultsSection>
          <ResultCard highlight>
            <ResultLabel>Economia de Comissões</ResultLabel>
            <ResultValue color="#22c55e">
              {currency.format(simulacao.economia_comissoes)}
            </ResultValue>
          </ResultCard>

          <ResultCard highlight>
            <ResultLabel>Aumento de Receita Líquida</ResultLabel>
            <ResultValue color="#22c55e">
              +{simulacao.aumento_receita_liquida_pct.toFixed(2)}%
            </ResultValue>
          </ResultCard>

          <ComparisonSection>
            <ComparisonTitle>Situação Comparativa</ComparisonTitle>
            
            <ComparisonCard>
              <ComparisonCardTitle>Situação Atual</ComparisonCardTitle>
              <ComparisonRow>
                <span>Receita Bruta:</span>
                <strong>{currency.format(simulacao.receita_bruta_atual)}</strong>
              </ComparisonRow>
              <ComparisonRow>
                <span>Comissões:</span>
                <strong style={{ color: '#ef4444' }}>-{currency.format(simulacao.comissoes_atual)}</strong>
              </ComparisonRow>
              <ComparisonRow>
                <span>Receita Líquida:</span>
                <strong>{currency.format(simulacao.receita_liquida_atual)}</strong>
              </ComparisonRow>
            </ComparisonCard>

            <ComparisonCard>
              <ComparisonCardTitle>Simulação ({pctCanalProprio}% próprio)</ComparisonCardTitle>
              <ComparisonRow>
                <span>Receita Bruta:</span>
                <strong>{currency.format(simulacao.receita_bruta_simulada)}</strong>
              </ComparisonRow>
              <ComparisonRow>
                <span>Comissões:</span>
                <strong style={{ color: '#ef4444' }}>-{currency.format(simulacao.comissoes_simulada)}</strong>
              </ComparisonRow>
              <ComparisonRow>
                <span>Receita Líquida:</span>
                <strong style={{ color: '#22c55e' }}>{currency.format(simulacao.receita_liquida_simulada)}</strong>
              </ComparisonRow>
            </ComparisonCard>
          </ComparisonSection>
        </ResultsSection>
      )}
    </Container>
  );
};

export default SimulacaoMix;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
`;

const SliderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #4a5568;
`;

const SliderValue = styled.span`
  font-weight: 600;
  color: #92400e;
  font-size: 1rem;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #92400e 0%, #92400e var(--value, 50%), #e2e8f0 var(--value, 50%), #e2e8f0 100%);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  
  &::-webkit-slider-runnable-track {
    background: transparent;
    height: 8px;
    border-radius: 4px;
  }
  
  &::-moz-range-track {
    background: transparent;
    height: 8px;
    border-radius: 4px;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #92400e;
    cursor: pointer;
    margin-top: -6px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #92400e;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SliderMarks = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #718096;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.875rem;
`;

const ErrorText = styled.p`
  text-align: center;
  color: #ef4444;
  font-size: 0.875rem;
`;

const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultCard = styled.div<{ highlight?: boolean }>`
  background: ${props => props.highlight ? '#f0fdf4' : '#f8fafc'};
  border-radius: 8px;
  padding: 1rem;
  border: ${props => props.highlight ? '2px solid #22c55e' : '1px solid #e2e8f0'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ResultLabel = styled.span`
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
`;

const ResultValue = styled.span<{ color?: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.color || '#1a202c'};
`;

const ComparisonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const ComparisonTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const ComparisonCard = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ComparisonCardTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ComparisonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #4a5568;
  
  span {
    color: #718096;
  }
`;

