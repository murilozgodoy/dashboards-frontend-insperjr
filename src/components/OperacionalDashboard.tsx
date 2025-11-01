import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import KPICard from './KPICard';
import { apiService } from '../services/api';
import { 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiTrendingUp,
  FiAlertCircle
} from 'react-icons/fi';

import TempoPreparoTempoChart from './TempoPreparoTempoChart';
import TempoEntregaDistanciaChart from './TempoEntregaDistanciaChart';
import EtaVsRealChart from './EtaVsRealChart';
import DistribuicaoTemposChart from './DistribuicaoTemposChart';
import PrecisaoEtaHoraChart from './PrecisaoEtaHoraChart';
import TemposPorModoChart from './TemposPorModoChart';

const OperacionalDashboard: React.FC = () => {
  const [defaultInicio, setDefaultInicio] = useState<string | null>(null);
  const [defaultFim, setDefaultFim] = useState<string | null>(null);
  const [thresholdAtraso, setThresholdAtraso] = useState<number>(10);
  const [thresholdInput, setThresholdInput] = useState<string>('10');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [kpis, setKpis] = useState<any | null>(null);
  const [tempoPreparoTempo, setTempoPreparoTempo] = useState<{ periodo: string; tempo_medio: number }[]>([]);
  const [tempoEntregaDistancia, setTempoEntregaDistancia] = useState<{ faixa: string; tempo_medio: number; quantidade: number }[]>([]);
  const [etaVsReal, setEtaVsReal] = useState<{ tipo: string; tempo: number }[]>([]);
  const [distribuicaoPreparo, setDistribuicaoPreparo] = useState<{ faixa: string; quantidade: number }[]>([]);
  const [distribuicaoEntrega, setDistribuicaoEntrega] = useState<{ faixa: string; quantidade: number }[]>([]);
  const [precisaoEtaHora, setPrecisaoEtaHora] = useState<{ hora: number; precisao_pct: number; total_pedidos: number }[]>([]);
  const [temposPorModo, setTemposPorModo] = useState<{ modo: string; tempo_preparo_medio: number; tempo_entrega_medio: number; quantidade: number }[]>([]);
  const [atrasos, setAtrasos] = useState<any[]>([]);

  const loadData = async (inicio: string, fim: string, threshold?: number) => {
    const thresholdToUse = threshold !== undefined ? threshold : thresholdAtraso;
    try {
      setLoading(true);
      const [
        kpisData,
        tempoPreparo,
        tempoEntrega,
        etaReal,
        distPreparo,
        distEntrega,
        precisaoHora,
        temposModo,
        atrasosData
      ] = await Promise.all([
        apiService.getOperacionalKpis({ inicio, fim, threshold_minutos: thresholdToUse }),
        apiService.getOperacionalTempoPreparoTempo({ granularidade: 'dia', inicio, fim }),
        apiService.getOperacionalTempoEntregaDistancia({ inicio, fim }),
        apiService.getOperacionalEtaVsReal({ inicio, fim }),
        apiService.getOperacionalDistribuicaoTempos({ tipo: 'preparo', inicio, fim }),
        apiService.getOperacionalDistribuicaoTempos({ tipo: 'entrega', inicio, fim }),
        apiService.getOperacionalPrecisaoEtaHora({ inicio, fim }),
        apiService.getOperacionalTemposPorModo({ inicio, fim }),
        apiService.getOperacionalAtrasos({ threshold_minutos: thresholdToUse, inicio, fim, limit: 20 })
      ]);

      setKpis(kpisData);
      setTempoPreparoTempo(tempoPreparo.dados);
      setTempoEntregaDistancia(tempoEntrega.dados);
      setEtaVsReal(etaReal.dados);
      setDistribuicaoPreparo(distPreparo.faixas);
      setDistribuicaoEntrega(distEntrega.faixas);
      setPrecisaoEtaHora(precisaoHora.dados);
      setTemposPorModo(temposModo.dados);
      setAtrasos(atrasosData.dados);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar dados operacionais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        setLoading(true);
        const bounds = await apiService.getHomeDateBounds();
        const maxDate = bounds.max || new Date().toISOString().slice(0,10);
        const d = new Date(maxDate + 'T00:00:00');
        const monthStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        const inicio = `${monthStr}-01`;
        const fim = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10);
        
        if (mounted) {
          setDefaultInicio(inicio);
          setDefaultFim(fim);
        }
        
        await loadData(inicio, fim);
        if (mounted) {
          setThresholdInput(thresholdAtraso.toString());
        }
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dashboard operacional');
      } finally {
        setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  const handleApplyThreshold = () => {
    const newThreshold = parseInt(thresholdInput) || 10;
    if (newThreshold >= 0 && newThreshold <= 60) {
      setThresholdAtraso(newThreshold);
      if (defaultInicio && defaultFim) {
        loadData(defaultInicio, defaultFim, newThreshold);
      }
    } else {
      setThresholdInput(thresholdAtraso.toString());
    }
  };

  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio, fim } = e.detail || {};
      if (!inicio || !fim) return;
      loadData(inicio, fim);
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  const kpiCards = useMemo(() => {
    if (!kpis) return [] as any[];
    return [
      {
        title: 'Pedidos Entregues no Prazo',
        value: `${kpis.precisao_eta_pct?.toFixed(1) || 0}%`,
        change: undefined, // Não mostra variação, apenas o valor
        icon: <FiCheckCircle />, 
        color: kpis.precisao_eta_pct >= 80 ? 'green' : kpis.precisao_eta_pct >= 60 ? 'orange' : 'red' as const
      },
      {
        title: 'Taxa de Atraso',
        value: `${kpis.taxa_atraso_pct?.toFixed(1) || 0}%`,
        change: undefined, // Não mostra variação
        icon: <FiAlertCircle />, 
        color: kpis.taxa_atraso_pct < 10 ? 'green' : kpis.taxa_atraso_pct < 20 ? 'orange' : 'red' as const
      },
      {
        title: 'Eficiência Média',
        value: `${kpis.eficiencia_media?.toFixed(2) || 0}`,
        change: undefined, // Não mostra variação
        icon: <FiTrendingUp />, 
        color: 'blue' as const
      },
      {
        title: 'Desempenho ETA',
        value: `${kpis.desempenho_eta >= 0 ? '+' : ''}${kpis.desempenho_eta?.toFixed(1) || 0}%`,
        change: undefined, // O próprio valor já indica a variação
        icon: <FiClock />, 
        color: Math.abs(kpis.desempenho_eta) < 5 ? 'green' : Math.abs(kpis.desempenho_eta) < 15 ? 'orange' : 'red' as const
      }
    ];
  }, [kpis, thresholdAtraso]);

  return (
    <Layout 
      title="Operacional" 
      subtitle="Tempos, precisão de ETA e eficiência"
    >
      <DashboardContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {/* Filtro de Threshold */}
        <FiltroContainer>
          <FiltroLabel>Limite de Atraso (minutos):</FiltroLabel>
          <FiltroInputWrapper>
            <FiltroInput
              type="number"
              min="0"
              max="60"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyThreshold();
                }
              }}
            />
            <FiltroButton onClick={handleApplyThreshold}>
              Aplicar
            </FiltroButton>
          </FiltroInputWrapper>
        </FiltroContainer>

        {/* KPIs */}
        <KPISection>
          <SectionTitle>Indicadores de Eficiência</SectionTitle>
          <KPIGrid>
            {kpiCards.map((kpi: any, index: number) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </KPIGrid>
        </KPISection>

        {/* Análise de Tempos */}
        <SecaoGraficos>
          <SectionTitle>Análise de Tempos</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Tempo Médio de Preparo ao Longo do Tempo</TituloGrafico>
                <SubtituloGrafico>Evolução diária do tempo de preparo</SubtituloGrafico>
              </CabecalhoGrafico>
              {tempoPreparoTempo.length ? (
                <TempoPreparoTempoChart data={tempoPreparoTempo} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Tempo de Entrega por Distância</TituloGrafico>
                <SubtituloGrafico>Tempo médio por faixa de distância</SubtituloGrafico>
              </CabecalhoGrafico>
              {tempoEntregaDistancia.length ? (
                <TempoEntregaDistanciaChart data={tempoEntregaDistancia} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Comparação ETA vs Tempo Real</TituloGrafico>
                <SubtituloGrafico>ETA estimado versus tempo real de entrega</SubtituloGrafico>
              </CabecalhoGrafico>
              {etaVsReal.length ? (
                <EtaVsRealChart data={etaVsReal} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>

        {/* Distribuição de Tempos */}
        <SecaoGraficos>
          <SectionTitle>Distribuição de Tempos</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Distribuição de Tempos de Preparo</TituloGrafico>
                <SubtituloGrafico>Quantidade de pedidos por faixa de tempo</SubtituloGrafico>
              </CabecalhoGrafico>
              {distribuicaoPreparo.length ? (
                <DistribuicaoTemposChart data={distribuicaoPreparo} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Distribuição de Tempos de Entrega</TituloGrafico>
                <SubtituloGrafico>Quantidade de pedidos por faixa de tempo</SubtituloGrafico>
              </CabecalhoGrafico>
              {distribuicaoEntrega.length ? (
                <DistribuicaoTemposChart data={distribuicaoEntrega} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>

        {/* Precisão e Modos */}
        <SecaoGraficos>
          <SectionTitle>Precisão e Análise por Modo</SectionTitle>
          <GradeGraficos>
            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Precisão do ETA por Hora do Dia</TituloGrafico>
                <SubtituloGrafico>Taxa de precisão do ETA ao longo do dia</SubtituloGrafico>
              </CabecalhoGrafico>
              {precisaoEtaHora.length ? (
                <PrecisaoEtaHoraChart data={precisaoEtaHora} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>

            <ContainerGrafico>
              <CabecalhoGrafico>
                <TituloGrafico>Tempos por Modo de Pedido</TituloGrafico>
                <SubtituloGrafico>Tempo médio de preparo e entrega por modo</SubtituloGrafico>
              </CabecalhoGrafico>
              {temposPorModo.length ? (
                <TemposPorModoChart data={temposPorModo} />
              ) : (
                <PlaceholderGrafico><TextoPlaceholder>Sem dados</TextoPlaceholder></PlaceholderGrafico>
              )}
            </ContainerGrafico>
          </GradeGraficos>
        </SecaoGraficos>

        {/* Tabela de Atrasos */}
        {atrasos.length > 0 && (
          <SecaoGraficos>
            <SectionTitle>Pedidos com Atraso &gt; {thresholdAtraso} minutos</SectionTitle>
            <TabelaContainer>
              <Tabela>
                <thead>
                  <Tr>
                    <Th>Data</Th>
                    <Th>Cliente</Th>
                    <Th>ETA (min)</Th>
                    <Th>Real (min)</Th>
                    <Th>Atraso (min)</Th>
                    <Th>Distância (km)</Th>
                    <Th>Plataforma</Th>
                  </Tr>
                </thead>
                <tbody>
                  {atrasos.map((atraso, index) => (
                    <Tr key={index}>
                      <Td>{atraso.data ? new Date(atraso.data).toLocaleDateString('pt-BR') : '-'}</Td>
                      <Td>{atraso.nome_cliente || '-'}</Td>
                      <Td>{atraso.eta_minutos.toFixed(0)}</Td>
                      <Td>{atraso.tempo_real_minutos.toFixed(0)}</Td>
                      <Td $isAtraso={true}>{atraso.atraso_minutos.toFixed(0)}</Td>
                      <Td>{atraso.distancia_km.toFixed(1)}</Td>
                      <Td>{atraso.platform || '-'}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Tabela>
            </TabelaContainer>
          </SecaoGraficos>
        )}
      </DashboardContainer>
    </Layout>
  );
};

export default OperacionalDashboard;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 12px;
  border-radius: 8px;
`;

const FiltroContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FiltroLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
`;

const FiltroInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FiltroInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FiltroButton = styled.button`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const KPISection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SecaoGraficos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GradeGraficos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ContainerGrafico = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 350px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: 300px;
    border-radius: 12px;
  }
`;

const CabecalhoGrafico = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
`;

const TituloGrafico = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const SubtituloGrafico = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
`;

const PlaceholderGrafico = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
`;

const TextoPlaceholder = styled.p`
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
`;

const TabelaContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow-x: auto;
`;

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f8fafc;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td<{ $isAtraso?: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${props => props.$isAtraso ? '#ef4444' : '#1a202c'};
  font-weight: ${props => props.$isAtraso ? 600 : 400};
`;

