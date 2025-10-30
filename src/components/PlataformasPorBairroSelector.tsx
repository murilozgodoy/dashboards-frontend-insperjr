import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';
import { apiService } from '../services/api';

interface PlataformasPorBairroSelectorProps {
  inicio: string;
  fim: string;
}

const PlataformasPorBairroSelector: React.FC<PlataformasPorBairroSelectorProps> = ({ inicio, fim }) => {
  const [bairros, setBairros] = useState<{ bairro: string; total_pedidos: number }[]>([]);
  const [bairroSelecionado, setBairroSelecionado] = useState<string>('');
  const [dadosPlataformas, setDadosPlataformas] = useState<{ plataforma: string; pedidos: number; percentual: number }[]>([]);
  const [totalPedidos, setTotalPedidos] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentInicio, setCurrentInicio] = useState(inicio);
  const [currentFim, setCurrentFim] = useState(fim);

  // Cores para as plataformas
  const CORES_PLATAFORMAS: { [key: string]: string } = {
    'ifood': '#EA1D2C',
    'rappi': '#FF6B00',
    'site_proprio': '#3b82f6',
    'whatsapp': '#25D366'
  };

  // Escuta mudanças de data
  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio: newInicio, fim: newFim } = e.detail || {};
      if (newInicio && newFim) {
        setCurrentInicio(newInicio);
        setCurrentFim(newFim);
      }
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  useEffect(() => {
    async function loadBairros() {
      try {
        setLoading(true);
        const result = await apiService.getGeografiaListaBairros({ inicio: currentInicio, fim: currentFim });
        setBairros(result.bairros);
        
        // Seleciona o primeiro bairro automaticamente
        if (result.bairros.length > 0) {
          setBairroSelecionado(result.bairros[0].bairro);
        }
      } catch (error) {
        console.error('Erro ao carregar bairros:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBairros();
  }, [currentInicio, currentFim]);

  useEffect(() => {
    async function loadPlataformas() {
      if (!bairroSelecionado) return;
      
      try {
        setLoading(true);
        const result = await apiService.getGeografiaPlataformasPorBairro(bairroSelecionado, { inicio: currentInicio, fim: currentFim });
        setDadosPlataformas(result.dados);
        setTotalPedidos(result.total);
      } catch (error) {
        console.error('Erro ao carregar plataformas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPlataformas();
  }, [bairroSelecionado, currentInicio, currentFim]);

  const dadosGrafico = dadosPlataformas.map(item => ({
    name: item.plataforma,
    value: item.pedidos,
    percentual: item.percentual
  }));

  const getCorPlataforma = (plataforma: string) => {
    const plat = plataforma.toLowerCase();
    return CORES_PLATAFORMAS[plat] || '#718096';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <TooltipContainer>
          <TooltipLabel>{payload[0].name}</TooltipLabel>
          <TooltipValue>{payload[0].value} pedidos</TooltipValue>
          <TooltipPercentual>{payload[0].payload.percentual.toFixed(2)}%</TooltipPercentual>
        </TooltipContainer>
      );
    }
    return null;
  };

  return (
    <Container>
      <SelectorContainer>
        <Label>Selecione um bairro:</Label>
        <Select 
          value={bairroSelecionado} 
          onChange={(e) => setBairroSelecionado(e.target.value)}
        >
          {bairros.map((b) => (
            <option key={b.bairro} value={b.bairro}>
              {b.bairro} ({b.total_pedidos} pedidos)
            </option>
          ))}
        </Select>
      </SelectorContainer>

      {loading ? (
        <LoadingText>Carregando...</LoadingText>
      ) : dadosPlataformas.length > 0 ? (
        <>
          <InfoContainer>
            <InfoText>
              Total de pedidos em <strong>{bairroSelecionado}</strong>: <strong>{totalPedidos}</strong>
            </InfoText>
          </InfoContainer>

          <ChartContainer>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentual }) => `${name}: ${percentual.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCorPlataforma(entry.name)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <DetailsContainer>
            {dadosPlataformas.map((plat, index) => (
              <DetailItem key={index}>
                <DetailColor style={{ backgroundColor: getCorPlataforma(plat.plataforma) }} />
                <DetailText>
                  <strong>{plat.plataforma}</strong>: {plat.pedidos} pedidos ({plat.percentual.toFixed(2)}%)
                </DetailText>
              </DetailItem>
            ))}
          </DetailsContainer>
        </>
      ) : (
        <NoDataText>Sem dados para o bairro selecionado</NoDataText>
      )}
    </Container>
  );
};

export default PlataformasPorBairroSelector;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e0;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const InfoContainer = styled.div`
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #4a5568;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DetailColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
`;

const DetailText = styled.span`
  font-size: 0.875rem;
  color: #4a5568;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.875rem;
`;

const NoDataText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.875rem;
  padding: 2rem;
`;

const TooltipContainer = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
`;

const TooltipLabel = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
`;

const TooltipValue = styled.div`
  color: #4a5568;
  font-size: 0.875rem;
`;

const TooltipPercentual = styled.div`
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 600;
`;

