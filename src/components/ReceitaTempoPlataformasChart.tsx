import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

interface DadosPeriodo {
  periodo: string;
  [key: string]: string | number;
}

interface ReceitaTempoPlataformasChartProps {
  dados: DadosPeriodo[];
  granularidade: 'dia' | 'semana' | 'mes';
  metric: 'receita' | 'pedidos';
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

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const ReceitaTempoPlataformasChart: React.FC<ReceitaTempoPlataformasChartProps> = ({ dados, granularidade, metric }) => {
  const plataformas = useMemo(() => {
    if (dados.length === 0) return [];
    
    const platforms = new Set<string>();
    dados.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'periodo') {
          platforms.add(key);
        }
      });
    });
    return Array.from(platforms);
  }, [dados]);

  const formatValue = (value: number) => {
    if (metric === 'receita') {
      return currency.format(value);
    }
    return value.toLocaleString('pt-BR');
  };

  const formatLabel = (label: string) => {
    if (granularidade === 'dia') {
      return new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } else if (granularidade === 'semana') {
      return new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } else {
      return new Date(label).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    }
  };

  if (dados.length === 0 || plataformas.length === 0) {
    return (
      <Container>
        <MensagemVazio>Sem dados para exibir</MensagemVazio>
      </Container>
    );
  }

  return (
    <Container>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="periodo" 
            tick={{ fontSize: 12 }}
            tickFormatter={formatLabel}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => metric === 'receita' ? `R$ ${(value / 1000).toFixed(0)}k` : value.toString()}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number) => formatValue(value)}
            labelFormatter={(label) => formatLabel(label)}
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
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default ReceitaTempoPlataformasChart;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const MensagemVazio = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #a0aec0;
  font-size: 0.875rem;
`;


