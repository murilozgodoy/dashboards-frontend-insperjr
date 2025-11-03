import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import KPICard from './KPICard';
import { FiTrendingUp } from 'react-icons/fi';
import { apiService } from '../services/api';
import { CHART_COLORS } from '../config/colors';
import DistribuicaoPlataformasChart from './DistribuicaoPlataformasChart';
import ReceitaTempoPlataformasChart from './ReceitaTempoPlataformasChart';
import TemposMediosPlataformasChart from './TemposMediosPlataformasChart';
import SatisfacaoPlataformasChart from './SatisfacaoPlataformasChart';
import VolumeHoraPlataformasChart from './VolumeHoraPlataformasChart';
import ModosPedidoPlataformasChart from './ModosPedidoPlataformasChart';

const PlataformasDashboard: React.FC = () => {
  const [currentInicio, setCurrentInicio] = useState<string>('');
  const [currentFim, setCurrentFim] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const [distribuicao, setDistribuicao] = useState<{ nome: string; pedidos?: number; receita?: number; pct: number }[]>([]);
  const [receitaTempo, setReceitaTempo] = useState<{ granularidade: 'dia'|'semana'|'mes'; metric: 'receita'|'pedidos'; dados: any[] } | null>(null);
  const [temposMedios, setTemposMedios] = useState<any[]>([]);
  const [satisfacao, setSatisfacao] = useState<any[]>([]);
  const [volumeHora, setVolumeHora] = useState<any[]>([]);
  const [volumeDiaSemana, setVolumeDiaSemana] = useState<any[]>([]);
  const [modosPedido, setModosPedido] = useState<{ plataforma: string; delivery: number; retirada: number; total: number }[]>([]);
  
  
  const [metric, setMetric] = useState<'receita' | 'pedidos'>('receita');
  const [granularidade, setGranularidade] = useState<'dia' | 'semana' | 'mes'>('semana');

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const bounds = await apiService.getHomeDateBounds();
        const maxDate = bounds.max || new Date().toISOString().slice(0,10);
        const d = new Date(maxDate + 'T00:00:00');
        const monthStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        const inicio = `${monthStr}-01`;
        const fim = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10);
        if (mounted) {
          setCurrentInicio(inicio);
          setCurrentFim(fim);
        }
      } catch (e: any) {
        console.error('Erro ao inicializar:', e);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  const loadData = async (inicio: string, fim: string) => {
    try {
      setLoading(true);
      const [
        distData,
        receitaTempoData,
        temposData,
        satisfacaoData,
        volumeHoraData,
        volumeDiaSemanaData,
        modosPedidoData
      ] = await Promise.all([
        apiService.getHomePlataformas({ inicio, fim, metric: 'receita' }),
        apiService.getPlataformasReceitaTempo({ granularidade, metric, inicio, fim }),
        apiService.getPlataformasTemposMedios({ inicio, fim }),
        apiService.getPlataformasSatisfacao({ inicio, fim }),
        apiService.getPlataformasVolumeHora({ inicio, fim }),
        apiService.getPlataformasVolumeDiaSemana({ inicio, fim }),
        apiService.getPlataformasModosPedido({ inicio, fim })
      ]);

      setDistribuicao(distData.plataformas);
      setReceitaTempo(receitaTempoData);
      setTemposMedios(temposData.plataformas);
      setSatisfacao(satisfacaoData.plataformas);
      setVolumeHora(volumeHoraData.dados);
      setVolumeDiaSemana(volumeDiaSemanaData.dados);
      setModosPedido(modosPedidoData.plataformas);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar dados das plataformas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentInicio && currentFim) {
      loadData(currentInicio, currentFim);
    }
  }, [currentInicio, currentFim, granularidade, metric]);

  useEffect(() => {
    function onDateRange(e: any) {
      const { inicio, fim } = e.detail || {};
      if (inicio && fim) {
        setCurrentInicio(inicio);
        setCurrentFim(fim);
      }
    }
    window.addEventListener('dateRangeChange', onDateRange as any);
    return () => window.removeEventListener('dateRangeChange', onDateRange as any);
  }, []);

  const kpiCards = useMemo(() => {
    if (!distribuicao || distribuicao.length === 0) return [] as any[];
    
    const totalReceita = distribuicao.reduce((sum, p) => sum + (p.receita || 0), 0);
    

    const plataformaDominante = distribuicao.length > 0 ? distribuicao[0] : null;

    const marketShare = plataformaDominante && totalReceita > 0
      ? ((plataformaDominante.receita || 0) / totalReceita) * 100
      : null;

    const cards: any[] = [];

    if (marketShare !== null && plataformaDominante) {
      cards.push({
        title: `Market Share Receita - ${plataformaDominante.nome}`,
        value: `${marketShare.toFixed(1)}%`,
        change: undefined,
        icon: <FiTrendingUp />,
        color: 'orange' as const,
        description: 'Porcentagem da receita total que a plataforma líder representa'
      });
    }

    return cards;
  }, [distribuicao]);

  if (loading && !distribuicao.length) {
    return (
      <Layout title="Plataformas & Canais" subtitle="Comparação entre canais e marketplaces">
        <LoadingMessage>Carregando dados...</LoadingMessage>
      </Layout>
    );
  }

  return (
    <Layout title="Plataformas & Canais" subtitle="Comparação entre canais e marketplaces">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <KPIGrid>
        {kpiCards.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </KPIGrid>

      <Section>
        <ChartCard>
          <CabecalhoGrafico>
            <div>
              <TituloGrafico>Evolução Temporal por Plataforma</TituloGrafico>
              <SubtituloGrafico>
                {metric === 'receita' ? 'Receita' : 'Pedidos'} ao longo do tempo por plataforma
              </SubtituloGrafico>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LabelFiltro>Período:</LabelFiltro>
                <ToggleGroup>
                  <ToggleButton 
                    $active={granularidade === 'dia'}
                    onClick={() => setGranularidade('dia')}
                  >
                    Dia
                  </ToggleButton>
                  <ToggleButton 
                    $active={granularidade === 'semana'}
                    onClick={() => setGranularidade('semana')}
                  >
                    Semana
                  </ToggleButton>
                  <ToggleButton 
                    $active={granularidade === 'mes'}
                    onClick={() => setGranularidade('mes')}
                  >
                    Mês
                  </ToggleButton>
                </ToggleGroup>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LabelFiltro>Métrica:</LabelFiltro>
                <ToggleGroup>
                  <ToggleButton 
                    $active={metric === 'receita'}
                    onClick={() => setMetric('receita')}
                  >
                    Receita
                  </ToggleButton>
                  <ToggleButton 
                    $active={metric === 'pedidos'}
                    onClick={() => setMetric('pedidos')}
                  >
                    Pedidos
                  </ToggleButton>
                </ToggleGroup>
              </div>
            </div>
          </CabecalhoGrafico>
          {receitaTempo && (
            <ReceitaTempoPlataformasChart 
              dados={receitaTempo.dados} 
              granularidade={receitaTempo.granularidade}
              metric={receitaTempo.metric}
            />
          )}
        </ChartCard>
      </Section>

      <Section>
        <ChartGrid>
          <ChartCard>
            <CabecalhoGrafico>
              <TituloGrafico>Distribuição por Plataforma</TituloGrafico>
              <ToggleGroup>
                <ToggleButton 
                  $active={true}
                  onClick={() => {}}
                >
                  Receita
                </ToggleButton>
              </ToggleGroup>
            </CabecalhoGrafico>
            <DistribuicaoPlataformasChart data={distribuicao} mode="bar" />
          </ChartCard>

          <ChartCard>
            <ModosPedidoPlataformasChart dados={modosPedido} />
          </ChartCard>
        </ChartGrid>
      </Section>

      <Section>
        <ChartGrid>
          <ChartCard>
            <TemposMediosPlataformasChart dados={temposMedios} />
          </ChartCard>
          <ChartCard>
            <SatisfacaoPlataformasChart dados={satisfacao} />
          </ChartCard>
        </ChartGrid>
      </Section>

      <Section>
        <ChartCard>
          <VolumeHoraPlataformasChart dados={volumeHora} dadosDiaSemana={volumeDiaSemana} />
        </ChartCard>
      </Section>

    </Layout>
  );
};

export default PlataformasDashboard;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CabecalhoGrafico = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TituloGrafico = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const SubtituloGrafico = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  color: #718096;
  margin-top: 0.25rem;
`;

const LabelFiltro = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.025em;
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